import { useEra } from "../../../context/EraContext";
import {
  useCivilisationQuery,
  usePopulationQuery,
  useSignificantQuery,
} from "../../stats/hooks/useStats";
import { formatPopulation } from "../../../utils/formatPopulation";
import { cleanName } from "../../../utils/cleanName";
import type { TimelineFilter } from "../../../features/filter/components/TimelineFilter";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { useCountAnimation } from "../../../hooks/useCountUp";
import { lazy, Suspense, useMemo, useState } from "react";
import WorldMap from "../../../components/map/WorldMap";
import StatsContainer from "../../stats/components/StatsContainer";
import { StatBlock } from "../../stats/components/StatsBlock";

const MapModal = lazy(() => import("../../../components/map/MapModal"));

export default function TimelineStats({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, Icon } = useEra();
  const [mapOpen, setMapOpen] = useState(false);

  const { data, isLoading } = usePopulationQuery({ start: startYear });

  const {
    data: sigData,
    isLoading: sigLoading,
    isError: sigError,
  } = useSignificantQuery({
    startYear: startYear,
    endYear: endYear,
    filter: filter,
  });

  const { data: civData, isLoading: civLoading } = useCivilisationQuery({
    startYear: startYear,
    endYear: endYear,
    filter: filter,
  });

  const significant = sigData?.getSignificant;
  const civilisationsRaw = civData?.getCivilisation ?? [];
  const populationValue = data?.getPopulation ?? null;

  const imageSrc = significant?.cdnId
    ? `https://cdn.tldrhistory.xyz/${significant.cdnId}`
    : (significant?.imageUrl ?? null);

  const animatedPopulation = useCountAnimation(populationValue ?? 0);

  const formattedPopulation = useTransform(animatedPopulation, (v) =>
    formatPopulation(Math.round(v)),
  );

  const civilisations = useMemo(() => {
    return Array.from(
      new Map(civilisationsRaw.map((c) => [cleanName(c.name), c])).values(),
    );
  }, [civilisationsRaw]);

  return (
    <StatsContainer timeline>
      <StatBlock
        title="Population"
        description={label}
        figure={<Icon className="w-8 md:w-10 lg:w-16 h-auto text-gold/95" />}
      >
        {isLoading || populationValue == null ? (
          <span className="loading loading-spinner loading-lg m-auto"></span>
        ) : (
          <motion.div className="truncate">{formattedPopulation}</motion.div>
        )}
      </StatBlock>

      {/* Significant Figure */}
      <div className="h-full border-dashed border-r border-stone-700/60 sm:border-r-0 sm:border-b grid">
        <div className="sm:stat [overflow-y:hidden] h-20 sm:h-auto p-3 xs:px-5 sm:px-4 lg:px-6 space-y-1 place-content-start sm:place-content-evenly">
          <div className="stat-figure text-gold/95 hidden lg:block">
            {imageSrc ? (
              <div className="avatar">
                <div className="w-8 md:w-10 lg:w-16 hidden lg:block">
                  <motion.img
                    key={imageSrc}
                    src={imageSrc}
                    alt={significant?.name ?? "Significant figure"}
                    className="absolute w-full h-full object-cover rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 md:w-10 lg:w-16 hidden lg:block stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4S8 5.79 8 8s1.79 4 4 4zm0 2c-3.866 0-7 1.567-7 3.5V19h14v-1.5c0-1.933-3.134-3.5-7-3.5z"
                />
              </svg>
            )}
          </div>
          <div className="stat-title truncate self-end text-stone-400 md:text-base">
            Most Significant
          </div>
          <div className="text-gold/95 font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  sigLoading
                    ? "loading"
                    : sigError
                      ? "—"
                      : (significant?.id ?? "empty")
                }
                className="line-clamp-2 text-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => {
                  const tooltip = e.currentTarget
                    .nextElementSibling as HTMLDivElement | null;
                  if (tooltip) {
                    tooltip.style.opacity =
                      tooltip.style.opacity === "1" ? "0" : "1";
                  }
                }}
              >
                {sigLoading ? (
                  <span className="loading loading-spinner loading-lg justify-center m-auto"></span>
                ) : sigError ? (
                  "—"
                ) : significant?.name ? (
                  cleanName(significant.name)
                ) : (
                  "—"
                )}
              </motion.div>
            </AnimatePresence>

            {significant?.name && (
              <div className="absolute w-max max-w-xs bg-base-200 text-base-content text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                {cleanName(significant.name)}
              </div>
            )}
          </div>
          <div className="stat-desc truncate self-start text-stone-400 md:text-base">
            Highly influential event
          </div>
        </div>
      </div>

      {/* Civilisations */}
      <div className="flex justify-center items-center">
        {civLoading ? (
          <span className="loading loading-spinner loading-lg justify-center m-auto text-gold/80"></span>
        ) : (
          <div className="size-fit">
            <WorldMap
              civilisations={civilisations}
              onClick={() => setMapOpen(true)}
              isInteractive={false}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {mapOpen && (
          <Suspense>
            <MapModal
              open={mapOpen}
              onClose={() => setMapOpen(false)}
              civilisations={civilisations}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </StatsContainer>
  );
}
