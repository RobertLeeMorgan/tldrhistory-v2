import type { CSSProperties, ReactNode } from "react";
import { useEra } from "../../../context/EraContext";
import { RANGE_SETS } from "../../../utils/rangeViews";
import { formatYear } from "../../../utils/formatYear";

function yearLabel(year: number) {
  return Math.abs(year).toLocaleString() + " " + formatYear(year);
}

function visibilityForDistance(distance: number) {
  if (distance === 1) return "opacity-0 md:opacity-70 md:hover:opacity-90";
  if (distance === 2) return "opacity-0 xl:opacity-60 xl:hover:opacity-80";
  if (distance === 3) return "opacity-0 2xl:opacity-50 2xl:hover:opacity-70";
  return "opacity-0";
}

function eraTransform(offset: number) {
  if (offset === 0) return "translateX(-50%)";
  const additionalDistance = (Math.abs(offset) - 1) * 10;
  return offset < 0
    ? `translateX(calc(-50% - var(--era-center-width) / 2 - 6rem - ${additionalDistance}rem))`
    : `translateX(calc(-50% + var(--era-center-width) / 2 + 6rem + ${additionalDistance}rem))`;
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
      className={`relative isolate h-full min-w-0 overflow-hidden items-center [--era-center-width:clamp(14rem,30vw,30rem)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-4 top-1.5 h-px bg-divider [mask-image:linear-gradient(to_right,transparent,black_25%)] sm:left-8"
        style={{ right: "calc(50% + var(--era-center-width) / 2 + 0.75rem)" }}
      />
      <span
        aria-hidden="true"
        className="absolute right-4 top-1.5 h-px bg-divider [mask-image:linear-gradient(to_left,transparent,black_25%)] sm:right-8"
        style={{ left: "calc(50% + var(--era-center-width) / 2 + 0.75rem)" }}
      />
      <div
  className="pointer-events-none absolute inset-0"
  style={{
    maskImage: `linear-gradient(
      to right,
      black 0%,
      black calc(50% - var(--era-center-width) / 2 - 0.75rem),
      transparent calc(50% - var(--era-center-width) / 2),
      transparent calc(50% + var(--era-center-width) / 2),
      black calc(50% + var(--era-center-width) / 2 + 0.75rem),
      black 100%
    )`
  }}>
      {ranges.map((range, index) => {
        const offset = index - eraIndex;
        const active = offset === 0;
        const style = { transform: eraTransform(offset) } as CSSProperties;

        return (
          <div
            key={range.label}
            aria-hidden={active || undefined}
            data-era-index={active ? undefined : index}
            data-era-track-index={index}
            data-era-neighbor={active ? undefined : offset < 0 ? "previous" : "next"}
            style={style}
            className={`absolute left-1/2 top-0 w-36 text-center transition-[transform,opacity] duration-300 ease-out ${active ? "opacity-0" : visibilityForDistance(Math.abs(offset))}`}
          >
            <span aria-hidden="true" className="absolute left-1/2 top-[0.48rem] size-2 -translate-x-1/2 rounded-full border border-control bg-canvas transition-colors duration-300" />
            <span className="mt-[1.05rem] block truncate text-xs font-semibold text-content-muted">
              {range.label}
            </span>
            <span className="mt-0.5 block text-[0.62rem] leading-none text-content-muted/75">
              {yearLabel(range.start)} – {yearLabel(range.end)}
            </span>
          </div>
        );
      })}
    </div>
      <div
        aria-current="step"
        data-era-active-slot
        data-era-index={eraIndex}
        className="absolute left-1/2 top-0 z-10 w-[var(--era-center-width)] -translate-x-1/2 text-center"
      >
        {activeContent}
      </div>
    </div>
  );
}
