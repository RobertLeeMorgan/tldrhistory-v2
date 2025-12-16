import prisma from "../../../server/client";
import { requireRole } from "../../../utils/requireRole";
import { Context } from "../query/user";

export async function deletePost(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["ADMIN"]);

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  await prisma.editSuggestion.deleteMany({ where: { postId: id } });
  await prisma.like.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id } });

  return true;
}
