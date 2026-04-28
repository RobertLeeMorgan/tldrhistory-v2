import type { TimelineFilter } from "./TimelineFilter";
import { DEFAULT_TIMELINE_FILTER } from "./TimelineFilter";
import type { Continent, PostType } from "../../../generated/graphql";

function parseNumber(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function parseStringArray(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function searchParamsToPartialFilter(
  searchParams: URLSearchParams,
): Partial<TimelineFilter> {
  const search = searchParams.get("q") || undefined;
  const yearStart = parseNumber(searchParams.get("ys"));
  const yearEnd = parseNumber(searchParams.get("ye"));

  const sortParam = searchParams.get("o");
  const sortBy =
    sortParam === "desc"
      ? false
      : sortParam === "asc"
        ? true
        : DEFAULT_TIMELINE_FILTER.sortBy;

  return {
    type: parseStringArray(searchParams.get("t")) as PostType[],
    subject: parseStringArray(searchParams.get("s")),
    continent: parseStringArray(searchParams.get("c")) as Continent[],
    yearStart,
    yearEnd,
    search,
    sortBy,
  };
}

export function filterToSearchParams(
  filter: TimelineFilter,
  existingSearchParams?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existingSearchParams);

  // Clear only filter-owned params first
  params.delete("t");
  params.delete("s");
  params.delete("c");
  params.delete("ys");
  params.delete("ye");
  params.delete("q");
  params.delete("o");

  if (filter.type.length) {
    params.set("t", filter.type.join(","));
  }

  if (filter.subject.length) {
    params.set("s", filter.subject.join(","));
  }

  if (filter.continent.length) {
    params.set("c", filter.continent.join(","));
  }

  const isDefaultYearRange =
    filter.yearStart === DEFAULT_TIMELINE_FILTER.yearStart &&
    filter.yearEnd === DEFAULT_TIMELINE_FILTER.yearEnd;

  if (!isDefaultYearRange) {
    if (typeof filter.yearStart === "number") {
      params.set("ys", String(filter.yearStart));
    }

    if (typeof filter.yearEnd === "number") {
      params.set("ye", String(filter.yearEnd));
    }
  }

  if (filter.search) {
    params.set("q", filter.search);
  }

  if (filter.sortBy !== DEFAULT_TIMELINE_FILTER.sortBy) {
    params.set("o", filter.sortBy ? "asc" : "desc");
  }

  return params;
}