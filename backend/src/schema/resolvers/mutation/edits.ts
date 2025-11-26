import prisma from "../../../server/client";
import { computeEffectiveDate } from "../../../utils/effectiveDate";
import { requireRole } from "../../../utils/requireRole";
import { postSchema } from "../../../validators/postSchema";
import { Context } from "../query/user";

export async function suggestEdit(
  _: any,
  { postId, input }: any,
  ctx: Context
) {
  requireRole(ctx, ["USER", "MODERATOR", "ADMIN"]);

  const normalizedInput = {
    ...input,
    subjects: input.subjects?.map((s: any) => Number(s)) ?? [],
  };

  const validated = await postSchema.parseAsync(normalizedInput);

  const postExists = await prisma.post.count({
    where: { id: Number(postId) },
  });
  if (!postExists) throw new Error("Post not found");

  return prisma.editSuggestion.create({
    data: {
      postId: Number(postId),
      suggestedById: ctx.user!.id,
      data: validated,
      status: "pending",
    },
    include: {
      suggestedBy: true,
      post: true,
    },
  });
}

export async function approveEdit(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const suggestion = await prisma.editSuggestion.findUnique({
    where: { id: Number(id) },
  });
  if (!suggestion) throw new Error("Suggestion not found");
  if (suggestion.status !== "pending")
    throw new Error("Suggestion already processed");

  const data = suggestion.data as {
    startYear: number;
    startMonth: number;
    startDay: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    startSignificance: number;
    endSignificance: number;
    subjectIds?: number[];
    [key: string]: any;
  };

  const effectiveDate = computeEffectiveDate(data);

  const updatedPost = await prisma.post.update({
    where: { id: suggestion.postId },
    data: {
      ...data,
      userId: suggestion.suggestedById,
      effectiveDate,
      subjects: {
        set: (data.subjectIds || []).map((id: number) => ({ id })),
      },
    },
    include: {
      user: true,
      country: true,
      subjects: true,
    },
  });

  await prisma.editSuggestion.update({
    where: { id: Number(id) },
    data: { status: "approved", moderatorId: ctx.user!.id },
  });

  const likeCount = await prisma.like.count({
    where: { postId: updatedPost.id },
  });
  const liked = ctx.user
    ? !!(await prisma.like.findFirst({
        where: { postId: updatedPost.id, userId: ctx.user!.id },
      }))
    : false;

  return { ...updatedPost, likes: likeCount, liked };
}

export async function rejectEdit(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const suggestion = await prisma.editSuggestion.findUnique({
    where: { id: Number(id) },
  });
  if (!suggestion) throw new Error("Suggestion not found");

  await prisma.editSuggestion.update({
    where: { id: Number(id) },
    data: { status: "rejected", moderatorId: ctx.user!.id },
  });

  return true;
}
