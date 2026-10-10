import { z } from "zod";
import { GraphQLError } from "graphql";

export const passwordSchema = z.string().min(8).refine(
  (value) => Buffer.byteLength(value, "utf8") <= 72,
  "Password must be at most 72 UTF-8 bytes",
);
export const registerSchema = z.object({
  email: z.email().trim().toLowerCase().max(80),
  username: z.string().trim().min(3).max(20).regex(/^[A-Za-z][A-Za-z0-9-]*$/),
  password: passwordSchema,
});

export function parseAuthInput<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new GraphQLError(result.error.issues[0].message, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return result.data;
}
