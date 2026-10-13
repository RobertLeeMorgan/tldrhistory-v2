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
    <div ref={rootRef} className="relative h-full w-12 shrink-0 border-l border-divider/70 sm:w-44 md:border-r">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="era-perspective-menu"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Era perspective: ${selected.label}`}
        className={`flex h-full w-full items-center justify-center gap-1 px-1.5 text-left transition-colors hover:bg-surface-raised focus-visible:outline-offset-[-3px] sm:justify-start sm:gap-2 sm:px-4 ${open ? "bg-surface-raised text-content" : "bg-surface/85 text-content-muted"}`}
      >
        <LuGlobe aria-hidden="true" className="size-4 shrink-0 text-accent" />
        <span className="hidden min-w-0 flex-1 sm:block">
          <span className="hidden text-[0.58rem] font-bold uppercase tracking-[0.12em] text-content-muted sm:block">Perspective</span>
          <span className="block truncate text-xs font-semibold text-content">{selected.label}</span>
        </span>
        <LuChevronDown aria-hidden="true" className={`size-3 shrink-0 transition-transform duration-200 sm:size-4 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id="era-perspective-menu"
          role="menu"
          aria-label="Era perspective"
          onKeyDown={moveFocus}
          className="absolute right-0 top-[calc(100%+.5rem)] z-50 max-h-[min(24rem,60dvh)] w-[min(17rem,calc(100vw-1rem))] overflow-y-auto rounded-xl border border-divider bg-surface-raised p-2 shadow-2xl shadow-black/50 md:left-3 md:right-auto"
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
      className="fixed inset-x-0 top-0 z-40 h-[var(--timeline-header-height)] border-b border-divider bg-canvas/97 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 [background:radial-gradient(circle_at_72%_20%,rgba(214,173,104,.14),transparent_33%),linear-gradient(90deg,rgba(16,23,25,1),rgba(24,33,36,.72))]" />
      <div className="relative mx-auto flex h-full max-w-[1600px] items-stretch px-4 pt-[var(--nav-height)] sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 flex-col justify-center py-1 pr-2 sm:pr-4 md:py-1.5">
          <p className="atlas-eyebrow hidden md:block">Current era</p>
          <h1 className="w-max whitespace-nowrap font-serif text-[clamp(.625rem,3.35vw,1.25rem)] font-semibold leading-none text-content sm:text-[clamp(.9rem,2.75vw,1.5rem)] md:text-[clamp(1rem,2.1vw,2rem)]">
            {groupMeta ? title : <TextSwap text={title} className="block w-max whitespace-nowrap" />}
          </h1>
          {subheadline && (
            <p className="mt-0.5 hidden max-w-[min(32rem,42vw)] truncate text-[0.68rem] text-content-muted lg:block">
              <ContextSwap transitionKey={subheadline}>{subheadline}</ContextSwap>
            </p>
          )}
          <p className="mt-0.5 whitespace-nowrap text-[0.62rem] font-semibold text-accent sm:text-[0.68rem] md:text-xs">
            <AnimatedYear year={orderedYears[0] ?? 0} />
            <span className="mx-1.5 text-content-muted">–</span>
            <AnimatedYear year={orderedYears[1] ?? 0} />
          </p>
        </div>

        <div className="flex min-w-0 flex-1 justify-end bg-canvas/20 md:justify-start">
          <EraPerspectiveMenu view={view} setView={setView} />
          <EraStrip className="hidden min-w-0 flex-1 md:block" />
        </div>
      </div>
    </header>
  );
}
