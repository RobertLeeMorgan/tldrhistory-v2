import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import { DEFAULT_TIMELINE_FILTER } from "../../filter/components/TimelineFilter";
import { searchParamsToPartialFilter } from "../../filter/components/timelineFilterParams";
import { getGroupIdFromSlug } from "../../../utils/groupLookup";

function normalizeFilter(filter: TimelineFilter): TimelineFilter {
  const trimmedSearch = filter.search?.trim();

  return {
    ...filter,
    search: trimmedSearch ? trimmedSearch : undefined,
    sortBy: filter.sortBy ?? DEFAULT_TIMELINE_FILTER.sortBy,
    type: filter.type ?? DEFAULT_TIMELINE_FILTER.type,
    subject: filter.subject ?? DEFAULT_TIMELINE_FILTER.subject,
    continent: filter.continent ?? DEFAULT_TIMELINE_FILTER.continent,
    group: filter.group ?? DEFAULT_TIMELINE_FILTER.group,
    yearStart: filter.yearStart ?? DEFAULT_TIMELINE_FILTER.yearStart,
    yearEnd: filter.yearEnd ?? DEFAULT_TIMELINE_FILTER.yearEnd,
  };
}

export function buildTimelineFilterFromUrl(args: {
  groupSlug?: string;
  requestUrl: string;
}): TimelineFilter {
  const url = new URL(args.requestUrl);
  const partial = searchParamsToPartialFilter(url.searchParams);
  const group =
    getGroupIdFromSlug(args.groupSlug ?? null) ??
    DEFAULT_TIMELINE_FILTER.group;

  return normalizeFilter({
    ...DEFAULT_TIMELINE_FILTER,
    ...partial,
    group,
  });
}