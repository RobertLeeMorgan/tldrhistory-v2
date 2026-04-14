import { z } from "zod";
import { getMaxDays } from "./dateValidation";

export const postSchemaClient = z
  .object({
    type: z.enum(["person", "landmark", "event", "period"]),
    name: z.string().min(4).max(100).trim(),
    startDescription: z.string().min(10).max(250).trim(),
    endDescription: z.string().max(250).trim().optional(),

    startYear: z.number().int().gte(-300000).lte(2025),
    startMonth: z.number().int().min(0).max(12),
    startDay: z.number().int().min(0).max(31),

    endYear: z.number().int().gte(-300000).lte(2025),
    endMonth: z.number().int().min(0).max(12),
    endDay: z.number().int().min(0).max(31),
    civilisation: z.boolean().default(false),
    cdnId: z.string().optional(),
    imageUrl: z
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

    imageCredit: z.string().optional(),

    country: z.object({
      name: z.string(),
    }),

    group: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .optional(),
    subjects: z
      .array(
        z.object({
          id: z.string(),
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

export type PostFormData = z.infer<typeof postSchemaClient>;
