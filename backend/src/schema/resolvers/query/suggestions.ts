import prisma from "../../../server/client";
import { requireRole } from "../../../utils/auth/requireRole";
import { Context } from "./user";
import { timelinePostSelect } from "../../../utils/timelineSelect";
import {
  buildChanges,
  buildReviewStats,
} from "../../../utils/suggestionHelpers";

export async function pendingEdits(_: unknown, __: unknown, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const [edits] = await Promise.all([
    prisma.editSuggestion.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        data: true,
        suggestedBy: {
          select: { id: true, username: true },
        },
        post: { select: timelinePostSelect },
      },
    }),
  ]);

  return {
    edits: edits.map((edit) => {
      const changes = buildChanges(edit.post, edit.data ?? {});

      return {
        id: edit.id,
        suggestedBy: edit.suggestedBy,
        post: edit.post,
        changes,
        hasImageChanges:
          !!changes.imageUrl || !!changes.imageCredit || !!changes.sourceUrl,
      };
    }),
  };
}

export async function pendingCreatedPosts(
  _: unknown,
  __: unknown,
  ctx: Context,
) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const [posts] = await Promise.all([
    prisma.createdPost.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        data: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        suggestedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    }),
  ]);

  return {
    createdPosts: posts.map((item) => ({
      id: item.id,
      suggestedBy: item.suggestedBy,
      data: item.data,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  };
}

export async function pendingStats(_: unknown, __: unknown, ctx: Context) {
  const editCounts = await prisma.editSuggestion.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const createdCounts = await prisma.createdPost.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const stats = buildReviewStats(editCounts, createdCounts);
  return stats;
}

export async function formLists() {
  const [allCountries, allSubjects, allGroups] = await Promise.all([
    prisma.country.findMany({
      select: { name: true, continent: true },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.group.findMany({
      select: { id: true, name: true, description: true, icon: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    allCountries,
    allSubjects,
    allGroups,
  };
}

export async function getPost(_: any, { id }: { id: number }, ctx: Context) {
  requireRole(ctx, ["USER", "MODERATOR", "ADMIN"]);

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: timelinePostSelect,
  });

  if (!post) throw new Error("Post not found");

  return post;
}
