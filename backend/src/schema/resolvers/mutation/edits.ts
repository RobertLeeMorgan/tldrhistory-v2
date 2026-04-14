import prisma from "../../../server/client";
import {
  hasImageChanged,
  shouldTransferOwnership,
  SUGGESTION_STATUS,
} from "../../../utils/suggestionHelpers";
import { requireRole } from "../../../utils/auth/requireRole";
import { inputSchema } from "../../../validators/inputSchema";
import { Context } from "../query/user";

export async function suggestEdit(
  _: any,
  { postId, input }: any,
  ctx: Context,
) {
  requireRole(ctx, ["USER", "MODERATOR", "ADMIN"]);

  const validated = await inputSchema.parseAsync(input);

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { id: true, name: true },
  });

  if (!post) throw new Error("Post not found");

  return prisma.editSuggestion.create({
    data: {
      postId: post.id,
      suggestedById: ctx.user!.id,
      data: validated,
      status: SUGGESTION_STATUS.PENDING,
    },
    include: {
      suggestedBy: true,
      post: { select: { id: true, name: true } },
    },
  });
}

export async function approveEdit(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  await prisma.$transaction(async (tx) => {
    const suggestion = await tx.editSuggestion.findUnique({
      where: { id: Number(id) },
    });

    if (!suggestion) throw new Error("Suggestion not found");
    if (suggestion.status !== SUGGESTION_STATUS.PENDING) {
      throw new Error("Suggestion already processed");
    }

    const validated = await inputSchema.parseAsync(suggestion.data);

    const existingPost = await tx.post.findUnique({
      where: { id: suggestion.postId },
      select: {
        id: true,
        imageUrl: true,
        imageCredit: true,
        sourceUrl: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    if (!existingPost) throw new Error("Post not found");

    const imageChanged = hasImageChanged(validated, existingPost);

    const updateData: any = {
      name: validated.name,
      type: validated.type,
      startDescription: validated.startDescription,
      endDescription: validated.endDescription ?? null,
      startYear: validated.startYear,
      startMonth: validated.startMonth ?? 0,
      startDay: validated.startDay ?? 0,
      endYear: validated.endYear ?? 0,
      endMonth: validated.endMonth ?? 0,
      endDay: validated.endDay ?? 0,
      startSignificance: validated.startSignificance ?? 0,
      endSignificance: validated.endSignificance ?? 0,
      imageUrl: validated.imageUrl ?? null,
      imageCredit: validated.imageCredit ?? null,
      sourceUrl: validated.sourceUrl ?? null,
      civilisation: validated.civilisation ?? false,
      countryId: validated.country.name,
      groupId: validated.group?.id ?? null,
      subjects: {
        set: validated.subjects.map((subject) => ({ id: subject.id })),
      },
      ...(imageChanged && {
        imageStatus: "pending",
        cdnUrl: null,
        cdnId: null,
      }),
    };

    if (shouldTransferOwnership(existingPost)) {
      updateData.userId = suggestion.suggestedById;
    }

    await tx.post.update({
      where: { id: suggestion.postId },
      data: updateData,
    });

    await tx.editSuggestion.update({
      where: { id: Number(id) },
      data: {
        status: SUGGESTION_STATUS.APPROVED,
        moderatorId: ctx.user!.id,
      },
    });
  });

  return true;
}

export async function rejectEdit(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const suggestion = await prisma.editSuggestion.findUnique({
    where: { id: Number(id) },
    select: { id: true, status: true },
  });

  if (!suggestion) throw new Error("Suggestion not found");
  if (suggestion.status !== SUGGESTION_STATUS.PENDING) {
    throw new Error("Suggestion already processed");
  }

  await prisma.editSuggestion.update({
    where: { id: suggestion.id },
    data: {
      status: SUGGESTION_STATUS.REJECTED,
      moderatorId: ctx.user!.id,
    },
  });

  return true;
}
