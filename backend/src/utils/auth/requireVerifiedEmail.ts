import { GraphQLError } from "graphql";
import prisma from "../../server/client";
import { requireAuth } from "./requireAuth";
import type { Context } from "../../schema/resolvers/query/user";

export async function requireVerifiedEmail(ctx: Context) {
  const user = requireAuth(ctx);
  // Read current verification state, not a possibly older access-token claim.
  const account = await prisma.user.findUnique({
    where: { id: user.id }, select: { emailVerifiedAt: true },
  });
  if (!account?.emailVerifiedAt) {
    throw new GraphQLError("Verify your email before submitting an article", {
      extensions: { code: "FORBIDDEN" },
    });
  }
}
