import type { CSSProperties, ReactNode } from "react";
import { useEra } from "../../../context/EraContext";
import { RANGE_SETS } from "../../../utils/rangeViews";
import { formatYear } from "../../../utils/formatYear";

function yearLabel(year: number) {
  return Math.abs(year).toLocaleString() + " " + formatYear(year);
}

function visibilityForDistance(distance: number) {
  if (distance === 1) return "hidden md:block";
  if (distance === 2) return "hidden xl:block";
  if (distance === 3) return "hidden 2xl:block";
  return "hidden";
}

function neighborTransform(offset: number) {
  const additionalDistance = (Math.abs(offset) - 1) * 10;
  return offset < 0
    ? `translateX(calc(-50% - var(--era-center-width) / 2 - 4.5rem - ${additionalDistance}rem))`
    : `translateX(calc(-50% + var(--era-center-width) / 2 + 4.5rem + ${additionalDistance}rem))`;
}

export default function EraStrip({
  activeContent,
  className = "",
}: {
  activeContent: ReactNode;
  className?: string;
}) {
  const { view, eraIndex } = useEra();
  const ranges = RANGE_SETS[view];

  return (
    <div
      aria-label="Historical eras, shown as equal-width periods rather than to scale"
      className={`relative isolate h-full min-w-0 overflow-hidden [--era-center-width:clamp(14rem,34vw,30rem)] ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-x-4 bottom-[2.7rem] h-px bg-gradient-to-r from-transparent via-divider to-transparent sm:inset-x-8" />

      {ranges.map((range, index) => {
        const offset = index - eraIndex;
        if (offset === 0) return null;
        const distance = Math.abs(offset);
        const style = { transform: neighborTransform(offset) } as CSSProperties;

        return (
          <div
            key={range.label}
            data-era-index={index}
            data-era-neighbor={offset < 0 ? "previous" : "next"}
            style={style}
            className={`absolute bottom-[0.65rem] left-1/2 w-36 text-center transition-[transform,opacity] duration-300 ease-out ${visibilityForDistance(distance)}`}
          >
            <span aria-hidden="true" className="absolute left-1/2 top-[-0.42rem] size-2 -translate-x-1/2 rounded-full border border-control bg-canvas" />
            <span className="mx-auto block w-fit max-w-full truncate bg-canvas/95 px-2 text-xs font-semibold text-content-muted">
              {range.label}
            </span>
            <span className="mt-0.5 block text-[0.62rem] leading-none text-content-muted/75">
              {yearLabel(range.start)} – {yearLabel(range.end)}
            </span>
          </div>
        );
      })}

      <div
        aria-current="step"
        data-era-index={eraIndex}
        data-era-active-slot
        className="absolute inset-y-0 left-1/2 z-10 w-[var(--era-center-width)] -translate-x-1/2 text-center"
      >
        {activeContent}
      </div>
    </div>
  );
}
