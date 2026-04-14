import { z } from "zod";
import { getMaxDays } from "./dateValidation";

export const inputSchema = z
  .object({
    type: z.enum(["person", "landmark", "event", "period"]),
    name: z.string().min(4).max(100).trim(),
    startDescription: z.string().min(10).max(250).trim(),
    endDescription: z.string().max(250).trim().optional(),
    startYear: z.number().int().gte(-300000).lte(2026),
    startMonth: z.number().int().lte(12),
    startDay: z.number().int().lte(31),
    endYear: z.number().int().gte(-300000).lte(2026),
    endMonth: z.number().int().lte(12),
    endDay: z.number().int().lte(31),
    startSignificance: z.number().min(0).max(1).default(0),
    endSignificance: z.number().min(0).max(1).default(0),
    civilisation: z.boolean().default(false),
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
        { message: "Invalid URL" },
      ),
    cdnId: z.string().trim().optional(),
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
        { message: "Invalid URL" },
      ),
    imageCredit: z.string().nullable().optional(),
    country: z.object({
      name: z.string(),
    }),
    group: z
      .object({
        id: z.coerce.number().int().positive(),
        name: z.string(),
      })
      .nullable()
      .optional(),

    subjects: z
      .array(
        z.object({
          id: z.coerce.number().int().positive(),
          name: z.string(),
        }),
      )
      .min(1, "Select at least one subject"),
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
