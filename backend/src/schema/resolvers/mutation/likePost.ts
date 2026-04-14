import { GraphQLError } from "graphql";
import prisma from "../../../server/client";
import { requireAuth } from "../../../utils/auth/requireAuth";
import { Context } from "../query/user";

type LikePostArgs = {
  postId: number;
};

export async function likePost(
  _: unknown,
  { postId }: LikePostArgs,
  ctx: Context
) {
  const user = requireAuth(ctx);
  const parsedPostId = Number(postId);

  if (!Number.isInteger(parsedPostId)) {
    throw new GraphQLError("Invalid post id", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id: parsedPostId },
      select: { id: true },
    });

    if (!post) {
      throw new GraphQLError("Post not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const existingLike = await tx.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: parsedPostId,
        },
      },
      select: {
        userId: true,
      },
    });

    let liked: boolean;

    if (existingLike) {
      await tx.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: parsedPostId,
          },
        },
      });
      liked = false;
    } else {
      await tx.like.create({
        data: {
          userId: user.id,
          postId: parsedPostId,
        },
      });
      liked = true;
    }

    const postWithCount = await tx.post.findUnique({
      where: { id: parsedPostId },
      select: {
        id: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!postWithCount) {
      throw new GraphQLError("Post not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return {
      id: postWithCount.id,
      likes: postWithCount._count.likes,
      liked,
    };
  });
}