import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "../generated/graphql";
import ArticleCard from "./ArticleCard";
import { HISTORICAL_RANGES } from "../utils/historicalRanges";
import { useEra } from "../context/EraContext";
import Skeleton from "./Skeleton";
import PostModal from "./PostModal";
import useTimeline from "../hooks/useTimeline";

export default function Timeline() {
  const { posts, isLoading, prefetchNextEra, deletePost } = useTimeline();
  const { eraIndex: uiEraIndex, setEra } = useEra();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const entriesObserverRef = useRef<IntersectionObserver | null>(null);
  const lastObserverRef = useRef<IntersectionObserver | null>(null);
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const eraIndexForPost = (post: Post) =>
    HISTORICAL_RANGES.findIndex(
      (r) => post.startYear >= r.start && post.startYear <= r.end
    );

  const renderedPosts = useMemo(() => posts || [], [posts]);

  /** Era observer */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    entriesObserverRef.current?.disconnect();

    const thresholds = Array.from({ length: 20 }, (_, i) => (i + 1) / 20);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length === 0) return;

        const topEntry = visibleEntries.reduce((prev, curr) =>
          curr.boundingClientRect.top < prev.boundingClientRect.top
            ? curr
            : prev
        );

        const eraAttr = (topEntry.target as HTMLElement).dataset.eraIndex;
        if (!eraAttr) return;

        const eraNum = Number(eraAttr);
        if (eraNum !== uiEraIndex) {
          setEra(eraNum);
        }
      },
      {
        root: container,
        threshold: thresholds,
      }
    );

    const nodes = container.querySelectorAll("[data-post-id]");
    nodes.forEach((n) => observer.observe(n));

    entriesObserverRef.current = observer;

    return () => {
      observer.disconnect();
      entriesObserverRef.current = null;
    };
  }, [renderedPosts, setEra, uiEraIndex]);

  /** Prefetch */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || renderedPosts.length === 0) return;

    lastObserverRef.current?.disconnect();

    const last = renderedPosts[renderedPosts.length - 1];
    const lastEl = container.querySelector(
      `[data-post-id="${last.id}"]`
    ) as HTMLElement | null;
    if (!lastEl) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          prefetchNextEra();
        }
      },
      { root: container, threshold: 0.6 }
    );

    obs.observe(lastEl);
    lastObserverRef.current = obs;

    return () => {
      obs.disconnect();
      lastObserverRef.current = null;
    };
  }, [renderedPosts, prefetchNextEra]);

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-y-auto w-full gap-4"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {renderedPosts.length === 0 && !isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No posts yet
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4 w-full">
          {renderedPosts.map((post) => {
            const eraIdx = eraIndexForPost(post);
            return (
              <div
                key={post.id}
                data-post-id={post.id}
                data-era-index={eraIdx}
                onClick={() => setOpenPost(post)}
              >
                <ArticleCard post={post} />
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="mt-4">
            <Skeleton />
          </div>
        )}
      </div>

      <PostModal
        open={!!openPost}
        post={openPost}
        onClose={() => setOpenPost(null)}
        onDeleted={(id: string) => {
          deletePost(id);
          if (openPost?.id === id) {
            setOpenPost(null);
          }
        }}
      />
    </>
  );
}
