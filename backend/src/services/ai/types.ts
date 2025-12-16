import { PostType } from "@prisma/client";

export type AIOutput = {
  name: string;

  type: PostType;

  startYear: number;
  startMonth: number;
  startDay: number;

  endYear: number;
  endMonth: number;
  endDay: number;

  startDescription: string;
  endDescription: string | null;

  startSignificance: number;
  endSignificance: number;

  sourceUrl?: string | null;

  country: string;
  subjects: string[];

  groupId?: number
}[];

export interface AIInput {
  count: number;
  subjectOptions: string[];
  existingNames: string[];
}
