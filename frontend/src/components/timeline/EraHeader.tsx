import { useEra } from "../../context/EraContext";
import { formatYear } from "../../utils/formatYear";
import bg from "../../assets/bg-home.webp";
import { splitHeadline } from "../../utils/splitHeadline";
// import { useHeadlineQuery } from "../../hooks/useQueries";
import type { TimelineFilter } from "../drawer/drawerTypes";
import { themes } from "../../utils/drawerValues";
import { motion } from "framer-motion";
import { TextSwap, useCountAnimation } from "../../hooks/useCountUp";
import { useMemo } from "react";

export default function EraHeader({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, headline } = useEra();

  // const { data: headlineData } = useHeadlineQuery({ startYear, endYear });
  // const headline = headlineData?.getHeadline ?? label;

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
    <header className="sticky top-0 z-40 shadow-lg border-b border-zinc-800 backdrop-blur-sm h-30 xs:h-32 sm:h-26 md:h-28 lg:h-30 shadow-lg shadow-black/30">
      <h1 className="sr-only">Interactive Human History Timeline</h1>

      <img
        src={bg}
        alt="Era background"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        loading="eager"
      />
      <div className="absolute inset-0 bg-neutral-950/30"></div>

      <div className="hero-content justify-start py-3 md:py-4 opacity-90 text-start pl-6 mx-auto">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 md:gap-4 lg:gap-6 items-center">
          {/* LEFT: Years */}
          <div className="self-start sm:self-center items-end justify-items-start sm:justify-items-end whitespace-nowrap flex sm:block w-[16vw]">
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

              <div className="flex items-start gap-y-3">
                <div className="w-full px-0 sm:pl-2 min-w-0 truncate max-w-[90vw] md:max-w-[70vw]">
                  <h2 className="text-sm font-semibold sm:font-bold uppercase truncate overflow-hidden tracking-wide text-abmer-800">
                    {filter.type.length ? filter.type.join(", ") : label}
                  </h2>
                  <h3 className="font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold overflow-hidden truncate leading-tight pb-1 sm:pb-0 uppercase ">
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
