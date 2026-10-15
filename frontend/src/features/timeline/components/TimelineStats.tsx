import { lazy, Suspense, useMemo, useState } from "react";
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
      className="timeline-stats-shell fixed inset-x-0 bottom-0 z-30 w-full border-t border-divider bg-surface/98 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-0 sm:left-0 sm:top-[calc(var(--nav-height)+var(--timeline-header-height))] sm:w-[var(--timeline-sidebar-width)] sm:overflow-y-auto sm:border-t-0 sm:border-r sm:pb-9"
    >
      <div className="grid min-w-0 grid-cols-[55%_45%] px-3 py-2 sm:flex sm:h-full sm:flex-col sm:px-4 sm:py-0">
        {/* Statistics column */}
        <div className="flex min-w-0 flex-col gap-1.5 pr-2 sm:contents">
          {/* Population */}
          <section
            aria-label="Timeline facts"
            className="min-w-0 border-b border-divider/70 pb-1.5 sm:shrink-0 sm:pb-0"
          >
            <div className="flex min-w-0 items-center gap-2 sm:px-[var(--timeline-stats-padding)] sm:py-[var(--timeline-stats-item-padding)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="hidden size-7 shrink-0 fill-none stroke-accent sm:block"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M5.5 19c.4-4 2.6-6 6.5-6s6.1 2 6.5 6M5 10.5a2.5 2.5 0 1 0 0-5M19 10.5a2.5 2.5 0 1 1 0-5M2.5 18c.2-2.7 1.4-4.3 3.7-4.8M21.5 18c-.2-2.7-1.4-4.3-3.7-4.8" />
              </svg>

              <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2 sm:block">
                <p className="shrink-0 text-[0.55rem] font-bold uppercase tracking-[0.04em] text-accent sm:text-[0.6rem] sm:tracking-[0.08em]">
                  Population
                </p>
                <p
                  className="min-w-0 truncate text-right font-serif text-xs font-semibold text-content sm:text-left sm:text-lg"
                  aria-live="polite"
                >
                  {population.isLoading
                    ? "Loading…"
                    : population.isError
                      ? "Unavailable"
                      : (
                        <AnimatedNumber
                          value={populationValue}
                          format={(value) =>
                            formatPopulation(Math.round(value))
                          }
                        />
                      )}
                </p>
              </div>
            </div>
          </section>

          {/* Significant articles */}
          <section
            aria-labelledby="most-significant-heading"
            className="min-w-0 sm:shrink-0 sm:border-b sm:border-divider/70"
          >
            <h2
              id="most-significant-heading"
              className="pb-0.5 text-[0.52rem] font-bold uppercase tracking-[0.08em] text-accent-muted sm:px-[var(--timeline-stats-padding)] sm:pb-0.5 sm:pt-[var(--timeline-stats-item-padding)] sm:text-[0.55rem] sm:tracking-[0.11em] hidden sm:block"
            >
              Most Significant
            </h2>

            <div className="flex min-w-0 flex-col">
              {[
                { label: "Person", post: person },
                { label: "Event", post: event },
                { label: "Landmark", post: landmark },
              ].map(({ label, post }) => {
                const image = post?.cdnId
                  ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
                  : post?.imageUrl;

                const PostIcon =
                  (post?.group?.icon && ICON_MAP[post.group.icon]) || Icon;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => post && setOpenPost(post)}
                    disabled={
                      !post || significant.isLoading || significant.isError
                    }
                    className="flex w-full min-w-0 items-baseline gap-2 py-0.5 text-left transition-colors hover:bg-canvas/45 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-default disabled:hover:bg-transparent sm:items-center sm:gap-2.5 sm:px-[var(--timeline-stats-padding)] sm:py-2"
                    aria-label={
                      post
                        ? `Open most significant ${label.toLowerCase()} article: ${cleanName(post.name)}`
                        : `Most significant ${label.toLowerCase()}`
                    }
                    title={post ? cleanName(post.name) : label}
                  >
                    <div className="hidden shrink-0 sm:block">
                      <ContextSwap
                        transitionKey={image ?? post?.id ?? `${label}-empty`}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt=""
                            className="size-8 rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <PostIcon
                            aria-hidden={true}
                            className="size-8 text-accent"
                          />
                        )}
                      </ContextSwap>
                    </div>

                    <div className="flex min-w-0 flex-1 items-baseline gap-2 sm:block">
                      <p className="w-14 shrink-0 text-[0.55rem] font-bold uppercase tracking-[0.04em] text-accent sm:w-auto sm:text-[0.62rem] sm:tracking-[0.08em]">
                        {label}
                      </p>

                      {significant.isLoading ? (
                        <p className="min-w-0 truncate text-[0.65rem] text-content-muted sm:text-xs">
                          Updating…
                        </p>
                      ) : significant.isError || !post ? (
                        <p className="min-w-0 truncate text-[0.65rem] text-content-muted sm:text-xs">
                          —
                        </p>
                      ) : (
                        <p className="min-w-0 truncate font-serif text-[0.65rem] font-semibold text-content sm:text-sm">
                          <ContextSwap transitionKey={post.id}>
                            {cleanName(post.name)}
                          </ContextSwap>
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Civilisation map */}
        <section className="flex min-w-0 flex-col pl-2 sm:min-h-0 sm:flex-1 sm:px-[var(--timeline-stats-padding)] sm:py-[var(--timeline-stats-padding)]">
          <div className="hidden items-center justify-between gap-1 sm:flex">
            <p className="truncate text-[0.62rem] font-bold uppercase tracking-[0.11em] text-accent-muted">
              Civilisations
            </p>
            <LuMap aria-hidden="true" className="size-4 text-accent" />
          </div>

          <button
            type="button"
            onClick={() => setMapOpen(true)}
            disabled={civilisationQuery.isLoading || civilisationQuery.isError}
            className="grid min-h-0 flex-1 place-items-center overflow-hidden rounded-md border border-divider/70 bg-canvas/25 transition-colors hover:bg-canvas/45 disabled:opacity-50 sm:mt-1 sm:h-[var(--timeline-stats-map-height)] sm:flex-none"
            aria-label={
              remainingCivilisations > 0
                ? `Open civilisation map and see ${remainingCivilisations} more`
                : "Open civilisation map"
            }
          >
            {civilisationQuery.isLoading ? (
              <span className="text-xs text-content-muted">Loading…</span>
            ) : civilisationQuery.isError ? (
              <span className="text-xs text-content-muted">—</span>
            ) : (
              <WorldMap
                civilisations={civilisations}
                isInteractive={false}
              />
            )}
          </button>

          <div className="hidden grid-cols-[minmax(0,1fr)_auto] sm:grid">
            {legend.length > 0 && (
              <ol
                className="mt-2 space-y-1"
                aria-label="Most significant civilisations in this era"
              >
                {legend.map((civilisation) => (
                  <li
                    key={civilisation.id}
                    className="flex min-w-0 items-center gap-2 text-xs text-content-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: groupColor(
                          civilisation.group?.id ?? null,
                          civilisation.country.continent as Continent,
                        ),
                      }}
                    />
                    <span className="truncate">
                      {cleanName(civilisation.name)}
                    </span>
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
        <MapModal
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          civilisations={civilisations}
        />
      </Suspense>
    )}

    {openPost && (
      <Suspense fallback={null}>
        <PostModal
          open
          post={openPost}
          onClose={() => setOpenPost(null)}
        />
      </Suspense>
    )}
  </>
);}                                                         
