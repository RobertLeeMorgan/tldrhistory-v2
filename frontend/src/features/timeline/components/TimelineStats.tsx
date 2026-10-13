import { lazy, Suspense, useMemo, useState, type ComponentType } from "react";
import { LuCalendarDays, LuMap } from "react-icons/lu";
import { useEra } from "../../../context/EraContext";
import { useCivilisationQuery, usePopulationQuery, useSignificantQuery } from "../../stats/hooks/useStats";
import { formatPopulation } from "../../../utils/formatPopulation";
import { cleanName } from "../../../utils/cleanName";
import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import WorldMap from "../../../components/map/WorldMap";
import groupColor, { type Continent } from "../../../components/map/MapColour";
import { AnimatedNumber, ContextSwap } from "../../../components/ui/AnimatedValue";
import AnimatedYear from "../../../components/ui/AnimatedYear";
import { ICON_MAP } from "../../../icons/iconMap";
import type { Post } from "../../../generated/graphql";

const MapModal = lazy(() => import("../../../components/map/MapModal"));
const PostModal = lazy(() => import("./TimelineModal"));

type SignificantStatProps = {
  label: string;
  post: Post | null;
  isLoading: boolean;
  isError: boolean;
  fallbackIcon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  onOpen: (post: Post) => void;
  className?: string;
};

function SignificantStat({
  label,
  post,
  isLoading,
  isError,
  fallbackIcon: FallbackIcon,
  onOpen,
  className = "",
}: SignificantStatProps) {
  const image = post?.cdnId
    ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
    : post?.imageUrl;
  const PostIcon = (post?.group?.icon && ICON_MAP[post.group.icon]) || FallbackIcon;

  return (
    <section className={`min-w-0 border-divider/70 ${className}`}>
      <button
        type="button"
        onClick={() => post && onOpen(post)}
        disabled={!post || isLoading || isError}
        className="flex h-full w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-canvas/45 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-default disabled:hover:bg-transparent lg:gap-3 lg:px-4 lg:py-3"
        aria-label={post ? `Open ${label.toLowerCase()} article: ${cleanName(post.name)}` : label}
        title={label}
      >
        <ContextSwap transitionKey={image ?? post?.id ?? `${label}-empty`} className="shrink-0">
          {image ? (
            <img src={image} alt="" className="size-6 rounded-full object-cover md:size-7 lg:size-9" loading="lazy" />
          ) : (
            <PostIcon aria-hidden="true" className="size-6 text-accent md:size-7 lg:size-9" />
          )}
        </ContextSwap>

        <div className="min-w-0">
          <p className="truncate text-[0.58rem] font-bold tracking-[0.08em] text-content-muted lg:text-[0.68rem]">
            {label}
          </p>
          {isLoading ? (
            <p className="mt-0.5 truncate text-xs text-content-muted">Updating…</p>
          ) : isError || !post ? (
            <p className="mt-0.5 truncate text-xs text-content-muted">Unavailable</p>
          ) : (
            <p className="mt-0.5 min-w-0 truncate font-serif text-xs font-semibold leading-tight text-content sm:text-sm lg:text-base">
              <ContextSwap transitionKey={post.id}>{cleanName(post.name)}</ContextSwap>
            </p>
          )}
        </div>
      </button>
    </section>
  );
}

