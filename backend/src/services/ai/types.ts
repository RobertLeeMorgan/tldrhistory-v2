export type AIOutput = {
  name: string;

  type: "event" | "period" | "landmark" | "person";

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
}[];

export interface AIInput {
  start: number;
  end: number;
  count: number;
  subjectOptions: string[];
  existingNames: string[];
}
