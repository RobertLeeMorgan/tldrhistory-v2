import { graphqlRequest } from "../../../lib/graphql";
import { TIMELINE_QUERY } from "../../../graphql/queries";
import type {
  TimelineQueryVariables,
  TimelineResponse,
} from "../../../generated/graphql";

export async function fetchTimeline({
  filter,
  cursor,
  viewerId = "anonymous",
}: {
  filter?: TimelineQueryVariables["filter"];
  cursor?: string | null;
  viewerId?: string;
}): Promise<TimelineResponse> {
  const data = await graphqlRequest<
    { timeline: TimelineResponse },
    TimelineQueryVariables
  >(TIMELINE_QUERY, {
    cursor: cursor ?? undefined,
    filter,
    viewerId,
  });

  if (!data?.timeline) {
    throw new Error("No timeline data returned");
  }

  return data.timeline;
}