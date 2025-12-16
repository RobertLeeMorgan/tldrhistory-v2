import { animatedPosts } from "../../utils/animatedCache";
import ArticleCard from "../cards/ArticleCard";
import { useEffect } from "react";
import type { Post } from "../../generated/graphql";
import { motion } from "framer-motion";

export default function AnimatedCard({
  post,
  width,
  onClick,
}: {
  post: Post;
  width: number;
  onClick: (p: Post) => void;
}) {
  const hasAnimated = animatedPosts.has(post.id);

  useEffect(() => {
    if (!hasAnimated) {
      animatedPosts.add(post.id);
    }
  }, [hasAnimated, post.id]);

  return (
    <motion.div
      style={{ width }}
      onClick={() => onClick(post)}
      data-post-id={post.id}
      data-start-year={post.startYear}
      initial={hasAnimated ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="card overflow-hidden"
      whileHover={{
        scale: 1.03,
        y: -3,
        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
      }}
    >
      <ArticleCard post={post} />
    </motion.div>
  );
}
