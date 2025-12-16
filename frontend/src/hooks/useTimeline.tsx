import { useInfiniteQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import { TIMELINE_QUERY } from "../graphql/queries";
import type {
  Post,
  TimelineQueryVariables,
  TimelineResponse,
} from "../generated/graphql";

interface UseTimelineOptions {
  filter?: TimelineQueryVariables["filter"];
  initialCursor?: string | null;
}

type TimelineSelectedData = {
  pages: TimelineResponse[];
  pageParams: unknown[];
  posts: Post[];
};

export default function useTimeline({
  filter,
  initialCursor = null,
}: UseTimelineOptions = {}) {
  const query = useInfiniteQuery<TimelineResponse, Error, TimelineSelectedData>(
    {
      queryKey: ["timeline", filter],
      queryFn: async ({ pageParam = initialCursor }) => {
        const data = await graphqlRequest<
          { timeline: TimelineResponse },
          TimelineQueryVariables
        >(TIMELINE_QUERY, {
          cursor: pageParam ? String(pageParam) : undefined,
          filter,
        });

        if (!data?.timeline) throw new Error("No timeline data returned");
        return data.timeline;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: initialCursor,
      staleTime: 1000 * 60 * 5,

      select: (data) => {
        const posts = data.pages.flatMap((p) => p.posts);
        return Object.freeze({
          ...data,
          posts,
        });
      },
    }
  );

  return {
    posts: query.data?.posts ?? [],
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}
