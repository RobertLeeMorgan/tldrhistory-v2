import { lazy, Suspense, useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { LuMap } from "react-icons/lu";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEra } from "../../../context/EraContext";
import { useCivilisationQuery, usePopulationQuery, useSignificantQuery } from "../../stats/hooks/useStats";
import { formatPopulation } from "../../../utils/formatPopulation";
import { cleanName } from "../../../utils/cleanName";
import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import WorldMap from "../../../components/map/WorldMap";
import groupColor, { type Continent } from "../../../components/map/MapColour";
import { AnimatedNumber, ContextSwap } from "../../../components/ui/AnimatedValue";
import { ICON_MAP } from "../../../icons/iconMap";
import type { Post } from "../../../generated/graphql";

const MapModal = lazy(() => import("../../../components/map/MapModal"));

function useTimelinePostIcon(postId?: string) {
  const queryClient = useQueryClient();
  const getSnapshot = useCallback(() => {
    if (!postId) return "";
    const queries = queryClient.getQueriesData<InfiniteData<{ posts: Post[] }>>({ queryKey: ["timeline"] });
    for (const [, data] of queries) {
      for (const page of data?.pages ?? []) {
        const post = page.posts.find((item) => item.id === postId);
        if (post?.group?.icon) return post.group.icon;
      }
    }
    return "";
  }, [postId, queryClient]);
  const subscribe = useCallback(
    (onStoreChange: () => void) => queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === "timeline") onStoreChange();
    }),
    [queryClient],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => "");
}

