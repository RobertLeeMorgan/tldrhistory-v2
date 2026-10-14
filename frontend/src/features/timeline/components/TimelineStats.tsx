import { lazy, Suspense, useMemo, useState, type ComponentType } from "react";
import { LuMap } from "react-icons/lu";
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
const PostModal = lazy(() => import("./TimelineModal"));

type SignificantStatProps = {
  label: string;
  post: Post | null;
  isLoading: boolean;
  isError: boolean;
  fallbackIcon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  onOpen: (post: Post) => void;
};

function SignificantStat({
  label,
  post,
  isLoading,
  isError,
  fallbackIcon: FallbackIcon,
  onOpen,
}: SignificantStatProps) {
  const image = post?.cdnId
    ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
    : post?.imageUrl;
  const PostIcon = (post?.group?.icon && ICON_MAP[post.group.icon]) || FallbackIcon;

  return (
    <section className="min-w-0 border-divider/70">
      <button
        type="button"
        onClick={() => post && onOpen(post)}
        disabled={!post || isLoading || isError}
        className="flex h-full w-full min-w-0 flex-col items-start gap-1 px-1.5 py-1 text-left transition-colors hover:bg-canvas/45 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-default disabled:hover:bg-transparent md:flex-row md:items-center md:gap-2.5 md:px-[var(--timeline-stats-padding)] md:py-[var(--timeline-stats-item-padding)]"
        aria-label={post ? `Open most significant ${label.toLowerCase()} article: ${cleanName(post.name)}` : `Most significant ${label.toLowerCase()}`}
        title={label}
      >
        <ContextSwap transitionKey={image ?? post?.id ?? `${label}-empty`} className="shrink-0">
          {image ? (
            <img src={image} alt="" className="size-5 rounded-full object-cover sm:size-6 md:size-8" loading="lazy" />
          ) : (
            <PostIcon aria-hidden={true} className="size-5 text-accent sm:size-6 md:size-8" />
          )}
        </ContextSwap>

        <div className="min-w-0 max-w-full">
          <p className="truncate text-[0.55rem] font-bold uppercase tracking-[0.08em] text-content-muted md:text-[0.62rem]">
            {label}
          </p>
          {isLoading ? (
            <p className="truncate text-[0.62rem] text-content-muted md:text-xs">Updating…</p>
          ) : isError || !post ? (
            <p className="truncate text-[0.62rem] text-content-muted md:text-xs">—</p>
          ) : (
            <p className="min-w-0 truncate font-serif text-[0.62rem] font-semibold leading-tight text-content sm:text-xs md:text-sm">
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
        className="timeline-stats-shell relative z-20 w-full border-b border-divider bg-surface/98 shadow-xl backdrop-blur-xl md:fixed md:bottom-0 md:left-0 md:top-[calc(var(--nav-height)+var(--timeline-header-height))] md:w-[var(--timeline-sidebar-width)] md:overflow-y-auto md:border-b-0 md:border-r"
      >
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_clamp(6.5rem,28vw,8rem)] grid-rows-[3.5rem_minmax(5.5rem,auto)] md:flex md:h-full md:flex-col">
          <section aria-label="Timeline facts" className="min-w-0 border-b border-divider/70 md:shrink-0">
            <div className="flex min-w-0 items-center gap-1.5 px-2 py-1 md:gap-2 md:px-[var(--timeline-stats-padding)] md:py-[var(--timeline-stats-item-padding)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 fill-none stroke-accent md:size-7" strokeWidth="1.6">
                <circle cx="12" cy="8" r="3" />
                <path d="M5.5 19c.4-4 2.6-6 6.5-6s6.1 2 6.5 6M5 10.5a2.5 2.5 0 1 0 0-5M19 10.5a2.5 2.5 0 1 1 0-5M2.5 18c.2-2.7 1.4-4.3 3.7-4.8M21.5 18c-.2-2.7-1.4-4.3-3.7-4.8" />
              </svg>
              <div className="min-w-0">
                <p className="truncate text-[0.52rem] font-bold uppercase tracking-[0.08em] text-content-muted md:text-[0.6rem]">Global population</p>
                <p className="truncate font-serif text-xs font-semibold text-content sm:text-sm md:text-lg" aria-live="polite">
                  {population.isLoading
                    ? "Loading…"
                    : population.isError
                      ? "Unavailable"
                      : <AnimatedNumber value={populationValue} format={(value) => formatPopulation(Math.round(value))} />}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="most-significant-heading" className="min-w-0 overflow-hidden md:shrink-0 md:border-b md:border-divider/70">
            <h2 id="most-significant-heading" className="px-1.5 pt-1 text-[0.55rem] font-bold uppercase tracking-[0.11em] text-content-muted md:px-[var(--timeline-stats-padding)] md:pb-0.5 md:pt-[var(--timeline-stats-item-padding)]">
              Most Significant
            </h2>
            <div className="grid min-w-0 grid-cols-3 divide-x divide-divider/70 md:block md:divide-x-0 md:divide-y">
              <SignificantStat label="Person" post={person} isLoading={significant.isLoading} isError={significant.isError} fallbackIcon={Icon} onOpen={setOpenPost} />
              <SignificantStat label="Event" post={event} isLoading={significant.isLoading} isError={significant.isError} fallbackIcon={Icon} onOpen={setOpenPost} />
              <SignificantStat label="Landmark" post={landmark} isLoading={significant.isLoading} isError={significant.isError} fallbackIcon={Icon} onOpen={setOpenPost} />
            </div>
          </section>

          <section className="col-start-2 row-span-2 row-start-1 flex min-w-0 flex-col border-l border-divider/70 px-1.5 py-1.5 md:col-auto md:min-h-0 md:flex-1 md:border-l-0 md:px-[var(--timeline-stats-padding)] md:py-[var(--timeline-stats-padding)]">
            <div className="flex items-center justify-between gap-1">
              <p className="truncate text-[0.52rem] font-bold uppercase tracking-[0.08em] text-content-muted md:text-[0.62rem] md:tracking-[0.11em]">Civilisations</p>
              <span className="flex shrink-0 items-center gap-1">
                {remainingCivilisations > 0 && <span className="text-[0.55rem] font-semibold text-accent md:hidden">+{remainingCivilisations}</span>}
                <LuMap aria-hidden="true" className="size-3.5 text-accent md:size-4" />
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              disabled={civilisationQuery.isLoading || civilisationQuery.isError}
              className="mt-1 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-md border border-divider/70 bg-canvas/25 transition-colors hover:bg-canvas/45 disabled:opacity-50 md:h-[var(--timeline-stats-map-height)] md:flex-none"
              aria-label={remainingCivilisations > 0 ? `Open civilisation map and see ${remainingCivilisations} more` : "Open civilisation map"}
            >
              {civilisationQuery.isLoading ? (
                <span className="text-xs text-content-muted">Loading…</span>
              ) : civilisationQuery.isError ? (
                <span className="text-xs text-content-muted">—</span>
              ) : (
                <WorldMap civilisations={civilisations} isInteractive={false} />
              )}
            </button>

            <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-2 md:grid">
              {legend.length > 0 && (
                <ol className="mt-2 space-y-1" aria-label="Most significant civilisations in this era">
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
                <div className="mt-1.5 flex items-start justify-end">
                  <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    className="rounded px-1 py-0.5 !text-xs font-semibold text-accent underline decoration-transparent underline-offset-4 transition-colors hover:text-content hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    See {remainingCivilisations} more
                  </button>
                </div>
              )}
            </div>
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