export default function TimelineStats({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, dataStartYear, Icon } = useEra();
  const [mapOpen, setMapOpen] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);
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
  const activeCivilisations = useMemo(
    () => civilisations
      .filter((item) => item.startYear <= dataStartYear && (item.endYear === 0 || item.endYear >= dataStartYear))
      .sort((a, b) => b.startSignificance - a.startSignificance),
    [civilisations, dataStartYear],
  );
  const legend = activeCivilisations.slice(0, 3);
  const remainingCivilisations = Math.max(0, activeCivilisations.length - legend.length);
  const significantPosts = significant.data?.getSignificant;
  const person = (significantPosts?.person ?? null) as Post | null;
  const event = (significantPosts?.event ?? null) as Post | null;
  const landmark = (significantPosts?.landmark ?? null) as Post | null;
  const populationValue = Number(population.data?.getPopulation ?? 0);

  return (
    <>
      <aside
        aria-label="Timeline context"
        className="fixed inset-x-0 bottom-0 z-30 h-36 border-t border-divider bg-surface/98 shadow-[0_-12px_36px_rgba(0,0,0,.28)] backdrop-blur-xl lg:inset-x-auto lg:left-0 lg:top-[calc(var(--nav-height)+var(--timeline-header-height))] lg:h-auto lg:max-h-[calc(100dvh-var(--nav-height)-var(--timeline-header-height))] lg:w-[var(--timeline-sidebar-width)] lg:overflow-y-auto lg:border-r lg:border-t-0 lg:shadow-xl"
      >
        <div className="grid h-full min-w-0 grid-cols-3 grid-rows-2 lg:block lg:h-auto">
          <section className="flex min-w-0 items-center gap-2 border-b border-r border-divider/70 px-2 py-1.5 lg:gap-3 lg:px-4 lg:py-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6 shrink-0 fill-none stroke-accent md:size-7 lg:size-9"
              strokeWidth="1.6"
            >
              <circle cx="12" cy="8" r="3" />
              <path d="M5.5 19c.4-4 2.6-6 6.5-6s6.1 2 6.5 6M5 10.5a2.5 2.5 0 1 0 0-5M19 10.5a2.5 2.5 0 1 1 0-5M2.5 18c.2-2.7 1.4-4.3 3.7-4.8M21.5 18c-.2-2.7-1.4-4.3-3.7-4.8" />
            </svg>
            <div className="min-w-0">
              <p className="truncate text-[0.58rem] font-bold tracking-[0.08em] text-content-muted lg:text-[0.68rem]">
                Global population
              </p>
              <p className="mt-0.5 min-w-0 truncate font-serif text-sm font-semibold text-content sm:text-base lg:text-xl" aria-live="polite">
                {population.isLoading
                  ? "Loading…"
                  : population.isError
                    ? "Unavailable"
                    : <AnimatedNumber value={populationValue} format={(value) => formatPopulation(Math.round(value))} />}
              </p>
            </div>
          </section>

          <section className="flex min-w-0 items-center gap-2 border-b border-r border-divider/70 px-2 py-1.5 lg:gap-3 lg:px-4 lg:py-3">
            <LuCalendarDays aria-hidden="true" className="size-6 shrink-0 text-accent md:size-7 lg:size-9" />
            <div className="min-w-0">
              <p className="truncate text-[0.58rem] font-bold tracking-[0.08em] text-content-muted lg:text-[0.68rem]">
                Timeline year
              </p>
              <p className="mt-0.5 truncate font-serif text-sm font-semibold text-content sm:text-base lg:text-xl" aria-live="polite">
                <AnimatedYear year={dataStartYear} />
              </p>
            </div>
          </section>

          <SignificantStat
            label="Most significant person"
            post={person}
            isLoading={significant.isLoading}
            isError={significant.isError}
            fallbackIcon={Icon}
            onOpen={setOpenPost}
            className="border-b lg:border-r-0"
          />
          <SignificantStat
            label="Most significant event"
            post={event}
            isLoading={significant.isLoading}
            isError={significant.isError}
            fallbackIcon={Icon}
            onOpen={setOpenPost}
            className="border-r lg:border-r-0 lg:border-b"
          />
          <SignificantStat
            label="Most significant landmark"
            post={landmark}
            isLoading={significant.isLoading}
            isError={significant.isError}
            fallbackIcon={Icon}
            onOpen={setOpenPost}
            className="border-r lg:border-r-0 lg:border-b"
          />

          <section className="flex min-w-0 flex-col px-1.5 py-1.5 lg:px-4 lg:py-4">
            <div className="hidden items-center justify-between lg:flex">
              <p className="text-xs font-bold tracking-[0.11em] text-content-muted">Active civilisations</p>
              <LuMap aria-hidden="true" className="text-accent" />
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              disabled={civilisationQuery.isLoading || civilisationQuery.isError}
              className="grid min-h-0 flex-1 place-items-center overflow-hidden rounded-md transition-colors hover:bg-canvas/45 disabled:opacity-50 lg:mt-2 lg:h-auto lg:flex-none lg:border lg:border-divider lg:bg-canvas/35"
              aria-label={remainingCivilisations > 0 ? `Open civilisation map and see ${remainingCivilisations} more` : "Open civilisation map"}
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
            {remainingCivilisations > 0 && (
              <div className="mt-2 hidden justify-end lg:flex">
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="rounded px-1 py-0.5 text-xs font-semibold text-accent underline decoration-transparent underline-offset-4 transition-colors hover:text-content hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  See {remainingCivilisations} more
                </button>
              </div>
            )}
          </section>
        </div>
      </aside>

      {mapOpen && (
        <Suspense fallback={null}>
          <MapModal open={mapOpen} onClose={() => setMapOpen(false)} civilisations={civilisations} />
        </Suspense>
      )}
      {openPost && (
        <Suspense fallback={null}>
          <PostModal open post={openPost} onClose={() => setOpenPost(null)} />
        </Suspense>
      )}
    </>
  );
}