export default function TimelineStats({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, dataStartYear, Icon } = useEra();
  const [mapOpen, setMapOpen] = useState(false);
  const population = usePopulationQuery({ start: startYear });
  const significant = useSignificantQuery({ startYear, endYear, filter });
  const civilisationQuery = useCivilisationQuery({ startYear, endYear, filter });
  const civilisationsRaw = useMemo(
    () => civilisationQuery.data?.getCivilisation ?? [],
    [civilisationQuery.data?.getCivilisation],
  );
  const civilisations = useMemo(
    () => Array.from(new Map(civilisationsRaw.map((item) => [cleanName(item.name), item])).values()),
    [civilisationsRaw],
  );
  const legend = useMemo(
    () => civilisations
      .filter((item) => item.startYear <= dataStartYear && (item.endYear === 0 || item.endYear >= dataStartYear))
      .sort((a, b) => b.startSignificance - a.startSignificance)
      .slice(0, 3),
    [civilisations, dataStartYear],
  );
  const significantPost = significant.data?.getSignificant;
  const significantImage = significantPost?.cdnId
    ? "https://cdn.tldrhistory.xyz/" + significantPost.cdnId
    : significantPost?.imageUrl;
  const significantIconName = useTimelinePostIcon(significantPost?.id);
  const SignificantIcon = ICON_MAP[significantIconName] ?? Icon;
  const populationValue = Number(population.data?.getPopulation ?? 0);

  return (
    <>
      <aside
        aria-label="Timeline context"
        className="fixed inset-x-0 bottom-0 z-30 h-24 border-t border-divider bg-surface/98 shadow-[0_-12px_36px_rgba(0,0,0,.28)] backdrop-blur-xl lg:inset-x-auto lg:left-0 lg:top-[calc(var(--nav-height)+var(--timeline-header-height))] lg:h-auto lg:w-[var(--timeline-sidebar-width)] lg:overflow-y-auto lg:border-r lg:border-t-0 lg:shadow-xl"
      >
        <div className="grid h-full min-w-0 grid-cols-3 lg:block lg:h-auto">
          <section className="min-w-0 border-r border-divider/70 px-2 py-2 lg:border-b lg:border-r-0 lg:px-4 lg:py-4">
            <p className="truncate text-[0.62rem] font-bold uppercase tracking-[0.11em] text-content-muted lg:text-xs">Global population</p>
            <div className="mt-1 flex min-w-0 items-center gap-2">
              <p className="min-w-0 truncate font-serif text-base font-semibold text-content sm:text-lg lg:text-2xl" aria-live="polite">
                {population.isLoading
                  ? "Loading…"
                  : population.isError
                    ? "Unavailable"
                    : <AnimatedNumber value={populationValue} format={(value) => formatPopulation(Math.round(value))} />}
              </p>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-auto size-6 shrink-0 fill-none stroke-accent lg:size-8" strokeWidth="1.6">
                <circle cx="12" cy="8" r="3" />
                <path d="M5.5 19c.4-4 2.6-6 6.5-6s6.1 2 6.5 6M5 10.5a2.5 2.5 0 1 0 0-5M19 10.5a2.5 2.5 0 1 1 0-5M2.5 18c.2-2.7 1.4-4.3 3.7-4.8M21.5 18c-.2-2.7-1.4-4.3-3.7-4.8" />
              </svg>
            </div>
            <p className="mt-1 hidden text-xs text-content-muted lg:block">Estimated for the current era</p>
          </section>

          <section className="min-w-0 border-r border-divider/70 px-2 py-2 lg:border-b lg:border-r-0 lg:px-4 lg:py-4">
            <p className="truncate text-[0.62rem] font-bold uppercase tracking-[0.11em] text-content-muted lg:text-xs">Most significant</p>
            {significant.isLoading ? (
              <p className="mt-1 truncate text-sm text-content-muted">Updating…</p>
            ) : significant.isError || !significantPost ? (
              <p className="mt-1 truncate text-sm text-content-muted">Unavailable</p>
            ) : (
              <div className="mt-1 flex min-w-0 items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-serif text-sm font-semibold text-content sm:text-base lg:text-xl lg:leading-tight">
                  <ContextSwap transitionKey={significantPost.id}>{cleanName(significantPost.name)}</ContextSwap>
                </p>
                <ContextSwap transitionKey={significantImage ?? significantPost.id} className="shrink-0">
                  {significantImage ? (
                    <img src={significantImage} alt="" className="size-7 rounded-full object-cover lg:size-10" loading="lazy" />
                  ) : (
                    <SignificantIcon aria-hidden="true" className="size-7 text-accent lg:size-10" />
                  )}
                </ContextSwap>
              </div>
            )}
            <p className="mt-1 hidden text-xs text-content-muted lg:block">Highest influence in this context</p>
          </section>

          <section className="min-w-0 px-1.5 py-1.5 lg:px-4 lg:py-4">
            <div className="hidden items-center justify-between lg:flex">
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-content-muted">Civilisation map</p>
              <LuMap aria-hidden="true" className="text-accent" />
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              disabled={civilisationQuery.isLoading || civilisationQuery.isError}
              className="grid h-full w-full min-w-0 place-items-center overflow-hidden rounded-md transition-colors hover:bg-canvas/45 disabled:opacity-50 lg:mt-2 lg:h-auto lg:border lg:border-divider lg:bg-canvas/35"
              aria-label="Open civilisation map"
            >
              {civilisationQuery.isLoading ? (
                <span className="text-xs text-content-muted">Loading…</span>
              ) : civilisationQuery.isError ? (
                <span className="text-xs text-content-muted">Unavailable</span>
              ) : (
                <WorldMap civilisations={civilisations} isInteractive={false} />
              )}
            </button>

            {legend.length > 0 && (
              <ol className="mt-3 hidden space-y-1.5 lg:block" aria-label="Most significant civilisations in this era">
                {legend.map((civilisation) => (
                  <li key={civilisation.id} className="flex min-w-0 items-center gap-2 text-xs text-content-muted">
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: groupColor(civilisation.group?.id ?? null, civilisation.country.continent as Continent) }}
                    />
                    <span className="truncate">{cleanName(civilisation.name)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </aside>

      {mapOpen && (
        <Suspense fallback={null}>
          <MapModal open={mapOpen} onClose={() => setMapOpen(false)} civilisations={civilisations} />
        </Suspense>
      )}
    </>
  );
}
