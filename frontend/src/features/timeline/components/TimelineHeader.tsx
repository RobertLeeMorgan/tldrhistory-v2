import { useEra } from "../../../context/EraContext";
import { formatYear } from "../../../utils/formatYear";
import type { TimelineFilter } from "../../../features/filter/components/TimelineFilter";
import { themes } from "../../../utils/drawerValues";
import { motion, AnimatePresence } from "framer-motion";
import { TextSwap, useCountAnimation } from "../../../hooks/useCountUp";
import HeaderContainer from "../../../components/ui/HeaderContainer";
import { VIEW_OPTIONS } from "../../../utils/rangeViews";

export default function TimelineHeader({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, headline, view, setView } = useEra();

  const groupMeta =
    filter.group > 0
      ? themes.options.find((opt) => opt.value === filter.group)
      : null;

  const filterYearsReal =
    filter.yearStart !== -300000 && filter.yearEnd !== 2025;

  const groupHasFallback = !!groupMeta?.fallbackYears;

  let years: [number, number] | null = null;

  if (filterYearsReal) {
    years = [filter.yearStart!, filter.yearEnd!];
  } else if (groupHasFallback) {
    years = groupMeta!.fallbackYears as [number, number];
  } else {
    years = [startYear, endYear];
  }

  const sortedYears = [...years].sort((a, b) =>
    filter.sortBy ? a - b : b - a,
  );

  const firstYear = sortedYears?.[0] ?? 0;
  const secondYear = sortedYears?.[1] ?? 0;

  const subheadline = headline || groupMeta?.fallbackHeadline;

  return (
    <HeaderContainer>
      <div className="relative z-10 h-full flex flex-col justify-center text-center">
        {sortedYears && (
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
  <div className="flex items-baseline justify-center min-w-[10rem]">
    <div className="flex items-baseline gap-2 tabular-nums">
      <div className="flex items-baseline gap-1 min-w-[5.8rem] justify-end">
        <motion.span className="text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-stone-200/90 [font-variant-numeric:tabular-nums]">
          {useCountAnimation(Math.abs(firstYear))}
        </motion.span>
        <span className="text-xs sm:text-sm md:text-md text-stone-300/70">
          {formatYear(firstYear)}
        </span>
      </div>

      <span className="text-xs sm:text-sm md:text-lg text-stone-300/70">
        to
      </span>

      <div className="flex items-baseline gap-1 min-w-[5rem] justify-start">
        <motion.span className="text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-stone-200/90 [font-variant-numeric:tabular-nums]">
          {useCountAnimation(Math.abs(secondYear))}
        </motion.span>
        <span className="text-xs sm:text-sm md:text-md text-stone-300/70">
          {formatYear(secondYear)}
        </span>
      </div>
    </div>
  </div>

  <select
    id="timeline-view"
    value={view}
    onChange={(e) => setView(e.target.value as typeof view)}
    className="select select-ghost select-sm w-32 shrink-0 text-xs sm:text-sm md:text-base text-stone-300 border border-stone-500/20 hover:bg-stone-900 rounded"
  >
    {VIEW_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
        )}

        <h1 className="font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide uppercase text-stone-100 text-shadow-lg">
          {groupMeta?.labelText ?? (
            <TextSwap text={label} className="align-middle" />
          )}
        </h1>

        <AnimatePresence mode="wait" initial={false}>
          {subheadline && (
            <motion.h3
              key={subheadline}
              className="font-serif text-xs sm:text-md md:text-lg tracking-tight uppercase text-stone-200/90 mt-1 truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              — {subheadline} —
            </motion.h3>
          )}
        </AnimatePresence>
      </div>
    </HeaderContainer>
  );
}
