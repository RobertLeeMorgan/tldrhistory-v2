import {
  useState,
  useCallback,
  Suspense,
  lazy,
  createRef,
  useMemo,
  useRef,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { Post } from "../../../generated/graphql";
import type { TimelineFilter } from "../../../features/filter/components/TimelineFilter";
import AnimatedCard from "./AnimatedCard";
import Skeleton from "../../../components/ui/Skeleton";
import useTimeline from "../hooks/useTimeline";
import { useEraTracker } from "../hooks/useEraTracker";
import { Masonry, useInfiniteLoader } from "masonic";

const PostModal = lazy(() => import("./TimelineModal"));
const subscribeToHydration = () => () => {};

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
  const isEnhanced = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

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
        <div className="rounded-2xl border border-divider bg-surface p-8 text-center sm:p-12">
          <p className="atlas-eyebrow">No matches</p>
          <h2 className="mt-2 text-2xl font-bold text-content">No posts yet</h2>
          <p className="mt-2 text-sm text-content-muted">Try a broader date range or remove one of the active filters.</p>
        </div>
      )}

      {isLoading && safePosts.length === 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" role="status" aria-label="Loading timeline articles">
          <Skeleton />
          <Skeleton />
        </div>
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
              columnWidth={320}
              itemHeightEstimate={400}
              maxColumnCount={3}
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
        <div role="alert" className="rounded-xl border border-danger/35 bg-danger/8 p-5 text-center text-content">
          <p className="font-bold">Could not load {safePosts.length ? "more posts" : "the timeline"}.</p>
          <button type="button" className="mt-3 min-h-11 rounded-lg border border-danger px-4 text-sm font-bold text-danger hover:bg-danger/10" onClick={() => {
            if (isFetchNextPageError) void fetchNextPage();
            else void refetch();
          }}>Retry</button>
        </div>
      )}

      {isFetchingNextPage && isEnhanced && (
        <div className="flex items-center justify-center gap-3 py-12 text-sm font-bold text-content-muted" role="status">
          <span className="loading loading-spinner text-accent" aria-hidden="true" /> Loading more history…
        </div>
      )}

      {openPost && (
        <Suspense fallback={null}>
          <PostModal open post={safePosts.find((post) => post.id === openPost.id) ?? openPost} onClose={() => setOpenPost(null)} />
        </Suspense>
      )}
    </div>
  );
}
