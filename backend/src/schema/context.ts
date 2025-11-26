import type { ExpressContextFunctionArgument } from "@as-integrations/express5";
import jwt from "jsonwebtoken";

export async function context({ req }: ExpressContextFunctionArgument) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return { user: decoded };
  } catch {
    return { user: null };
  }
}