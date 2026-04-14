import prisma from "../../../server/client";
import { Context } from "./user";
import { queryFilters } from "../../../utils/filters/queryFilters";
import { filterSchema } from "../../../validators/filterSchema";
import { timelinePostSelect } from "../../../utils/timelineSelect";
import { encodeCursor, decodeCursor, buildCursorWhere } from "../../../utils/cursor";

const TIMELINE_PAGE_SIZE = 15;

type TimelineArgs = {
  cursor?: string | null;
  filter?: unknown;
};

type DbPost = {
  id: number;
  startYear: number;
  startMonth: number | null;
  startDay: number | null;
  _count: { likes: number };
  [key: string]: any;
};

type LikeRow = {
  postId: number;
};


export async function timeline(
  _: unknown,
  { cursor, filter: rawFilter }: TimelineArgs,
  ctx: Context
) {
  const filter = await filterSchema.parseAsync(rawFilter ?? {});
  const parsedCursor = cursor ? decodeCursor(cursor) : null;

  const direction: "asc" | "desc" = filter.sortBy ? "asc" : "desc";
  const baseWhere = queryFilters(filter);

  const where = parsedCursor
    ? {
        AND: [baseWhere, buildCursorWhere(parsedCursor, direction)],
      }
    : baseWhere;

  const dbPosts: DbPost[] = await prisma.post.findMany({
    where,
    take: TIMELINE_PAGE_SIZE,
    orderBy: [
      { startYear: direction },
      { startMonth: direction },
      { startDay: direction },
      { id: direction },
    ],
    select: timelinePostSelect,
  });

  const likedPostIds: LikeRow[] =
    ctx.user && dbPosts.length > 0
      ? await prisma.like.findMany({
          where: {
            userId: ctx.user.id,
            postId: { in: dbPosts.map((post) => post.id) },
          },
          select: {
            postId: true,
          },
        })
      : [];

  const likedSet = new Set(likedPostIds.map((like) => like.postId));

  const posts = dbPosts.map(({ _count, ...post }) => ({
    ...post,
    likes: _count.likes,
    liked: likedSet.has(post.id),
  }));

  const lastPost = dbPosts[dbPosts.length - 1];

  return {
    posts,
    nextCursor: lastPost
      ? encodeCursor({
          startYear: lastPost.startYear,
          startMonth: lastPost.startMonth,
          startDay: lastPost.startDay,
          id: lastPost.id,
        })
      : null,
  };
}