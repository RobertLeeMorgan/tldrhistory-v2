import Timeline from "../../src/features/timeline/components/Timeline";
import { useTimelineFilter } from "../../src/context/FilterContext";
import type { Route } from "./+types/timeline.$groupSlug";
import { buildMeta } from "../../src/lib/seo";
import { themes } from "../../src/utils/drawerValues";

export { timelineLoader as loader } from "../../src/features/timeline/hooks/timelineLoader";

type ThemeOption = {
  slug: string;
  labelText: string;
  fallbackHeadline?: string;
};

export function meta({ params }: Route.MetaArgs) {
  const allThemes = themes.options as readonly ThemeOption[];
  const theme = allThemes.find((item) => item.slug === params.groupSlug);

  if (!theme) {
    return buildMeta({
      title: "Timeline Not Found | TLDR History",
      description: "The requested timeline could not be found.",
      path: `/timeline/${params.groupSlug ?? ""}`,
      robots: "noindex, nofollow",
      type: "website",
    });
  }

  const title = `${theme.labelText} Timeline | TLDR History`;
  const description =
    theme.fallbackHeadline ||
    `Explore the ${theme.labelText.toLowerCase()} timeline on TLDR History, including key events, people, and historical context.`;

  return buildMeta({
    title,
    description,
    path: `/timeline/${params.groupSlug}`,
    type: "article",
  });
}

export default function TimelineGroup() {
  const { filter } = useTimelineFilter();
  return <Timeline filter={filter} />;
}
