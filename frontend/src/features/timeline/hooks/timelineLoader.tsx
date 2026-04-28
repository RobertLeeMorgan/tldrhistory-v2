import { getGroupIdFromSlug } from "../../../utils/groupLookup";
import { buildTimelineFilterFromUrl } from "../../filter/components/buildTimelineFilterFromUrl";
import { fetchTimeline } from "./fetchTimeline";

export async function timelineLoader({
  request,
  params,
}: {
  request: Request;
  params?: { groupSlug?: string };
}) {
  const groupId = getGroupIdFromSlug(params?.groupSlug ?? null);

  if (params?.groupSlug && !groupId) {
    throw new Response("Not Found", { status: 404 });
  }

  const filter = buildTimelineFilterFromUrl({
    groupSlug: params?.groupSlug,
    requestUrl: request.url,
  });

  const initialData = await fetchTimeline({
    filter,
    cursor: null,
    viewerId: "anonymous",
  });

  return { filter, initialData, viewerId: "anonymous", };
}