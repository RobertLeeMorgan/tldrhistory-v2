import Timeline from "../../src/features/timeline/components/Timeline";
import { useTimelineFilter } from "../../src/context/FilterContext";
import type { Route } from "./+types/timeline";
import { buildMeta } from "../../src/lib/seo";

export { timelineLoader as loader } from "../../src/features/timeline/hooks/timelineLoader";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "History Timeline | TLDR History",
    description:
      "Browse an interactive timeline of human history across eras, civilisations, and major turning points.",
    path: "/timeline",
    type: "website",
  });
}

export default function TimelineIndex() {
  const { filter } = useTimelineFilter();

  return <Timeline filter={filter} />;
}