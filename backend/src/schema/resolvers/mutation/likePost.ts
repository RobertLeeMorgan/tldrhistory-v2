import prisma from "../../../server/client";
import { requireAuth } from "../../../utils/requireAuth";
import { Context } from "../query/user";

export async function likePost(_: any, { postId }: any, ctx: Context) {
  const user = requireAuth(ctx);

  const existing = await prisma.like.findFirst({
    where: { postId, userId: user.id },
    select: { userId: true }
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId: user.id, postId } },
    });
  } else {
    await prisma.like.create({ data: { postId, userId: user.id } });
  }

  const postWithCount = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      _count: { select: { likes: true } },
    },
  });

  if (!postWithCount) throw new Error("Post not found");

  const { _count, id } = postWithCount;

  return {
    id,
    likes: _count.likes,
    liked: !existing,
  };
}