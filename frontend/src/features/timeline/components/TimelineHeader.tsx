import { useEra } from "../../../context/EraContext";
import { formatYear } from "../../../utils/formatYear";
import type { TimelineFilter } from "../../../features/filter/components/TimelineFilter";
import { themes } from "../../../utils/drawerValues";
import { motion } from "framer-motion";
import { TextSwap, useCountAnimation } from "../../../hooks/useCountUp";
import { useMemo } from "react";
import HeaderContainer from "../../../components/ui/HeaderContainer";

export default function TimelineHeader({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, headline } = useEra();

  const years =
    filter.yearStart != null && filter.yearEnd != null
      ? [filter.yearStart, filter.yearEnd]
      : [startYear, endYear + 1];

  const sortedYears = useMemo(
    () => [...years].sort((a, b) => (filter.sortBy ? a - b : b - a)),
    [filter.sortBy, years],
  );

  const firstYear = sortedYears[0] ?? 0;
  const secondYear = sortedYears[1] ?? 0;

  const animatedFirstYear = useCountAnimation(Math.abs(firstYear));
  const animatedSecondYear = useCountAnimation(Math.abs(secondYear));

  return (
    <HeaderContainer timeline>
      <div className="relative z-10 h-full flex flex-col justify-center py-5 sm:py-3 text-center">
        <div className="flex gap-2 justify-center items-baseline">
          <div className="flex items-baseline gap-1">
            <motion.span className="text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-stone-200/90">
              {animatedFirstYear}
            </motion.span>
            <span className="text-xs sm:text-sm md:text-md text-stone-300/70">
              {formatYear(firstYear)}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm md:text-lg text-stone-300/70">
              to
            </span>
            <motion.span className="text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-stone-200/90">
              {animatedSecondYear}
            </motion.span>
            <span className="text-xs sm:text-sm md:text-md text-stone-300/70">
              {formatYear(secondYear)}
            </span>
          </div>
        </div>

        <h2 className="font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide leading-tight uppercase truncate text-stone-100 text-shadow-lg">
          {filter.subject.length ? (
            filter.subject.join(", ")
          ) : (
            <TextSwap text={label} />
          )}
        </h2>

        {headline && (
          <h3 className="font-serif text-xs sm:text-md md:text-lg tracking-tight uppercase text-stone-200/90 mt-1 truncate">
            —{" "}
            {filter.group > 0
              ? themes.options.find((opt) => opt.value === filter.group)
                  ?.labelText
              : filter.continent.length
                ? filter.continent.join(", ")
                : headline}{" "}
            —
          </h3>
        )}
      </div>
    </HeaderContainer>
  );
}
