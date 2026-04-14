import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type { TimelineFilter } from "../features/filter/components/TimelineFilter";
import { DEFAULT_TIMELINE_FILTER } from "../features/filter/components/TimelineFilter";
import { filterToSearchParams, searchParamsToPartialFilter } from "../features/filter/components/TimelineFilterParams";
import { getGroupIdFromSlug, getGroupSlugFromId } from "../utils/groupLookup";

type SetFilterOptions = {
  replace?: boolean;
};

type TimelineFilterContextValue = {
  filter: TimelineFilter;
  setFilter: (next: TimelineFilter, options?: SetFilterOptions) => void;
  patchFilter: (
    patch: Partial<TimelineFilter>,
    options?: SetFilterOptions
  ) => void;
  resetFilter: (options?: SetFilterOptions) => void;
};

const TimelineFilterContext =
  createContext<TimelineFilterContextValue | null>(null);

function normalizeFilter(filter: TimelineFilter): TimelineFilter {
  return {
    ...filter,
    search: filter.search?.trim() || undefined,
    sortBy: filter.sortBy ?? DEFAULT_TIMELINE_FILTER.sortBy,
    type: filter.type ?? [],
    subject: filter.subject ?? [],
    continent: filter.continent ?? [],
    group: filter.group ?? DEFAULT_TIMELINE_FILTER.group,
    yearStart: filter.yearStart ?? DEFAULT_TIMELINE_FILTER.yearStart,
    yearEnd:  filter.yearEnd ?? DEFAULT_TIMELINE_FILTER.yearEnd,
  };
}

const DEFAULT_OPTIONS: SetFilterOptions = {
  replace: true,
};

function buildPath(group: number): string {
  const slug = getGroupSlugFromId(group);
  return slug ? `/timeline/${slug}` : "/timeline";
}

export function TimelineFilterProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const { groupSlug } = useParams<{ groupSlug?: string }>();
  const navigate = useNavigate();

  const filter = useMemo(() => {
    const partial = searchParamsToPartialFilter(searchParams);
    const group = getGroupIdFromSlug(groupSlug ?? null) ?? DEFAULT_TIMELINE_FILTER.group;

    return normalizeFilter({
      ...DEFAULT_TIMELINE_FILTER,
      ...partial,
      group,
    });
  }, [searchParams, groupSlug]);

  const setFilter = useCallback(
    (next: TimelineFilter, options: SetFilterOptions = DEFAULT_OPTIONS) => {
      const normalized = normalizeFilter(next);
      const pathname = buildPath(normalized.group);
      const search = filterToSearchParams(normalized).toString();

      navigate(
        {
          pathname,
          search: search ? `?${search}` : "",
        },
        { replace: options.replace ?? true }
      );
    },
    [navigate]
  );

  const patchFilter = useCallback(
    (patch: Partial<TimelineFilter>, options: SetFilterOptions = DEFAULT_OPTIONS) => {
      const next = normalizeFilter({
        ...filter,
        ...patch,
      });

      const pathname = buildPath(next.group);
      const search = filterToSearchParams(next).toString();

      navigate(
        {
          pathname,
          search: search ? `?${search}` : "",
        },
        { replace: options.replace ?? true }
      );
    },
    [filter, navigate]
  );

  const resetFilter = useCallback(
    (options: SetFilterOptions = DEFAULT_OPTIONS) => {
      navigate(
        {
          pathname: "/timeline",
          search: "",
        },
        { replace: options.replace ?? true }
      );
    },
    [navigate]
  );

  const value = useMemo(
    () => ({
      filter,
      setFilter,
      patchFilter,
      resetFilter,
    }),
    [filter, setFilter, patchFilter, resetFilter]
  );

  return (
    <TimelineFilterContext.Provider value={value}>
      {children}
    </TimelineFilterContext.Provider>
  );
}

export function useTimelineFilter() {
  const context = useContext(TimelineFilterContext);

  if (!context) {
    throw new Error("useTimelineFilter must be used within TimelineFilterProvider");
  }

  return context;
}