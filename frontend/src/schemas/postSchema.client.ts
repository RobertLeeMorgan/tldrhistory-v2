import { z } from "zod";
import { getMaxDays } from "./dateValidation";

export const postSchemaClient = z
  .object({
    type: z.enum(["person", "landmark", "event", "period"]),
    name: z.string().trim().min(4).max(50),
    startDescription: z.string().trim().min(10).max(250),
    endDescription: z.string().trim().max(200).optional(),

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
      .nullable()
      .optional()
      .transform((group) => group?.id === 0 ? null : group),
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
    // Zero end-year is the existing sentinel for an unknown/open-ended date.
    // Compare only components known on both sides of an imprecise date.
    if (data.endYear !== 0 && (
      data.endYear < data.startYear ||
      (data.endYear === data.startYear && data.startMonth > 0 && data.endMonth > 0 && (
        data.endMonth < data.startMonth ||
        (data.endMonth === data.startMonth && data.startDay > 0 && data.endDay > 0 && data.endDay < data.startDay)
      ))
    )) {
      ctx.addIssue({ path: ["endYear"], message: "End date cannot precede start date", code: "custom" });
    }
    const maxStart = data.startMonth >= 0 && data.startMonth <= 12
      ? getMaxDays(data.startYear, data.startMonth) : 0;
    if (data.startDay > maxStart) {
      ctx.addIssue({
        path: ["startDay"],
        message: "Invalid start day for the month/year",
        code: "custom",
      });
    }

    const maxEnd = data.endMonth >= 0 && data.endMonth <= 12
      ? getMaxDays(data.endYear, data.endMonth) : 0;
    if (data.endDay > maxEnd) {
      ctx.addIssue({
        path: ["endDay"],
        message: "Invalid end day for the month/year",
        code: "custom",
      });
    }
  });

export type PostFormData = z.infer<typeof postSchemaClient>;
