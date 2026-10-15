import { useEffect, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuGlobe } from "react-icons/lu";
import { useEra } from "../../../context/EraContext";
import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import { themes } from "../../../utils/drawerValues";
import { VIEW_OPTIONS, type EraView } from "../../../utils/rangeViews";
import { ContextSwap, TextSwap } from "../../../components/ui/AnimatedValue";
import AnimatedYear from "../../../components/ui/AnimatedYear";
import EraStrip from "./EraStrip";

function EraPerspectiveMenu({ view, setView }: { view: EraView; setView: (view: EraView) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = VIEW_OPTIONS.findIndex((option) => option.value === view);
  const selected = VIEW_OPTIONS[selectedIndex] ?? VIEW_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const focusFrame = window.requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus());
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, selectedIndex]);

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = optionRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? VIEW_OPTIONS.length - 1
        : (current + (event.key === "ArrowDown" ? 1 : -1) + VIEW_OPTIONS.length) % VIEW_OPTIONS.length;
    optionRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className="relative h-8 w-10 sm:h-11 sm:w-12 shrink-0 rounded-xl border border-divider bg-surface/95 shadow-lg shadow-black/20 md:w-44">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="era-perspective-menu"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Era perspective: ${selected.label}`}
        className={`flex h-full w-full items-center justify-center gap-1 rounded-xl px-1.5 text-left transition-colors hover:bg-surface-raised focus-visible:outline-offset-[-3px] md:justify-start md:gap-2 md:px-4 ${open ? "bg-surface-raised text-content" : "text-content-muted"}`}
      >
        <LuGlobe aria-hidden="true" className="size-4 shrink-0 text-accent" />
        <span className="hidden min-w-0 flex-1 md:block">
          <span className="block text-[0.58rem] font-bold uppercase tracking-[0.12em] text-content-muted">Perspective</span>
          <span className="block truncate text-xs font-semibold text-content">{selected.label}</span>
        </span>
        <LuChevronDown aria-hidden="true" className={`size-3 shrink-0 transition-transform duration-200 md:size-4 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id="era-perspective-menu"
          role="menu"
          aria-label="Era perspective"
          onKeyDown={moveFocus}
          className="absolute right-0 top-[calc(100%+.5rem)] z-50 max-h-[min(24rem,60dvh)] w-[min(17rem,calc(100vw-1rem))] overflow-y-auto rounded-xl border border-divider bg-surface-raised p-2 shadow-2xl shadow-black/50"
        >
          {VIEW_OPTIONS.map((option, index) => {
            const active = option.value === view;
            return (
              <button
                key={option.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => {
                  setView(option.value);
                  setOpen(false);
                }}
                className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm transition-colors ${active ? "bg-accent/15 font-semibold text-accent" : "text-content-muted hover:bg-canvas/55 hover:text-content"}`}
              >
                {option.label}
                {active && <LuCheck aria-hidden="true" className="size-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TimelineHeader({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, headline, view, setView } = useEra();
  const groupMeta = filter.group > 0
    ? themes.options.find((option) => option.value === filter.group)
    : null;
  const hasExplicitRange = filter.yearStart !== -300000 && filter.yearEnd !== 2025;
  const years: [number, number] = hasExplicitRange
    ? [filter.yearStart ?? startYear, filter.yearEnd ?? endYear]
    : groupMeta?.fallbackYears
      ? ([...groupMeta.fallbackYears] as [number, number])
      : [startYear, endYear];
  const orderedYears = [...years].sort((a, b) => (filter.sortBy ? a - b : b - a));
  const title = groupMeta?.labelText ?? label;
  const subheadline = headline || groupMeta?.fallbackHeadline;

  return (
    <header
      id="timeline-context-header"
      className="fixed inset-x-0 top-[var(--nav-height)] z-40 h-[var(--timeline-header-height)] border-b border-divider bg-canvas/97 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 [background:radial-gradient(circle_at_72%_20%,rgba(214,173,104,.14),transparent_33%),linear-gradient(90deg,rgba(16,23,25,1),rgba(24,33,36,.72))]" />
      <div className="relative mx-auto h-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col items-center justify-center">
          <div data-era-title-block className="flex flex-col items-center text-center px-14 sm:px-20 md:px-48">
            <p className="atlas-eyebrow leading-none">Current era</p>
            <h1 className="max-w-full truncate font-serif text-[clamp(.9rem,4.5vw,1.35rem)] font-semibold leading-tight text-content sm:text-[clamp(1.05rem,3vw,1.55rem)] md:text-[clamp(1.1rem,2.25vw,2rem)] pb-1">
              {groupMeta ? title : <TextSwap text={title} className="block max-w-full truncate" />}
            </h1>
          </div>

          <div className="relative h-[2.8rem] sm:h-[3.3rem] lg:h-[2.8rem] w-full shrink-0 self-center">
            <EraStrip
              activeContent={(
                <>
                  <p data-era-active-subtitle className="mx-auto min-h-6 max-w-full px-1 text-[0.65rem] font-medium leading-tight text-content-muted sm:text-[0.68rem] pb-2 lg:pb-0">
                    {subheadline ? <ContextSwap transitionKey={subheadline}>{subheadline}</ContextSwap> : <span aria-hidden="true">&nbsp;</span>}
                  </p>
                  <p className="whitespace-nowrap text-[0.62rem] font-semibold text-accent sm:text-[0.68rem] md:text-xs">
                    <AnimatedYear year={orderedYears[0] ?? 0} />
                    <span className="mx-1.5 text-content-muted">–</span>
                    <AnimatedYear year={orderedYears[1] ?? 0} />
                  </p>
                </>
              )}
            />
          </div>
        </div>

        <div className="absolute right-4 bottom-2 sm:top-2 z-20 sm:right-6 lg:right-8">
          <EraPerspectiveMenu view={view} setView={setView} />
        </div>
      </div>
    </header>
  );
}
