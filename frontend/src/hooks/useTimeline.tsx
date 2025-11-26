import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import { TIMELINE_QUERY } from "../graphql/queries";
import { HISTORICAL_RANGES } from "../utils/historicalRanges";
import type { Post, TimelineQueryVariables } from "../generated/graphql";

export default function useTimeline () {
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const nextIndexRef = useRef<number>(0);
  const loadedRef = useRef<Set<number>>(new Set());
  const inFlightRef = useRef<Set<number>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    prefetchNextEra().catch(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchEra = useCallback(async (index: number) => {
    const era = HISTORICAL_RANGES[index];

    return graphqlRequest<
      { timeline: { posts: Post[]; } },
      TimelineQueryVariables
    >(TIMELINE_QUERY, { startYear: era.start, endYear: era.end });
  }, []);

  const loadEraAndAppend = useCallback(
    async (idx: number) => {
      if (idx < 0 || idx >= HISTORICAL_RANGES.length) return null;
      if (loadedRef.current.has(idx)) {
        return queryClient.getQueryData([
          "timeline",
          HISTORICAL_RANGES[idx].start,
          HISTORICAL_RANGES[idx].end,
        ]);
      }
      if (inFlightRef.current.has(idx)) {
        return null;
      }

      inFlightRef.current.add(idx);
      if (mountedRef.current) setIsLoading(true);
      setError(null);

      try {
        const data = await queryClient.fetchQuery({
          queryKey: [
            "timeline",
            HISTORICAL_RANGES[idx].start,
            HISTORICAL_RANGES[idx].end,
          ],
          queryFn: () => fetchEra(idx),
          staleTime: 1000 * 60 * 5,
        });

        if (!data) return null;

        if (!loadedRef.current.has(idx) && data.timeline.posts.length > 0) {
          setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const filtered = data.timeline.posts.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prev, ...filtered];
          });
        }

        loadedRef.current.add(idx);
        return data;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        inFlightRef.current.delete(idx);
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [fetchEra, queryClient]
  );

  const prefetchNextEra = useCallback(async () => {
    const idx = nextIndexRef.current;
    if (idx >= HISTORICAL_RANGES.length) return null;

    if (loadedRef.current.has(idx)) {
      nextIndexRef.current = idx + 1;
      return prefetchNextEra();
    }

    try {
      const data = await loadEraAndAppend(idx);
      nextIndexRef.current = idx + 1;
      return data;
    } catch (err) {
      return null;
    }
  }, [loadEraAndAppend]);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    posts,
    isLoading,
    error,
    prefetchNextEra,
    deletePost,
  };
};