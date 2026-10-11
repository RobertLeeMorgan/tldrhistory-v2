import { Context } from "../../schema/resolvers/query/user";
import { GraphQLError } from "graphql";

export function requireAuth(ctx: Context) {
  if (!ctx.user) throw new GraphQLError("Not authenticated", {
    extensions: { code: "UNAUTHENTICATED" },
  });
  return ctx.user;
}
