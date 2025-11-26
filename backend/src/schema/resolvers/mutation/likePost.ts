import prisma from "../../../server/client";
import { requireAuth } from "../../../utils/requireAuth";
import { Context } from "../query/user";

export async function likePost(_: any, { postId }: any, ctx: Context) {
  const user = requireAuth(ctx);

  const existing = await prisma.like.findFirst({
    where: { postId, userId: user.id },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId: user.id, postId } },
    });
  } else {
    await prisma.like.create({ data: { postId, userId: user.id } });
  }

  const likeCount = await prisma.like.count({ where: { postId } });
  const liked = !!(await prisma.like.findFirst({
    where: { postId, userId: user.id },
  }));

  const updated = await prisma.post.findUnique({
    where: { id: postId },
    include: { user: true, country: true, subjects: true, likes: true },
  });
  if (!updated) throw new Error("Post not found");

  return { ...updated, likes: likeCount, liked };
}
