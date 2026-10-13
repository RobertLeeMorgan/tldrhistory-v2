import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { LIKE_POST } from "../../graphql/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "../../lib/graphql";
import type {
  Post,
  LikePostMutationVariables,
  LikePostMutation,
} from "../../generated/graphql";
import { useToast } from "../../context/ToastContext";

interface CardFooterProps {
  post: Post;
}

export default function CardFooter({ post }: CardFooterProps) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [likeOverride, setLikeOverride] = useState<{
    postId: string;
    liked: boolean;
    likes: number;
  } | null>(null);
  const liked = likeOverride?.postId === post.id ? likeOverride.liked : post.liked;
  const likesCount = likeOverride?.postId === post.id ? likeOverride.likes : post.likes;

  const likePostMutation = useMutation({
    mutationFn: (variables: LikePostMutationVariables) =>
      graphqlRequest<LikePostMutation, LikePostMutationVariables>(
        LIKE_POST,
        variables,
      ),
    onSuccess: (data) => {
      setLikeOverride({
        postId: post.id,
        liked: data.likePost.liked ?? false,
        likes: data.likePost.likes,
      });
    },
    onError: () => {
      addToast({ message: "Could not confirm the like change. Refresh before trying again.", type: "error" });
    },
    onSettled: () => Promise.all(["timeline", "significant", "userPosts", "userLikes", "userStats"].map(
      (key) => queryClient.invalidateQueries({ queryKey: [key] }),
    )),
  });

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (!isAuth.token) {
      navigate("/login");
      return;
    }

    likePostMutation.mutate({ postId: Number(post.id) });
  }

  return (
    <div className="ml-auto flex items-center justify-end gap-1 text-content-muted">
      <button
        onClick={handleClick}
        disabled={likePostMutation.isPending}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-accent transition-colors hover:bg-canvas/60 hover:text-content disabled:opacity-50"
        aria-label={liked ? "Unlike article" : "Like article"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill={liked ? "currentColor" : "none"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      <span className="min-w-5 text-sm font-semibold" aria-label={`${likesCount} likes`}>{likesCount}</span>
    </div>
  );
}
