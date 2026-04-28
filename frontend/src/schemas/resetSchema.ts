import { z } from "zod";

export const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
        "Must include uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetFormData = z.infer<typeof resetSchema>;