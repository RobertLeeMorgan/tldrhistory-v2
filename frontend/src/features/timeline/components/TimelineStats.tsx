import { lazy, Suspense, useMemo, useState } from "react";
import { LuChevronDown, LuGlobe, LuMap, LuSparkles, LuUsers } from "react-icons/lu";
import { useEra } from "../../../context/EraContext";
import { useCivilisationQuery, usePopulationQuery, useSignificantQuery } from "../../stats/hooks/useStats";
import { formatPopulation } from "../../../utils/formatPopulation";
import { cleanName } from "../../../utils/cleanName";
import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import WorldMap from "../../../components/map/WorldMap";

const MapModal = lazy(() => import("../../../components/map/MapModal"));

export default function TimelineStats({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, dataStartYear, label } = useEra();
  const [expanded, setExpanded] = useState(false);
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
  const significantPost = significant.data?.getSignificant;
  const significantImage = significantPost?.cdnId
    ? "https://cdn.tldrhistory.xyz/" + significantPost.cdnId
    : significantPost?.imageUrl;

  return (
    <>
      <aside
        aria-label="Timeline context"
        className="mb-5 rounded-xl border border-divider bg-surface/95 shadow-xl shadow-black/20 lg:fixed lg:bottom-0 lg:left-0 lg:top-[calc(var(--nav-height)+var(--timeline-header-height))] lg:z-30 lg:mb-0 lg:w-[var(--timeline-sidebar-width)] lg:overflow-y-auto lg:rounded-none lg:border-b-0 lg:border-l-0 lg:border-t-0"
      >
        <button
          type="button"
          aria-expanded={expanded}
          className="flex min-h-12 w-full items-center justify-between px-4 text-left lg:hidden"
          onClick={() => setExpanded((value) => !value)}
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.15em] text-content-muted">Timeline context</span>
            <span className="font-serif text-lg text-content">{Math.abs(dataStartYear).toLocaleString()} · {label}</span>
          </span>
          <LuChevronDown aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        <div className={`${expanded ? "block" : "hidden"} space-y-5 p-4 lg:block lg:p-5`}>
          <header className="hidden lg:block">
            <p className="atlas-eyebrow">Global context</p>
            <h2 className="mt-2 font-serif text-2xl text-content">{label}</h2>
            <p className="mt-1 text-sm text-content-muted">Position: {Math.abs(dataStartYear).toLocaleString()} {dataStartYear < 0 ? "BCE" : "CE"}</p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <section className="rounded-lg border border-divider bg-canvas/55 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-content-muted">
                <LuUsers aria-hidden="true" className="text-accent" /> Estimated global population
              </p>
              <p className="mt-2 font-serif text-2xl text-content" aria-live="polite">
                {population.isLoading
                  ? "Loading…"
                  : population.isError
                    ? "Unavailable"
                    : formatPopulation(Number(population.data?.getPopulation ?? 0))}
              </p>
            </section>

            <section className="rounded-lg border border-divider bg-canvas/55 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-content-muted">
                <LuSparkles aria-hidden="true" className="text-accent" /> Most significant
              </p>
              {significant.isLoading ? (
                <p className="mt-3 text-sm text-content-muted">Updating…</p>
              ) : significant.isError || !significantPost ? (
                <p className="mt-3 text-sm text-content-muted">Unavailable for this context</p>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  {significantImage && <img src={significantImage} alt="" className="size-14 rounded-md object-cover" loading="lazy" />}
                  <p className="font-serif text-lg leading-tight text-content">{cleanName(significantPost.name)}</p>
                </div>
              )}
            </section>
          </div>

          <section className="border-t border-divider pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-content-muted">
                  <LuGlobe aria-hidden="true" className="text-accent" /> Article locations
                </p>
                <p className="mt-1 text-xs leading-5 text-content-muted">Modern country locations associated with active civilisation articles.</p>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-divider bg-canvas/60">
              {civilisationQuery.isLoading ? (
                <div className="grid aspect-[16/9] place-items-center text-sm text-content-muted">Loading map…</div>
              ) : civilisationQuery.isError ? (
                <div className="grid aspect-[16/9] place-items-center text-sm text-content-muted">Map unavailable</div>
              ) : (
                <WorldMap civilisations={civilisations} onClick={() => setMapOpen(true)} isInteractive={false} />
              )}
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              disabled={civilisationQuery.isLoading || civilisationQuery.isError}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent px-4 text-sm font-bold text-accent transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-50"
            >
              <LuMap aria-hidden="true" /> Open map
            </button>
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
