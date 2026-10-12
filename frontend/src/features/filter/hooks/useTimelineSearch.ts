import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useTimelineFilter } from "../../../context/FilterContext";

export function useTimelineSearch() {
  const { filter, patchFilter } = useTimelineFilter();
  const location = useLocation();
  const [draft, setDraft] = useState({
    value: filter.search ?? "",
    locationKey: location.key,
  });
  if (draft.locationKey !== location.key) {
    setDraft({ value: filter.search ?? "", locationKey: location.key });
  }
  const value = draft.locationKey === location.key ? draft.value : filter.search ?? "";
  const setValue = useCallback(
    (nextValue: string) => setDraft({ value: nextValue, locationKey: location.key }),
    [location.key],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = value.trim() || undefined;
      if (nextSearch !== filter.search) {
        patchFilter({ search: nextSearch }, { replace: true });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filter.search, location.key, patchFilter, value]);

  const submit = useCallback(() => {
    const nextSearch = value.trim() || undefined;
    if (nextSearch !== filter.search) {
      patchFilter({ search: nextSearch }, { replace: true });
    }
  }, [filter.search, patchFilter, value]);

  const clear = useCallback(() => setValue(""), [setValue]);

  return { value, setValue, submit, clear };
}
