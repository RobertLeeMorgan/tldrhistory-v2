import { animatedPosts } from "../../../utils/animatedCache";
import ArticleCard from "./TimelineCard";
import { useCallback, useEffect, memo, forwardRef } from "react";
import type { Post } from "../../../generated/graphql";
import { motion } from "framer-motion";

interface AnimatedCardProps {
  post: Post;
  width: number;
  onClick: (p: Post) => void;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ post, width, onClick }, ref) => {
    const hasAnimated = animatedPosts.has(post.id);

    useEffect(() => {
      if (!hasAnimated) {
        animatedPosts.add(post.id);
      }
    }, [hasAnimated, post.id]);

    const handleClick = useCallback(() => onClick(post), [onClick, post]);

    return (
      <motion.div
        style={{ width }}
        ref={ref}
        onClick={handleClick}
        data-post-id={post.id}
        data-start-year={post.startYear}
        initial={hasAnimated ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-xl shadow-lg shadow-stone-950/35"
        whileHover={{
          scale: 1.03,
          y: -3,
        }}
      >
        <ArticleCard post={post} />
      </motion.div>
    );
  },
);

export default memo(AnimatedCard);
