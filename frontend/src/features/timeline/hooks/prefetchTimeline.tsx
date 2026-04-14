import { queryClient } from "../../../lib/queryClient";
import { graphqlRequest } from "../../../lib/graphql";
import { TIMELINE_QUERY } from "../../../graphql/queries";
import type {
  TimelineQueryVariables,
  TimelineResponse,
} from "../../../generated/graphql";

type PrefetchTimelineOptions = {
  filter?: TimelineQueryVariables["filter"];
  viewerKey?: string;
  initialCursor?: string | null;
};

export async function prefetchTimeline({
  filter,
  viewerKey = "anonymous",
  initialCursor = null,
}: PrefetchTimelineOptions = {}) {
  await queryClient.prefetchInfiniteQuery({
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
    getNextPageParam: (lastPage: TimelineResponse) => lastPage.nextCursor ?? undefined,
    initialPageParam: initialCursor,
    staleTime: 1000 * 60 * 30,
  });
}