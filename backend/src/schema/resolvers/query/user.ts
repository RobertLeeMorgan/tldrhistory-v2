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
  context: { user?: AuthUser | null }
) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        include: { country: true, subjects: true, likes: true, group: true },
      },
      likes: {
        include: {
          post: { include: { country: true, subjects: true, likes: true, group: true } },
        },
      },
    },
  });

  if (!user) return null;

  const currentUserId = context.user?.id;

  const posts = user.posts.map((post) => {
    const likesCount = post.likes.length;
    const liked = currentUserId
      ? post.likes.some((like) => like.userId === currentUserId)
      : false;

    return { ...post, likes: likesCount, liked };
  });

  const likes = user.likes.map(({ post }) => {
    const likesCount = post.likes.length;
    const liked = currentUserId
      ? post.likes.some((l) => l.userId === currentUserId)
      : false;

    return { post: { ...post, likes: likesCount, liked } };
  });

  return { ...user, posts, likes };
}
