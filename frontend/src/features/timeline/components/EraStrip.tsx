import { useEffect, useRef } from "react";
import { useEra } from "../../../context/EraContext";
import { RANGE_SETS } from "../../../utils/rangeViews";
import { formatYear } from "../../../utils/formatYear";

function yearLabel(year: number) {
  return Math.abs(year).toLocaleString() + " " + formatYear(year);
}

export default function EraStrip() {
  const { view, eraIndex } = useEra();
  const ranges = RANGE_SETS[view];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = activeRef.current;
    if (!scroller || !active) return;
    const target = active.offsetLeft - (scroller.clientWidth - active.clientWidth) / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [eraIndex, view]);

  return (
    <div className="border-t border-divider/70">
      <div
        ref={scrollerRef}
        tabIndex={0}
        aria-label="Historical eras, shown as equal-width periods rather than to scale"
        className="overflow-x-auto overscroll-x-contain [scrollbar-color:var(--color-divider)_transparent]"
      >
        <div className="mx-auto flex min-w-max px-4 sm:px-6 lg:max-w-[1500px] lg:px-8">
          {ranges.map((range, index) => {
            const active = index === eraIndex;
            return (
              <div
                key={range.label}
                ref={active ? activeRef : undefined}
                aria-current={active ? "step" : undefined}
                className="relative min-w-44 flex-1 px-4 pb-3 pt-4 text-center"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-2 h-px ${active ? "bg-accent" : "bg-divider"}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-[0.32rem] size-2 -translate-x-1/2 rounded-full border ${active ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(214,173,104,.16)]" : "border-control bg-canvas"}`}
                />
                <span className={`block truncate text-xs font-semibold ${active ? "text-accent" : "text-content-muted"}`}>
                  {range.label}
                </span>
                <span className="mt-1 block text-[0.68rem] text-content-muted/75">
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
