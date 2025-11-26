import prisma from "../../../server/client";
import { addPosts } from "../../../utils/addPosts";
import { Context } from "./user";

export async function timeline(
  _: any,
  { page = 1, filter }: any,
  ctx: Context
) {
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filter?.type?.length) where.type = { in: filter.type };
  if (filter?.subject?.length) {
    const subjects = filter.subject.map(Number);
    where.subjects = { some: { id: { in: subjects } } };
  }
  if (filter?.yearStart && filter?.yearEnd) {
    where.OR = [
      {
        startYear: { gte: filter.yearStart, lte: filter.yearEnd },
        startSignificance: { gt: 0 },
      },
      {
        endYear: { gte: filter.yearStart, lte: filter.yearEnd },
        endSignificance: { gt: 0.8 },
      },
    ];
  }
  if (filter?.continent?.length)
    where.country = { continent: { in: filter.continent } };
  if (filter?.search?.length) {
    const search = filter.search;
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { startDescription: { contains: search, mode: "insensitive" } },
      { endDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  const dbPosts = await prisma.post.findMany({
    where,
    skip,
    take: limit,
    orderBy: [
      { startYear: "asc" },
      { startMonth: "asc" },
      { startDay: "asc" },
    ],
    include: { user: true, country: true, subjects: true, likes: true },
  });

  const userLikes = ctx.user
    ? await prisma.like.findMany({
        where: {
          userId: ctx.user.id,
          postId: { in: dbPosts.map((p) => p.id) },
        },
        select: { postId: true },
      })
    : [];

  const likedSet = new Set(userLikes.map((like) => like.postId));

  const finalPosts = dbPosts.map((post) => ({
    ...post,
    likes: post.likes.length,
    liked: likedSet.has(post.id),
  }));

  if (
    page === 1 &&
    dbPosts.length < 5 &&
    filter?.yearStart &&
    filter?.yearEnd
  ) {
    const existingNames = dbPosts.map((p) => p.name);
    try {
      const { createdPosts } = await addPosts(filter, existingNames, ctx);
      finalPosts.push(...createdPosts);
    } catch (err) {
      console.error("AI generation error:", err);
    }
  }

  return { posts: finalPosts };
}
