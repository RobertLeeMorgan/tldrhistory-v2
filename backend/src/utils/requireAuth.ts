import { Context } from "../schema/resolvers/query/user";

export function requireAuth(ctx: Context) {
  if (!ctx.user) throw new Error("Not authenticated");
  return ctx.user;
}
