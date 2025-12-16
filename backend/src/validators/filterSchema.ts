import { z } from "zod";

export const filterSchema = z
  .object({
    type: z.array(z.enum(["person", "landmark", "event", "period"])).default([]),
    subject: z.array(z.enum([
      "military", "art", "economic", "environment", "intellectual",
      "religion", "maritime", "politics", "culture",
    ])).default([]),
    continent: z.array(z.enum([
      "MiddleEast", "NorthAmerica", "Antarctica", "SouthAmerica",
      "Oceania", "Asia", "Europe", "Africa", "Global"
    ])).default([]),
    yearStart: z.number().int().gte(-300000).lte(2025).optional(),
    yearEnd: z.number().int().gte(-300000).lte(2025).optional(),
    search: z.string().max(100).trim().default(""),
    group: z.number().optional(),
    sortBy: z.boolean().default(true),
  })
  .refine(
    (data) => !data.yearStart || !data.yearEnd || data.yearStart <= data.yearEnd,
    { message: "yearStart cannot be after yearEnd" }
  );
