import ArticleCard from "./TimelineCard";
import { useCallback, memo, forwardRef } from "react";
import type { Post } from "../../../generated/graphql";

interface AnimatedCardProps {
  post: Post;
  width?: number;
  onClick: (p: Post) => void;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ post, width, onClick }, ref) => {
    const handleClick = useCallback(() => onClick(post), [onClick, post]);

    return (
      <div
        ref={ref}
        style={{ width }}
        onClick={handleClick}
        data-post-id={post.id}
        data-start-year={post.startYear}
        className="rounded-2xl"
      >
        <ArticleCard post={post} onOpen={handleClick} />
      </div>
    );
  },
);

export default memo(AnimatedCard);
