import { Context } from "../schema/resolvers/query/user";
import { requireAuth } from "./requireAuth";

export function requireRole(ctx: Context, allowed: string[]) {
  const user = requireAuth(ctx);
  if (!allowed.includes(user.role)) {
    throw new Error("Not authorized");
  }
  return user;
}
