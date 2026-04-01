import {
  useState,
  useCallback,
  Suspense,
  lazy,
  createRef,
  useMemo,
} from "react";
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

  const postRefs = useMemo(
    () => new Map<string, React.RefObject<HTMLDivElement | null>>(),
    [],
  );

  useEraTracker(posts, postRefs);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const maybeLoadMore = useInfiniteLoader(loadMore, {
    isItemLoaded: (index, items) => index < items.length && !!items[index],
    threshold: 10,
  });

  const renderCard = useCallback(
    ({ data, width }: { data: Post; width: number }) => {
      let ref = postRefs.get(data.id);
      if (!ref) {
        ref = createRef<HTMLDivElement>();
        postRefs.set(data.id, ref);
      }
      return (
        <AnimatedCard
          post={data}
          width={width}
          onClick={setOpenPost}
          ref={ref}
          key={data.id}
        />
      );
    },
    [postRefs, setOpenPost],
  );

  return (
    <div className="pb-20">
      {!isLoading && posts.length === 0 && (
        <div className="p-8 text-center text-lg text-neutral-900">
          No posts yet
        </div>
      )}

      {posts.length > 0 && (
        <Masonry
          key={JSON.stringify(filter)}
          items={posts}
          itemKey={(post: Post) => post.id}
          columnGutter={16}
          columnWidth={310}
          onRender={maybeLoadMore}
          render={renderCard}
        />
      )}

      {isLoading && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >
          <Skeleton />
          <Skeleton />
        </motion.div>
      )}

      {isFetchingNextPage && (
            <span className="loading loading-spinner mx-auto flex pt-14 text-stone-800 loading-xl"></span>
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
