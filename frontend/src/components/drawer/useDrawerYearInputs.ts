import { useEffect, useState } from "react";
import type { TimelineFilter } from "../../features/filter/components/TimelineFilter";
import { parseYearInput } from "./drawerFilterHelpers";

type Args = {
  filter: TimelineFilter;
  patchFilter: (patch: Partial<TimelineFilter>) => void;
};

type YearDraft = {
  filterValue: number | undefined;
  input: string;
};

function formatYear(value: number | undefined) {
  return value !== undefined ? String(value) : "";
}

export function useDrawerYearInputs({ filter, patchFilter }: Args) {
  const [yearStartDraft, setYearStartDraft] = useState<YearDraft>(() => ({
    filterValue: filter.yearStart,
    input: formatYear(filter.yearStart),
  }));
  const [yearEndDraft, setYearEndDraft] = useState<YearDraft>(() => ({
    filterValue: filter.yearEnd,
    input: formatYear(filter.yearEnd),
  }));

  const yearStartInput =
    yearStartDraft.filterValue === filter.yearStart
      ? yearStartDraft.input
      : formatYear(filter.yearStart);
  const yearEndInput =
    yearEndDraft.filterValue === filter.yearEnd
      ? yearEndDraft.input
      : formatYear(filter.yearEnd);

  const setYearStartInput = (input: string) => {
    setYearStartDraft({ filterValue: filter.yearStart, input });
  };
  const setYearEndInput = (input: string) => {
    setYearEndDraft({ filterValue: filter.yearEnd, input });
  };

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
