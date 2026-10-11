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
}: {
  posts: Post[];
  renderStaticCard: (post: Post) => React.ReactNode;
}) {
  return (
    <div>
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
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isFetchNextPageError, refetch } =
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

  useEffect(() => {
    const validIds = new Set(safePosts.map((p) => p.id));

    const staleIds: string[] = [];

    for (const id of postRefs.current.keys()) {
      if (!validIds.has(id)) {
        staleIds.push(id);
      }
    }

    for (const id of staleIds) {
      postRefs.current.delete(id);
    }
  }, [safePosts]);

  const getPostRef = useCallback((id: string) => {
    let ref = postRefs.current.get(id);
    if (!ref) {
      ref = createRef<HTMLDivElement>();
      postRefs.current.set(id, ref);
    }
    return ref;
  }, []);

  const scheduleEraUpdate = useEraTracker(safePosts, postRefs);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !error) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, error]);

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
      {!isLoading && !error && safePosts.length === 0 && (
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
          {!isEnhanced && <StaticTimelineGrid
            posts={safePosts}
            renderStaticCard={renderStaticCard}
          />}

          {isEnhanced && (
            <Masonry
              key={JSON.stringify(filter)}
              items={safePosts}
              itemKey={(post) => post.id}
              columnGutter={24}
              columnWidth={350}
              itemHeightEstimate={400}
              maxColumnCount={2}
              onRender={(start, end, items) => {
                maybeLoadMore(start, end, items);
                scheduleEraUpdate();
              }}
              render={renderMasonryCard}
            />
          )}
        </>
      )}

      {error && (
        <div role="alert" className="p-4 text-center text-gold">
          <p>Could not load {safePosts.length ? "more posts" : "the timeline"}.</p>
          <button type="button" className="btn btn-sm" onClick={() => {
            if (isFetchNextPageError) void fetchNextPage();
            else void refetch();
          }}>Retry</button>
        </div>
      )}

      {isFetchingNextPage && isEnhanced && (
        <span className="loading loading-spinner mx-auto flex pt-14 text-gold loading-xl" />
      )}

      <AnimatePresence>
        {openPost && (
          <Suspense fallback={null}>
            <PostModal open post={safePosts.find((post) => post.id === openPost.id) ?? openPost} onClose={() => setOpenPost(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
