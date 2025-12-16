import { queryClient } from "../lib/queryClient";
import { graphqlRequest } from "../lib/graphql";
import { TIMELINE_QUERY } from "../graphql/queries";
import type {
  TimelineQueryVariables,
  TimelineResponse,
} from "../generated/graphql";

export async function prefetchInitialTimeline(
  filter?: TimelineQueryVariables["filter"]
) {
  await queryClient.prefetchInfiniteQuery<
    TimelineResponse,
    Error,
    TimelineResponse
  >({
    queryKey: ["timeline", filter],
    queryFn: async ({ pageParam = null }) => {
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
    getNextPageParam: (lastPage: TimelineResponse) =>
      lastPage.nextCursor ?? undefined,
    initialPageParam: null,
  });
}
