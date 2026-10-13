import { useEffect, useRef } from "react";
import { useEra } from "../../../context/EraContext";
import { RANGE_SETS } from "../../../utils/rangeViews";
import { formatYear } from "../../../utils/formatYear";

function yearLabel(year: number) {
  return Math.abs(year).toLocaleString() + " " + formatYear(year);
}

export default function EraStrip({ className = "" }: { className?: string }) {
  const { view, eraIndex } = useEra();
  const ranges = RANGE_SETS[view];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef(0);

  useEffect(() => {
    window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      const active = activeRef.current;
      if (!scroller || !active) return;

      const target = active.offsetLeft - (scroller.clientWidth - active.clientWidth) / 2;
      const boundedTarget = Math.max(0, Math.min(target, scroller.scrollWidth - scroller.clientWidth));
      if (Math.abs(scroller.scrollLeft - boundedTarget) < 1) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scroller.scrollTo({ left: boundedTarget, behavior: reduced ? "auto" : "smooth" });
    });

    return () => window.cancelAnimationFrame(scrollFrameRef.current);
  }, [eraIndex, view]);

  return (
    <div className={`min-w-0 ${className}`}>
      <div
        ref={scrollerRef}
        tabIndex={0}
        aria-label="Historical eras, shown as equal-width periods rather than to scale"
        className="scrollbar-hidden h-full overflow-x-auto overscroll-x-contain"
      >
        <div className="flex h-full min-w-max px-2 sm:px-4">
          {ranges.map((range, index) => {
            const active = index === eraIndex;
            return (
              <div
                key={range.label}
                ref={active ? activeRef : undefined}
                aria-current={active ? "step" : undefined}
                data-era-index={index}
                className={`relative min-w-36 flex-1 px-3 pb-1 pt-3 text-center transition-opacity duration-300 ease-out sm:min-w-40 sm:px-4 ${active ? "opacity-100" : "opacity-70 hover:opacity-90"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-1.5 h-px transition-colors duration-300 ease-out ${active ? "bg-accent" : "bg-divider"}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-[0.18rem] size-2 -translate-x-1/2 rounded-full border transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out ${active ? "scale-110 border-accent bg-accent shadow-[0_0_0_4px_rgba(214,173,104,.16)]" : "scale-90 border-control bg-canvas shadow-none"}`}
                />
                <span className={`block truncate text-xs font-semibold transition-colors duration-300 ${active ? "text-accent" : "text-content-muted"}`}>
                  {range.label}
                </span>
                <span className="mt-0.5 block text-[0.62rem] leading-none text-content-muted/75">
                  {yearLabel(range.start)} – {yearLabel(range.end)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
