import { useState, useCallback, Suspense, lazy } from "react";
import type { Post } from "../../generated/graphql";
import type { TimelineFilter } from "../drawer/drawerTypes";
import AnimatedCard from "./AnimatedCard";
import Skeleton from "../Skeleton";
import useTimeline from "../../hooks/useTimeline";
import { useEraTracker } from "../../hooks/useEraTracker";
import { AnimatePresence, motion } from "framer-motion";
import { Masonry, useInfiniteLoader } from "masonic";

const PostModal = lazy(() => import("../modal/PostModal"));

export default function Timeline({ filter }: { filter: TimelineFilter }) {
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTimeline({ filter });
  const [openPost, setOpenPost] = useState<Post | null>(null);

  useEraTracker(posts);

  const maybeLoadMore = useInfiniteLoader(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      threshold: 4,
    }
  );

  const renderCard = useCallback(
    ({ data, width }: { data: Post; width: number }) => (
      <AnimatedCard post={data} width={width} onClick={setOpenPost} />
    ),
    []
  );

  return (
    <div className="p-2 relative pb-20">
      {!isLoading && posts.length === 0 && (
        <div className="p-8 text-center text-sm text-slate-400">
          No posts yet
        </div>
      )}

      {posts.length > 0 && (
        <Masonry
          items={posts}
          itemKey={(post: Post) => post.id}
          columnGutter={12}
          columnWidth={310}
          onRender={maybeLoadMore}
          render={renderCard}
        />
      )}

      {(isLoading || isFetchingNextPage) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3"
        >
          <Skeleton />
          <Skeleton />
        </motion.div>
      )}

      <AnimatePresence>
        {openPost && (
          <Suspense fallback={null}>
            <PostModal open post={openPost} onClose={() => setOpenPost(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
