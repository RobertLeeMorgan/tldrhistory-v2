import { Context } from "../query/user";
import prisma from "../../../server/client";
import { requireRole } from "../../../utils/auth/requireRole";
import { inputSchema } from "../../../validators/inputSchema";
import {
  normalizePostName,
  SUGGESTION_STATUS,
} from "../../../utils/suggestionHelpers";

export async function createPostSuggestion(
  _: any,
  { input }: any,
  ctx: Context,
) {
  requireRole(ctx, ["USER", "MODERATOR", "ADMIN"]);

  const validated = await inputSchema.parseAsync(input);

  const exactExistingPost = await prisma.post.findFirst({
    where: {
      name: {
        equals: validated.name.trim(),
        mode: "insensitive",
      },
    },
    select: { id: true, name: true },
  });

  if (exactExistingPost) {
    throw new Error("A post with this name already exists");
  }

  const normalizedName = normalizePostName(validated.name);

  const existingPosts = await prisma.post.findMany({
    select: { id: true, name: true },
  });

  const similarExistingPost = existingPosts.find(
    (post) => normalizePostName(post.name) === normalizedName,
  );

  if (similarExistingPost) {
    throw new Error(
      `A similar post already exists: "${similarExistingPost.name}"`,
    );
  }

  return prisma.createdPost.create({
    data: {
      suggestedById: ctx.user!.id,
      data: validated,
      status: SUGGESTION_STATUS.PENDING,
    },
    include: {
      suggestedBy: true,
    },
  });
}

export async function rejectCreatedPost(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const submission = await prisma.createdPost.findUnique({
    where: { id: Number(id) },
    select: { id: true, status: true },
  });

  if (!submission) throw new Error("Submission not found");
  if (submission.status !== "pending") {
    throw new Error("Submission already processed");
  }

  await prisma.createdPost.update({
    where: { id: submission.id },
    data: {
      status: "rejected",
      moderatorId: ctx.user!.id,
    },
  });

  return true;
}

export async function approveCreatedPost(_: any, { id }: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  return prisma.$transaction(async (tx) => {
    const submission = await tx.createdPost.findUnique({
      where: { id: Number(id) },
    });

    if (!submission) throw new Error("Submission not found");
    if (submission.status !== SUGGESTION_STATUS.PENDING) {
      throw new Error("Submission already processed");
    }

    const validated = await inputSchema.parseAsync(submission.data);

    const post = await tx.post.create({
      data: {
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
        userId: submission.suggestedById,
        groupId: validated.group?.id ?? null,
        subjects: {
          connect: validated.subjects.map((subjectId) => ({
            id: subjectId.id,
          })),
        },
        ...(validated.imageUrl && {
          imageStatus: "pending",
          cdnUrl: null,
          cdnId: null,
        }),
      },
      select: { id: true },
    });

    await tx.createdPost.update({
      where: { id: submission.id },
      data: {
        status: SUGGESTION_STATUS.APPROVED,
        moderatorId: ctx.user!.id,
        postId: post.id,
      },
    });

    return true;
  });
}
