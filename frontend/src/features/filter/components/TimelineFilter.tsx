import type { Continent, PostType } from "../../../generated/graphql";

export interface TimelineFilter {
  type: PostType[];
  subject: string[];
  continent: Continent[];
  yearStart?: number;
  yearEnd?: number;
  search?: string;
  sortBy?: boolean;
  group: number
}

export const DEFAULT_TIMELINE_FILTER: TimelineFilter = {
  type: [],
  subject: [],
  continent: [],
  yearStart: -300000,
  yearEnd: 2025,
  search: undefined,
  sortBy: true,
  group: 0,
};