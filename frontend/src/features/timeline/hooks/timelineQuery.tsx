import { infiniteQueryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { TIMELINE_QUERY } from "../../../graphql/queries";
import type {
  TimelineQueryVariables,
  TimelineResponse,
} from "../../../generated/graphql";

export function timelineQueryKey(args: {
  filter?: TimelineQueryVariables["filter"];
  viewerKey: string;
}) {
  return ["timeline", "list", args.filter ?? null, args.viewerKey] as const;
}

export function timelineInfiniteQueryOptions(args: {
  filter?: TimelineQueryVariables["filter"];
  viewerKey: string;
}) {
  const { filter, viewerKey } = args;

  return infiniteQueryOptions({
    queryKey: timelineQueryKey({ filter, viewerKey }),
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const data = await graphqlRequest<
        { timeline: TimelineResponse },
        TimelineQueryVariables
      >(TIMELINE_QUERY, {
        cursor: pageParam ?? undefined,
        filter,
      });

      if (!data?.timeline) {
        throw new Error("No timeline data returned");
      }

      return data.timeline;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}