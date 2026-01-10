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
import { useMemo } from "react";
import WorldMap from "../map/WorldMap";

export default function StatsPanel({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, Icon } = useEra();

  const { data, isLoading } = usePopulationQuery({ start: startYear });

  const {
    data: sigData,
    isLoading: sigLoading,
    isError: sigError,
  } = useSignificantQuery({ start: startYear, end: endYear, filter: filter });

  const { data: civData } = useCivilisationQuery({
    start: startYear,
    end: endYear,
    filter: filter,
  });

  const significant = sigData?.getSignificant;
  const civilisationsRaw = civData?.getCivilisation ?? [];
  const populationValue = data?.getPopulation ?? null;

  const animatedPopulation = useCountAnimation(populationValue ?? 0);

  const formattedPopulation = useTransform(animatedPopulation, (v) =>
    formatPopulation(Math.round(v))
  );

  const civilisations = useMemo(() => {
    return Array.from(
      new Map(civilisationsRaw.map((c) => [cleanName(c.name), c])).values()
    );
  }, [civilisationsRaw]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-1 stats sm:stats-vertical w-full shadow bg-base-200 rounded-lg border border-base-300 p-0 sm:p-1 md:p-2 lg:p-3 absolute bottom-0 sm:static sm:bottom-auto">
      {/* Population */}
      <div className="stat p-3 sm:gap-2">
        <div className="stat-figure hidden xs:block">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        <div className="stat-title truncate">Population</div>

        <div className="text-primary truncate text-nowrap font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl">
          {isLoading || populationValue == null ? (
            <span className="loading loading-spinner loading-md justify-center m-auto"></span>
          ) : (
            <motion.div className="truncate">{formattedPopulation}</motion.div>
          )}
        </div>
        <div className="stat-desc truncate">{label}</div>
      </div>

      {/* Significant Figure */}
      <div className="stat p-3 sm:gap-2">
        <div className="stat-figure text-secondary hidden xs:block">
          {sigLoading ? (
            <span className="loading loading-spinner loading-md justify-center m-auto"></span>
          ) : significant?.imageUrl ? (
            <div className="avatar">
              <div className="w-8 md:w-12 lg:w-16 ">
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
              className="h-8 w-8 stroke-current"
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
        <div className="stat-title truncate">Most Significant</div>
        <div className="text-secondary truncate text-nowrap font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                sigLoading
                  ? "loading"
                  : sigError
                  ? "error"
                  : significant?.id ?? "empty"
              }
              className="truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {sigLoading ? (
                <span className="loading loading-spinner loading-md justify-center m-auto"></span>
              ) : sigError ? (
                "Error"
              ) : significant?.name ? (
                cleanName(significant.name)
              ) : (
                "—"
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="stat-desc truncate">Highly influential event</div>
      </div>
      {/* Civilisations */}
      <div className="stat p-3 px-0 sm:gap-2 max-h-48">
        <WorldMap civilisations={civilisations} />
      </div>
    </div>
  );
}
