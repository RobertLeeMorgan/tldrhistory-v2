import { Context } from "../../schema/resolvers/query/user";
import { requireAuth } from "./requireAuth";
import { GraphQLError } from "graphql";

export function requireRole(ctx: Context, allowed: string[]) {
  const user = requireAuth(ctx);
  if (!allowed.includes(user.role)) {
    throw new GraphQLError("Not authorized", {
      extensions: { code: "FORBIDDEN" },
    });
  }
  return user;
}
