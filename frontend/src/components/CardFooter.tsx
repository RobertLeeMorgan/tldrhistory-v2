import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LIKE_POST } from "../graphql/mutations";
import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import type { Post, LikePostMutationVariables, LikePostMutation } from "../generated/graphql";

interface CardFooterProps {
  post: Post;
}

export default function CardFooter({ post }: CardFooterProps) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const likePostMutation = useMutation({
    mutationFn: (variables: LikePostMutationVariables) =>
      graphqlRequest<LikePostMutation, LikePostMutationVariables>(
              LIKE_POST,
              variables
            ),
    onSuccess: (data) => {
      setLiked(data.likePost.liked);
      setLikesCount(data.likePost.likes);
    },
  });

  function handleClick() {
    if (!isAuth.token) {
      navigate("/login");
      return;
    }

    likePostMutation.mutate({ postId: Number(post.id) });
  }

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        disabled={likePostMutation.isPending}
        className="btn btn-ghost btn-sm"
        aria-label={liked ? "Unlike article" : "Like article"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      <span className="text-sm text-gray-500">{likesCount}</span>
    </div>
  );
}
