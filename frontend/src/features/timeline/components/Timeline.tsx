import {
  useState,
  useCallback,
  Suspense,
  lazy,
  createRef,
  useMemo,
  useRef,
  useEffect,
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

function StaticTimelineGrid({
  posts,
  renderStaticCard,
  hidden,
}: {
  posts: Post[];
  renderStaticCard: (post: Post) => React.ReactNode;
  hidden: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={hidden ? "pointer-events-none invisible absolute inset-0" : ""}
    >
      <div className="columns-1 gap-6 lg:columns-2">
        {posts.map((post) => (
          <div key={post.id} className="mb-6 break-inside-avoid">
            {renderStaticCard(post)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Timeline({ filter }: { filter: TimelineFilter }) {
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTimeline({ filter });

  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    setIsEnhanced(true);
  }, []);

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

  const renderMasonryCard = useCallback(
    ({ data, width }: { data: Post; width: number }) => (
      <AnimatedCard
        key={data.id}
        post={data}
        width={width}
        onClick={setOpenPost}
        ref={getPostRef(data.id)}
      />
    ),
    [getPostRef],
  );

  const renderStaticCard = useCallback(
    (post: Post) => (
      <AnimatedCard
        key={post.id}
        post={post}
        onClick={setOpenPost}
        ref={getPostRef(post.id)}
      />
    ),
    [getPostRef],
  );

  return (
    <div className="relative pb-20">
      {!isLoading && safePosts.length === 0 && (
        <div className="p-8 text-center text-lg text-stone-900">
          No posts yet
        </div>
      )}

      {isLoading && safePosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid grid-cols-1 gap-3 lg:grid-cols-2"
        >
          <Skeleton />
          <Skeleton />
        </motion.div>
      )}

      {safePosts.length > 0 && (
        <>
          <StaticTimelineGrid
            posts={safePosts}
            renderStaticCard={renderStaticCard}
            hidden={isEnhanced}
          />

          {isEnhanced && (
            <Masonry
              key={JSON.stringify(filter)}
              items={safePosts}
              itemKey={(post) => post.id}
              columnGutter={24}
              columnWidth={350}
              itemHeightEstimate={400}
              onRender={maybeLoadMore}
              render={renderMasonryCard}
            />
          )}
        </>
      )}

      {isFetchingNextPage && isEnhanced && (
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