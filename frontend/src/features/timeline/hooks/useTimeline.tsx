import { useInfiniteQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { TIMELINE_QUERY } from "../../../graphql/queries";
import type {
  Post,
  TimelineQueryVariables,
  TimelineResponse,
} from "../../../generated/graphql";
import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";

interface UseTimelineOptions {
  filter?: TimelineQueryVariables["filter"];
  initialCursor?: string | null;
}

const EMPTY_POSTS: Post[] = [];

export default function useTimeline({
  filter,
  initialCursor = null,
}: UseTimelineOptions = {}) {
  const { isAuth } = useAuth();

  const viewerKey = isAuth.id ?? "anonymous";

  const query = useInfiniteQuery({
    queryKey: ["timeline", "list", filter, viewerKey],
    queryFn: async ({ pageParam = initialCursor }) => {
      const data = await graphqlRequest<
        { timeline: TimelineResponse },
        TimelineQueryVariables
      >(TIMELINE_QUERY, {
         cursor: pageParam ?? undefined,
        filter,
      });

      if (!data?.timeline) throw new Error("No timeline data returned");
      return data.timeline;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: initialCursor,
    placeholderData: (previousData, previousQuery) => {
      const [, previousFilter, previousViewerKey] =
        (previousQuery?.queryKey as [string, typeof filter, string]) ?? [];

      const isSameFilter =
        JSON.stringify(previousFilter) === JSON.stringify(filter);

      const isSameViewer = previousViewerKey === viewerKey;

      return isSameFilter && isSameViewer ? previousData : undefined;
    },
    staleTime: 1000 * 60 * 30,
  });

  const posts = useMemo(
    () => query.data?.pages.flatMap((p) => p.posts) ?? EMPTY_POSTS,
    [query.data],
  );

  return {
    posts,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}