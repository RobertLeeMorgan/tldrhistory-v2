import prisma from "../../../server/client";
import { requireAuth } from "../../../utils/auth/requireAuth";
import { Context } from "../query/user";

export async function savedFilters(
  _: unknown,
  __: unknown,
  ctx: Context,
) {
  const authUser = requireAuth(ctx);
  const userId = authUser.id;

  const saved = await prisma.savedFilter.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return saved
}