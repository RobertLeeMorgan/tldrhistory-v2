import { useEffect, useState } from "react";
import type { TimelineFilter } from "../../features/filter/components/TimelineFilter";
import { parseYearInput } from "./drawerFilterHelpers";

type Args = {
  filter: TimelineFilter;
  patchFilter: (patch: Partial<TimelineFilter>) => void;
};

export function useDrawerYearInputs({ filter, patchFilter }: Args) {
  const [yearStartInput, setYearStartInput] = useState(
    filter.yearStart !== undefined ? String(filter.yearStart) : "",
  );
  const [yearEndInput, setYearEndInput] = useState(
    filter.yearEnd !== undefined ? String(filter.yearEnd) : "",
  );

  useEffect(() => {
    const next = filter.yearStart !== undefined ? String(filter.yearStart) : "";
    if (next !== yearStartInput) {
      setYearStartInput(next);
    }
  }, [filter.yearStart]);

  useEffect(() => {
    const next = filter.yearEnd !== undefined ? String(filter.yearEnd) : "";
    if (next !== yearEndInput) {
      setYearEndInput(next);
    }
  }, [filter.yearEnd]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const nextStart = parseYearInput(yearStartInput, -300000, 2025);
      const nextEnd = parseYearInput(yearEndInput, -300000, 2025);

      if (nextStart === "invalid" || nextEnd === "invalid") return;

      if (
        nextStart !== undefined &&
        nextEnd !== undefined &&
        nextEnd < nextStart
      ) {
        return;
      }

      const patch: Partial<TimelineFilter> = {};

      if (nextStart !== filter.yearStart) {
        patch.yearStart = nextStart;
      }

      if (nextEnd !== filter.yearEnd) {
        patch.yearEnd = nextEnd;
      }

      if (Object.keys(patch).length > 0) {
        patchFilter(patch);
      }
    }, 300);

    return () => window.clearTimeout(id);
  }, [
    yearStartInput,
    yearEndInput,
    filter.yearStart,
    filter.yearEnd,
    patchFilter,
  ]);

  return {
    yearStartInput,
    yearEndInput,
    setYearStartInput,
    setYearEndInput,
  };
}