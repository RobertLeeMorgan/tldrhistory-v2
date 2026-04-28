import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { LIKE_POST } from "../../graphql/mutations";
import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "../../lib/graphql";
import type {
  Post,
  LikePostMutationVariables,
  LikePostMutation,
} from "../../generated/graphql";
import { motion } from "framer-motion";
import { queryClient } from "../../lib/queryClient";

interface CardFooterProps {
  post: Post;
}

export default function CardFooter({ post }: CardFooterProps) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  useEffect(() => {
    setLiked(post.liked);
    setLikesCount(post.likes);
  }, [post.liked, post.likes]);

  const likePostMutation = useMutation({
    mutationFn: (variables: LikePostMutationVariables) =>
      graphqlRequest<LikePostMutation, LikePostMutationVariables>(
        LIKE_POST,
        variables,
      ),
    onSuccess: (data) => {
      setLiked(data.likePost.liked);
      setLikesCount(data.likePost.likes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userLikes"] });
    },
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
    <div className="flex flex-1 items-center justify-end gap-1">
      <motion.button
        onClick={handleClick}
        disabled={likePostMutation.isPending}
        className="btn btn-ghost btn-sm text-gold p-1 hover:text-gold-hover hover:bg-stone-800/70"
        aria-label={liked ? "Unlike article" : "Like article"}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill={liked ? "currentColor" : "none"}
          initial={false}
          animate={{
            fill: liked ? "currentColor" : "none",
            scale: liked ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </motion.svg>
      </motion.button>
      <span className="text-base">{likesCount}</span>
    </div>
  );
}
