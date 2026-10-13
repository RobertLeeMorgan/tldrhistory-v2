import { LuGlobe } from "react-icons/lu";
import { useEra } from "../../../context/EraContext";
import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import { themes } from "../../../utils/drawerValues";
import { VIEW_OPTIONS } from "../../../utils/rangeViews";
import { ContextSwap, TextSwap } from "../../../components/ui/AnimatedValue";
import AnimatedYear from "../../../components/ui/AnimatedYear";
import EraStrip from "./EraStrip";

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
      className="fixed inset-x-0 z-40 h-[var(--timeline-header-height)] overflow-hidden border-b border-divider bg-canvas/97 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_72%_20%,rgba(214,173,104,.14),transparent_33%),linear-gradient(90deg,rgba(16,23,25,1),rgba(24,33,36,.72))]" />
      <div className="relative mx-auto grid h-full max-w-[1600px] grid-cols-[minmax(0,1fr)_minmax(8.5rem,auto)] grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(17rem,30%)_minmax(0,1fr)]">
        <div className="min-w-0 px-4 py-2 sm:px-6 md:row-span-2 md:flex md:flex-col md:justify-center md:border-r md:border-divider/70 lg:px-8">
          <p className="atlas-eyebrow">Current era</p>
          <h1 className="truncate font-serif text-xl font-semibold text-content sm:text-3xl lg:text-4xl">
            {groupMeta ? title : <TextSwap text={title} className="block truncate" />}
          </h1>
          {subheadline && (
            <p className="mt-0.5 hidden max-w-md truncate text-xs text-content-muted sm:block lg:text-sm">
              <ContextSwap transitionKey={subheadline}>{subheadline}</ContextSwap>
            </p>
          )}
          <p className="mt-0.5 truncate text-xs font-semibold text-accent sm:text-sm">
            <AnimatedYear year={orderedYears[0] ?? 0} />
            <span className="mx-1.5 text-content-muted">–</span>
            <AnimatedYear year={orderedYears[1] ?? 0} />
          </p>
        </div>

        <div className="grid min-w-0 content-center border-l border-divider/70 px-3 py-2 sm:px-5 md:border-l-0 lg:px-7">
          <label className="relative w-full min-w-0 sm:max-w-48 sm:justify-self-end">
            <span className="sr-only sm:not-sr-only sm:mb-1 sm:block sm:text-[0.62rem] sm:font-bold sm:uppercase sm:tracking-[0.12em] sm:text-content-muted">
              Era perspective
            </span>
            <LuGlobe aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-accent sm:top-[calc(50%+.55rem)]" />
            <select
              value={view}
              onChange={(event) => setView(event.target.value as typeof view)}
              className="atlas-control h-9 min-h-9 w-full min-w-0 appearance-none pl-8 pr-6 text-xs"
              aria-label="Era perspective"
            >
              {VIEW_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <EraStrip className="col-span-2 min-w-0 md:col-span-1 md:col-start-2" />
      </div>
    </header>
  );
}
