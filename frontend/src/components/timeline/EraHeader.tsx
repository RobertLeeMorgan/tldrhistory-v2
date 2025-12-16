import { useEra } from "../../context/EraContext";
import { formatYear } from "../../utils/formatYear";
import bg from "../../assets/bg-home.webp";
import { splitHeadline } from "../../utils/splitHeadline";
import { useHeadlineQuery } from "../../hooks/useQueries";
import type { TimelineFilter } from "../drawer/drawerTypes";
import { themes } from "../../utils/drawerValues";
import { motion } from "framer-motion";
import { TextSwap, useCountAnimation } from "../../hooks/useCountUp";
import { useMemo } from "react";

export default function EraHeader({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label } = useEra();

  const { data: headlineData } = useHeadlineQuery({ startYear, endYear });
  const headline = headlineData?.getHeadline ?? label;

  const { title, subtitle } = splitHeadline(headline);

  const years =
    filter.yearStart && filter.yearEnd
      ? [filter.yearStart, filter.yearEnd]
      : [startYear, endYear + 1];

  const sortedYears = useMemo(() => {
    return [...years].sort((a, b) => (filter.sortBy ? a - b : b - a));
  }, [years, filter.sortBy]);

  const animatedYears = sortedYears.map((y) => useCountAnimation(Math.abs(y)));

  return (
    <header className="hero sticky top-0 z-40 shadow-lg">
      <h1 className="sr-only">Interactive Human History Timeline</h1>

      <img
        src={bg}
        alt="Era background"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        loading="eager"
      />
      <div className="hero-overlay opacity-80"></div>

      <div className="hero-content justify-start sm:justify-center text-neutral-content text-left w-full">
        <div className="grid grid-cols-1 sm:grid-cols-[60px_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)] gap-1 sm:gap-2 md:gap-4 lg:gap-6 items-center sm:pl-6 px-2">
          {/* LEFT: Years */}
          <div className="flex sm:flex-col items-end whitespace-nowrap">
            {sortedYears.map((y, i) => (
              <div key={i} className="flex items-baseline gap-1 mt-2 md:mt-0">
                {i === 1 && (
                  <span className="pl-1 sm:pl-0 text-xs sm:text-sm md:text-lg lg:text-xl opacity-70 leading-none tracking-tight">
                    to
                  </span>
                )}

                <motion.div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-none tracking-tight">
                  {animatedYears[i]}
                </motion.div>

                <span className="text-xs sm:text-sm md:text-md opacity-70 tracking-tight">
                  {formatYear(y)}
                </span>
              </div>
            ))}
          </div>

          {/* CENTER: Title / Subtitle */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-0 sm:gap-1 md:gap-2 lg:gap-4">
              <div className="hidden sm:block w-[1px] bg-gray-200 opacity-50 h-20" />

              <div className="flex items-start gap-y-3 min-w-0">
                <div className="w-full px-0 sm:pl-2 sm:w-[510px] md:w-[540px] lg:w-[680px]">
                  <h2 className="text-sm font-semibold sm:font-bold uppercase truncate overflow-hidden tracking-tight text-abmer-800">
                    {filter.type.length ? filter.type.join(", ") : label}
                  </h2>
                  <h3 className="font-serif text-lg sm:text-2xl md:text-2xl lg:text-3xl font-extrabold overflow-hidden truncate leading-tight pb-1 sm:pb-0 tracking-tight uppercase">
                    {filter.subject.length ? filter.subject.join(", ") : <TextSwap text={title} />}
                  </h3>
                  {subtitle && (
                    <h4 className="font-serif ml-1 text-xs sm:text-md md:text-lg text-base overflow-hidden truncate tracking-tight uppercase opacity-80">
                      —{" "}
                      {filter.group > 0
                        ? themes.options.find((opt) => opt.value === filter.group)?.labelText
                        : filter.continent.length
                        ? filter.continent.join(", ")
                        : <TextSwap text={subtitle} />}
                      —
                    </h4>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
