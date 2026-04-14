import { GraphQLError } from "graphql";
import prisma from "../../../server/client";
import { requireRole } from "../../../utils/auth/requireRole";
import { Context } from "../query/user";

type DeletePostArgs = {
  id: number;
};

export async function deletePost(
  _: unknown,
  { id }: DeletePostArgs,
  ctx: Context,
) {
  requireRole(ctx, ["ADMIN"]);

  const postId = Number(id);

  if (!Number.isInteger(postId)) {
    throw new GraphQLError("Invalid post id", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    throw new GraphQLError("Post not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  await prisma.$transaction([
    prisma.editSuggestion.deleteMany({
      where: { postId: postId },
    }),
    prisma.like.deleteMany({
      where: { postId: postId },
    }),
    prisma.createdPost.deleteMany({
      where: { postId: postId },
    }),
    prisma.post.delete({
      where: { id: postId },
    }),
  ]);

  return true;
}
