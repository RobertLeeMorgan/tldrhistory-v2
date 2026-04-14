import prisma from "../../../server/client";
import { timelinePostSelect } from "../../../utils/timelineSelect";
import { HISTORICAL_RANGES } from "../../../utils/user/historicalRanges";

export interface AuthUser {
  id: number;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "BOT";
}

export interface Context {
  user: AuthUser | null;
}

const postSelect = {
  ...timelinePostSelect,
  user: {
    select: {
      id: true,
      username: true,
      createdAt: true,
      role: true,
    },
  },
  _count: { select: { likes: true } },
} as const;

export async function userPosts(
  _: unknown,
  { userId }: { userId: number },
  ctx: Context,
) {
  const currentUserId = ctx.user?.id;

  const [posts, viewerLikes] = await Promise.all([
    prisma.post.findMany({
      where: { userId },
      select: postSelect,
      orderBy: [
        { startYear: "asc" },
        { startMonth: "asc" },
        { startDay: "asc" },
        { id: "asc" },
      ],
    }),
    currentUserId
      ? prisma.like.findMany({
          where: { userId: currentUserId },
          select: { postId: true },
        })
      : Promise.resolve([]),
  ]);

  const likedSet = new Set(viewerLikes.map((like) => like.postId));

  return posts.map((post) => ({
    ...post,
    likes: post._count.likes,
    liked: likedSet.has(post.id),
  }));
}

export async function userLikes(
  _: unknown,
  { userId }: { userId: number },
  ctx: Context,
) {
  const currentUserId = ctx.user?.id;

  const [likes, viewerLikes] = await Promise.all([
    prisma.like.findMany({
      where: { userId },
      select: {
        post: {
          select: postSelect,
        },
      },
    }),
    currentUserId
      ? prisma.like.findMany({
          where: { userId: currentUserId },
          select: { postId: true },
        })
      : Promise.resolve([]),
  ]);

  const likedSet = new Set(viewerLikes.map((like) => like.postId));

  return likes.map(({ post }) => ({
    post: {
      ...post,
      likes: post._count.likes,
      liked: likedSet.has(post.id),
    },
  }));
}

export async function userStats(_: unknown, { userId }: { userId: number }) {
  const [user, mostLikedPost, postsByYear, likedPostsGroups] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          createdAt: true,
        },
      }),
      prisma.post.findFirst({
        where: { userId },
        orderBy: [{ likes: { _count: "desc" } }, { id: "asc" }],
        select: {
          id: true,
          name: true,
          imageUrl: true,
          cdnId: true,
          group: {
            select: {
              name: true,
              icon: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
      prisma.post.groupBy({
        by: ["startYear"],
        where: { userId },
        _count: { startYear: true },
      }),
      prisma.like.findMany({
        where: { userId },
        select: {
          post: {
            select: {
              group: {
                select: {
                  name: true,
                  icon: true,
                },
              },
            },
          },
        },
      }),
    ]);

  if (!user) return null;

  const eraCounts = new Map<string, number>();

  for (const { startYear, _count } of postsByYear) {
    if (startYear == null) continue;

    const era = HISTORICAL_RANGES.find(
      (r) => startYear >= r.start && startYear <= r.end,
    );

    if (era) {
      eraCounts.set(
        era.label,
        (eraCounts.get(era.label) ?? 0) + _count.startYear,
      );
    }
  }

  const favouriteEra =
    eraCounts.size === 0
      ? null
      : [...eraCounts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  const groupCounts = new Map<string, { count: number; icon: string | null }>();

  for (const { post } of likedPostsGroups) {
    if (!post.group) continue;

    const current = groupCounts.get(post.group.name) ?? {
      count: 0,
      icon: post.group.icon,
    };

    groupCounts.set(post.group.name, {
      ...current,
      count: current.count + 1,
    });
  }

  const favouriteGroup =
    groupCounts.size === 0
      ? null
      : (() => {
          const [name, data] = [...groupCounts.entries()].reduce((a, b) =>
            b[1].count > a[1].count ? b : a,
          );

          return {
            name,
            icon: data.icon,
          };
        })();

  return {
    ...user,
    stats: {
      mostLikedPost: mostLikedPost
        ? {
            id: mostLikedPost.id,
            name: mostLikedPost.name,
            imageUrl: mostLikedPost.imageUrl,
            cdnId: mostLikedPost.cdnId,
            group: mostLikedPost.group,
            likes: mostLikedPost._count.likes,
          }
        : null,
      favouriteEra,
      favouriteGroup,
    },
  };
}
