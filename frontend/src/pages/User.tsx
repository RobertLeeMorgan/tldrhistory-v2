import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "../components/cards/ArticleCard";
import type { Post, GetUserQueryVariables } from "../generated/graphql";
import { graphqlRequest } from "../lib/graphql";
import { GET_USER } from "../graphql/queries";

interface Like {
  post: Post;
}

interface UserData {
  getUser: {
    id: number;
    username: string;
    posts: Post[];
    likes: Like[];
  } | null;
}

export default function User() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data, isLoading, isError } = useQuery<UserData>({
    queryKey: ["user", userId],
    queryFn: async () =>
      graphqlRequest<UserData, GetUserQueryVariables>(GET_USER, { id: userId }),
    enabled: !isNaN(userId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-stone-200/90 w-full flex">
        <span className="loading loading-spinner mx-auto text-stone-900 loading-xl"></span>
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen bg-stone-200/90 w-full">
        <span className="text-shadow-sm text-stone-900 pt-30 text-xl items-center flex justify-center">
          Failed to load user
        </span>
      </div>
    );
  if (!data?.getUser)
    return (
      <div className="min-h-screen bg-stone-200/90 w-full">
        <span className="text-shadow-sm text-stone-900 pt-30 text-xl items-center flex justify-center">
          User not found
        </span>
      </div>
    );

  const user = data.getUser;
  const createdPosts = user.posts;
  const likedPosts = user.likes.map((like) => like.post);

  return (
    <main className="min-h-screen bg-stone-200/90 w-full p-4 pt-16 lg:p-20">
      <h1 className="text-4xl font-bold mb-8 text-center text-stone-900/86 text-shadow-sm">
        {user.username}
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-stone-800/86 text-shadow-sm">
          Posts created:
        </h2>
        {createdPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {createdPosts.map((post) => (
              <div className="shadow-lg shadow-black/40 card">
                <ArticleCard key={post.id} post={post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-800/86 text-shadow-sm">
            No posts created yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-stone-800/86 text-shadow-sm">
          Liked posts:
        </h2>
        {likedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {likedPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-stone-800/86 text-shadow-sm">
            No liked posts yet.
          </p>
        )}
      </section>
    </main>
  );
}
