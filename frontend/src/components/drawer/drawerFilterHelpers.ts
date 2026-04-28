import type { TimelineFilter } from "../../features/filter/components/TimelineFilter";
import { DEFAULT_TIMELINE_FILTER } from "../../features/filter/components/TimelineFilter";
import { collapseData } from "../../utils/drawerValues";

export function parseYearInput(
  raw: string,
  min: number,
  max: number,
): number | undefined | "invalid" {
  const trimmed = raw.trim();

  if (trimmed === "" || trimmed === "-") {
    return undefined;
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return "invalid";
  }

  const num = Number(trimmed);

  if (!Number.isInteger(num) || num < min || num > max) {
    return "invalid";
  }

  return num;
}

export function getThemeCount(filter: TimelineFilter) {
  return filter.group !== 0 ? 1 : 0;
}

export function getSectionCount(
  filter: TimelineFilter,
  section: (typeof collapseData)[number],
) {
  return section.options.reduce((acc, opt) => {
    const arr = filter[opt.name as keyof TimelineFilter] as string[] | undefined;
    return acc + (arr?.includes(opt.value) ? 1 : 0);
  }, 0);
}

export function getDateCount(filter: TimelineFilter) {
  return (
    (filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) +
    (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0)
  );
}