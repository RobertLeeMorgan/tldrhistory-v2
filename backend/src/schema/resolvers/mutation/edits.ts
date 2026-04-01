import prisma from "../../../server/client";
import { requireRole } from "../../../utils/requireRole";
import { postSchema } from "../../../validators/postSchema";
import { Context } from "../query/user";

export async function suggestEdit(
  _: any,
  { postId, input }: any,
  ctx: Context,
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
      post: { select: { id: true, name: true } },
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

  const data = suggestion.data as any;

  let subjectIds: number[] = [];

  if (Array.isArray(data.subjects)) {
    subjectIds = data.subjects.map((s: any) =>
      typeof s === "object" ? Number(s.id) : Number(s),
    );
  }

  // 🔥 Fetch current post to compare
  const existingPost = await prisma.post.findUnique({
    where: { id: suggestion.postId },
    select: {
      imageUrl: true,
      imageCredit: true,
      sourceUrl: true,
    },
  });

  if (!existingPost) throw new Error("Post not found");

  const imageChanged =
    (data.imageUrl !== undefined && data.imageUrl !== existingPost.imageUrl) ||
    (data.imageCredit !== undefined && data.imageCredit !== existingPost.imageCredit) ||
    (data.sourceUrl !== undefined && data.sourceUrl !== existingPost.sourceUrl);

  const updatedPost = await prisma.post.update({
    where: { id: suggestion.postId },
    data: {
      ...data,
      groupId: data.groupId < 1 ? null : data.groupId,
      userId: suggestion.suggestedById,
      subjects: { set: subjectIds.map((id) => ({ id })) },

      ...(imageChanged && {
        imageStatus: "pending",
        cdnUrl: null,
        cdnId: null,
      }),
    },
    select: {
      id: true,
      name: true,
      type: true,
      startYear: true,
      startMonth: true,
      startDay: true,
      endYear: true,
      endMonth: true,
      endDay: true,
      startDescription: true,
      endDescription: true,
      startSignificance: true,
      endSignificance: true,
      imageUrl: true,
      cdnId: true,
      imageCredit: true,
      sourceUrl: true,
      civilisation: true,
      country: { select: { name: true, continent: true } },
      subjects: { select: { id: true, name: true } },
      group: { select: { id: true, name: true, icon: true } },
      user: { select: { id: true, username: true } },
      _count: { select: { likes: true } },
    },
  });

  await prisma.editSuggestion.update({
    where: { id: Number(id) },
    data: { status: "approved", moderatorId: ctx.user!.id },
  });

  const liked = ctx.user
    ? !!(await prisma.like.findFirst({
        where: { postId: updatedPost.id, userId: ctx.user.id },
        select: { userId: true },
      }))
    : false;

  return { ...updatedPost, likes: updatedPost._count.likes, liked };
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
