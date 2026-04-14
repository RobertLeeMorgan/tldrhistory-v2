import {
  useState,
  useCallback,
  Suspense,
  lazy,
  createRef,
  useMemo,
  useRef,
} from "react";
import type { Post } from "../../../generated/graphql";
import type { TimelineFilter } from "../../../features/filter/components/TimelineFilter";
import AnimatedCard from "./AnimatedCard";
import Skeleton from "../../../components/ui/Skeleton";
import useTimeline from "../hooks/useTimeline";
import { useEraTracker } from "../hooks/useEraTracker";
import { AnimatePresence, motion } from "framer-motion";
import { Masonry, useInfiniteLoader } from "masonic";

const PostModal = lazy(() => import("./TimelineModal"));

export default function Timeline({ filter }: { filter: TimelineFilter }) {
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTimeline({ filter });

  const [openPost, setOpenPost] = useState<Post | null>(null);

  const safePosts = useMemo(
    () => posts.filter((post): post is Post => !!post && !!post.id),
    [posts],
  );

  const postRefs = useRef(
    new Map<string, React.RefObject<HTMLDivElement | null>>(),
  );

  const getPostRef = useCallback((id: string) => {
    let ref = postRefs.current.get(id);
    if (!ref) {
      ref = createRef<HTMLDivElement>();
      postRefs.current.set(id, ref);
    }
    return ref;
  }, []);

  useEraTracker(safePosts, postRefs.current);

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
    ({ data, width }: { data: Post; width: number }) => (
      <AnimatedCard
        post={data}
        width={width}
        onClick={setOpenPost}
        ref={getPostRef(data.id)}
        key={data.id}
      />
    ),
    [getPostRef],
  );

  return (
    <div className="pb-20">
      {!isLoading && safePosts.length === 0 && (
        <div className="p-8 text-center text-lg text-stone-900">
          No posts yet
        </div>
      )}

      {safePosts.length > 0 && (
        <Masonry
          key={JSON.stringify(filter)}
          items={safePosts}
          itemKey={(post) => post.id}
          columnGutter={24}
          columnWidth={350}
          onRender={maybeLoadMore}
          render={renderCard}
        />
      )}

      {isLoading && safePosts.length === 0 && (
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
        <span className="loading loading-spinner mx-auto flex pt-14 text-gold loading-xl" />
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
