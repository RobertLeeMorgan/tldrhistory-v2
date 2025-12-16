import { Filter } from "../generatePosts";

export function computeCount(filter: Filter, dbPostsLength: number, limit: number): number {
  if (filter.search?.length) return 1;

  if (filter.yearStart && filter.yearEnd) {
    const range = filter.yearEnd - filter.yearStart;

    if (range <= 5) return 1;
    if (range <= 100) return 3;
    return 5;
  }

  return limit - dbPostsLength;
}