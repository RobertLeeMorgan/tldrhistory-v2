import prisma from "../../../server/client";

export interface AuthUser {
  id: number;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "BOT";
}

export interface Context {
  user: AuthUser | null;
}

export async function getUser(
  _: any,
  { id }: { id: number },
  context: Context
) {
  const currentUserId = context.user?.id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      posts: {
        select: {
          id: true,
          name: true,
          type: true,
          startDescription: true,
          endDescription: true,
          startYear: true,
          startMonth: true,
          startDay: true,
          endYear: true,
          endMonth: true,
          endDay: true,
          startSignificance: true,
          endSignificance: true,
          imageUrl: true,
          imageCredit: true,
          sourceUrl: true,
          country: { select: { name: true, continent: true } },
          subjects: { select: { id: true, name: true } },
          group: { select: { name: true, icon: true } },
          likes: { select: { userId: true } },
        },
      },
      likes: {
        select: {
          post: {
            select: {
              id: true,
              name: true,
              type: true,
              startDescription: true,
              endDescription: true,
              startYear: true,
              startMonth: true,
              startDay: true,
              endYear: true,
              endMonth: true,
              endDay: true,
              startSignificance: true,
              endSignificance: true,
              imageUrl: true,
              cdnUrl: true,
              imageCredit: true,
              sourceUrl: true,
              country: { select: { name: true, continent: true } },
              subjects: { select: { id: true, name: true } },
              group: { select: { name: true, icon: true } },
              likes: { select: { userId: true } },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const likedSet = new Set(
    currentUserId
      ? user.posts
          .flatMap((p) => p.likes)
          .filter((l) => l.userId === currentUserId)
          .map((l) => l.userId)
      : []
  );

  // Map posts
  const posts = user.posts.map((post) => ({
    ...post,
    likes: post.likes.length,
    liked: currentUserId ? post.likes.some((l) => l.userId === currentUserId) : false,
  }));

  // Map liked posts
  const likes = user.likes.map(({ post }) => ({
    post: {
      ...post,
      likes: post.likes.length,
      liked: currentUserId ? post.likes.some((l) => l.userId === currentUserId) : false,
    },
  }));

  return { ...user, posts, likes };
}