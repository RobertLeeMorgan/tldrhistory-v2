import { Filter } from "../generatePosts";

export function buildConditions(filter: Filter, theme: string) {
  const parts: string[] = [];

  if (theme?.length) {
    parts.push(`for ${theme}`);
  }

  if (filter.search?.length) {
    parts.push(`matching ${filter.search}`);
  }

  if (filter.continent?.length) {
    parts.push(`in ${filter.continent.join(", ")}`);
  }

  if (filter.yearStart && filter.yearEnd) {
    parts.push(`occurring within ${filter.yearStart}–${filter.yearEnd}`);
  }

  return parts.join(", ");
}