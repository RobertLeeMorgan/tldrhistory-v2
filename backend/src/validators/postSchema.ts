import { z } from "zod";
import { getMaxDays } from "./dateValidation";
import prisma from "../server/client";

export const postSchema = z
  .object({
    type: z.enum(["person", "landmark", "event", "period"]),
    name: z.string().min(4).max(100).trim(),
    startDescription: z.string().min(10).max(250).trim(),
    endDescription: z.string().max(250).trim().optional(),
    startYear: z.number().int().gte(-300000).lte(2025),
    startMonth: z.number().int().lte(12),
    startDay: z.number().int().lte(31),
    endYear: z.number().int().gte(-300000).lte(2025),
    endMonth: z.number().int().lte(12),
    endDay: z.number().int().lte(31),
    startSignificance: z.number().min(0).max(1).default(0),
    endSignificance: z.number().min(0).max(1).default(0),
    imageUrl: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) =>
          !val ||
          (() => {
            try {
              new URL(val);
              return true;
            } catch {
              return false;
            }
          })(),
        { message: "Invalid URL" }
      ),
    sourceUrl: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Invalid URL" }
      ),
    imageCredit: z.string().optional(),
    countryId: z
      .string()
      .trim()
      .refine(
        async (val) => {
          const country = await prisma.country.findUnique({
            where: { name: val },
          });
          return !!country;
        },
        { message: "Location not recognised" }
      ),
    subjects: z.array(z.number().int()).refine(
      async (val) => {
        const subjects = await prisma.subject.findMany({
          where: { id: { in: val } },
        });
        return subjects.length === val.length;
      },
      { message: "Subject not recognised" }
    ),
  })
  .superRefine((data, ctx) => {
    const maxStart = getMaxDays(data.startYear, data.startMonth);
    if (data.startDay > maxStart) {
      ctx.addIssue({
        path: ["startDay"],
        message: "Invalid start day for the month/year",
        code: "custom",
      });
    }

    const maxEnd = getMaxDays(data.endYear, data.endMonth);
    if (data.endDay > maxEnd) {
      ctx.addIssue({
        path: ["endDay"],
        message: "Invalid end day for the month/year",
        code: "custom",
      });
    }
  });
