import { Country, Like, Post, Subject, User, Group } from "@prisma/client";
import prisma from "../../../server/client";
import { Context } from "./user";
import { queryFilters } from "../../../utils/filters/queryFilters";
import { filterSchema } from "../../../validators/filterSchema";

export async function timeline(
  _: any,
  { cursor, filter: validatedFilter }: any,
  ctx: Context
) {
  const filter = await filterSchema.parseAsync(validatedFilter);

  const limit = 10;
  const where = queryFilters(filter);

  let generationAttempted = true;

  async function fetchPosts() {
    return (await prisma.post.findMany({
      where,
      take: limit,
      ...(cursor && { cursor: { id: Number(cursor) }, skip: 1 }),
      orderBy: filter.sortBy
        ? [
            { startYear: "asc" },
            { startMonth: "asc" },
            { startDay: "asc" },
            { id: "asc" },
          ]
        : [
            { startYear: "desc" },
            { startMonth: "desc" },
            { startDay: "desc" },
            { id: "desc" },
          ],
      include: {
        user: true,
        country: true,
        subjects: true,
        likes: true,
        group: true,
      },
    })) as (Post & {
      user: User;
      country: Country;
      subjects: Subject[];
      likes: Like[];
      group: Group;
    })[];
  }

  let dbPosts = await fetchPosts();

  // if (
  //   !cursor &&
  //   dbPosts.length < 1 &&
  //   filter &&
  //   Object.keys(filter).length > 0 &&
  //   !generationAttempted
  // ) {
  //   generationAttempted = true;
  //   const existingNames = dbPosts.map((p) => p.name);
  //   try {
  //     const count = computeCount(filter, dbPosts.length, limit);
  //     await generatePosts(filter, existingNames, count, ctx);
  //   } catch (err) {
  //     console.error("AI generation error:", err);
  //   }
  //   dbPosts = await fetchPosts();
  // }

  dbPosts.sort((a, b) => {
    if (filter.sortBy) {
      return (
        a.startYear - b.startYear ||
        a.startMonth - b.startMonth ||
        a.startDay - b.startDay ||
        a.id - b.id
      );
    }
    return (
      b.startYear - a.startYear ||
      b.startMonth - a.startMonth ||
      b.startDay - a.startDay ||
      b.id - a.id
    );
  });

  // Likes
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
    likes: post.likes?.length ?? 0,
    liked: likedSet.has(post.id),
  }));

  return {
    posts: finalPosts,
    nextCursor: finalPosts.length ? finalPosts[finalPosts.length - 1].id : null,
  };
}
