import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "../components/ArticleCard";
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
    queryFn: async () => graphqlRequest<UserData, GetUserQueryVariables>(GET_USER, { id: userId }),
    enabled: !isNaN(userId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user</div>;
  if (!data?.getUser) return <div>User not found</div>;

  const user = data.getUser;
  const createdPosts = user.posts;
  const likedPosts = user.likes.map((like) => like.post);

  return (
    <main className="min-h-screen bg-base-200 w-full p-20">
      <h1 className="text-4xl font-bold mb-8 text-center">{user.username}</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Posts created:</h2>
        {createdPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {createdPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts created yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Liked posts:</h2>
        {likedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {likedPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No liked posts yet.</p>
        )}
      </section>
    </main>
  );
}
