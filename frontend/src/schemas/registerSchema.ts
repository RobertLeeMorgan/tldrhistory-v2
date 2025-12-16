// src/schemas/registerSchema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username too short")
      .max(30, "Username too long")
      .regex(/^[A-Za-z][A-Za-z0-9-]*$/, "Invalid username"),
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

export type RegisterFormData = z.infer<typeof registerSchema>;
