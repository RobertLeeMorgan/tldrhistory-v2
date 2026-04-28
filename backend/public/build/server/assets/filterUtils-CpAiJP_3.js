import { D as DEFAULT_TIMELINE_FILTER } from "./server-build-Ce5HpZmf.js";
const checkActiveFilters = (filter) => filter.group !== DEFAULT_TIMELINE_FILTER.group || filter.type.length > 0 || filter.subject.length > 0 || filter.continent.length > 0 || filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart || filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd;
const hasActiveState = (filter) => checkActiveFilters(filter) || !!filter.search?.trim();
export {
  hasActiveState as h
};
