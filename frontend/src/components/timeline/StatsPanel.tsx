import { useEra } from "../../context/EraContext";
import {
  useCivilisationQuery,
  usePopulationQuery,
  useSignificantQuery,
} from "../../hooks/useStats";
import { formatPopulation } from "../../utils/formatPopulation";
import { cleanName } from "../../utils/cleanName";
import type { TimelineFilter } from "../drawer/drawerTypes";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { useCountAnimation } from "../../hooks/useCountUp";
import { lazy, Suspense, useMemo, useState } from "react";
import WorldMap from "../map/WorldMap";

const Modal = lazy(() => import("../modal/Modal"));

export default function StatsPanel({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, Icon } = useEra();
  const [mapOpen, setMapOpen] = useState(false);

  const { data, isLoading } = usePopulationQuery({ start: startYear });

  const {
    data: sigData,
    isLoading: sigLoading,
    isError: sigError,
  } = useSignificantQuery({ start: startYear, end: endYear, filter: filter });

  const { data: civData, isLoading: civLoading } = useCivilisationQuery({
    start: startYear,
    end: endYear,
    filter: filter,
  });

  const significant = sigData?.getSignificant;
  const civilisationsRaw = civData?.getCivilisation ?? [];
  const populationValue = data?.getPopulation ?? null;

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
    <div className="grid grid-cols-[29%_auto_33%] sm:grid-rows-[28%_32%_40%] rounded-none sm:border-l border-neutral-700 sm:grid-cols-1 stats sm:stats-vertical w-full h-full shadow-lg shadow-black/20 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 sm:static sm:bottom-auto py-1 sm:py-0">
      {/* Population */}
      <div className="stat lg:gap-2 space-y-1 p-3 xs:px-5 sm:px-4 lg:px-6 items-center ">
        <div className="stat-figure hidden sm:block">
          <Icon className="w-8 md:w-10 lg:w-16 h-auto text-primary" />
        </div>

        <div className="stat-title text-neutral-400 truncate self-end md:text-base lg:text-lg">
          Population
        </div>

        <div className="text-primary truncate text-nowrap font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl">
          {isLoading || populationValue == null ? (
            <span className="loading loading-spinner loading-lg justify-center m-auto"></span>
          ) : (
            <motion.div className="truncate">{formattedPopulation}</motion.div>
          )}
        </div>
        <div className="stat-desc truncate self-start text-neutral-400 md:text-base lg:text-lg">
          {label}
        </div>
      </div>

      {/* Significant Figure */}
      <div className="stat lg:gap-2 p-3 xs:px-5 sm:px-4 lg:px-6 space-y-1 items-center ">
        <div className="stat-figure text-secondary hidden lg:block">
          {significant?.imageUrl ? (
            <div className="avatar">
              <div className="w-8 md:w-10 lg:w-16 hidden lg:block">
                <motion.img
                  key={significant.imageUrl}
                  src={significant.imageUrl}
                  alt={significant.name}
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
        <div className="stat-title truncate self-end text-neutral-400 md:text-base lg:text-lg">
          Most Significant
        </div>
        <div className="text-secondary truncate text-nowrap font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                sigLoading
                  ? "loading"
                  : sigError
                    ? "error"
                    : (significant?.id ?? "empty")
              }
              className="truncate sm:text-wrap"
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
                "Error"
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
        <div className="stat-desc truncate self-start text-neutral-400 md:text-base lg:text-lg">
          Highly influential event
        </div>
      </div>
      {/* Civilisations */}
      <div className="justify-center flex items-center py-2 sm:p-0">
        {civLoading ? (
          <span className="loading loading-spinner loading-lg justify-center m-auto text-accent"></span>
        ) : (
          <div className="w-full max-w-md aspect-[16/9]">
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
          <Suspense fallback={null}>
            <Modal open={mapOpen} onClose={() => setMapOpen(false)}>
              <div className="w-[90vw] max-w-6xl aspect-[16/9]">
                <WorldMap civilisations={civilisations} isInteractive={true}/>
              </div>
            </Modal>
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
