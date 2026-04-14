import {
  DEFAULT_TIMELINE_FILTER,
  type TimelineFilter,
} from "../features/filter/components/TimelineFilter";

export const checkActiveFilters = (filter: TimelineFilter) =>
  filter.group !== DEFAULT_TIMELINE_FILTER.group ||
  filter.type.length > 0 ||
  filter.subject.length > 0 ||
  filter.continent.length > 0 ||
  filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ||
  filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd;

export const hasActiveState = (filter: TimelineFilter) =>
  checkActiveFilters(filter) || !!filter.search?.trim();