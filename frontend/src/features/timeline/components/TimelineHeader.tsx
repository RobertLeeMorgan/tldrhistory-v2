import { LuGlobe, LuMapPin } from "react-icons/lu";
import { useEra } from "../../../context/EraContext";
import { formatYear } from "../../../utils/formatYear";
import type { TimelineFilter } from "../../filter/components/TimelineFilter";
import { themes } from "../../../utils/drawerValues";
import { VIEW_OPTIONS } from "../../../utils/rangeViews";
import EraStrip from "./EraStrip";

function yearLabel(year: number) {
  return Math.abs(year).toLocaleString() + " " + formatYear(year);
}

export default function TimelineHeader({ filter }: { filter: TimelineFilter }) {
  const { startYear, endYear, label, headline, dataStartYear, view, setView } = useEra();
  const groupMeta = filter.group > 0
    ? themes.options.find((option) => option.value === filter.group)
    : null;
  const hasExplicitRange =
    filter.yearStart !== -300000 && filter.yearEnd !== 2025;
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
      className="fixed inset-x-0 top-[var(--nav-height)] z-40 h-[var(--timeline-header-height)] overflow-hidden border-b border-divider bg-canvas/97 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_72%_20%,rgba(214,173,104,.14),transparent_33%),linear-gradient(90deg,rgba(16,23,25,1),rgba(24,33,36,.72))]" />
      <div className="relative mx-auto grid h-[calc(var(--timeline-header-height)-5.7rem)] max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_220px_260px] lg:px-8">
        <div className="min-w-0">
          <p className="atlas-eyebrow">Current context</p>
          <h1 className="truncate font-serif text-2xl font-semibold text-content sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-1 hidden max-w-2xl truncate text-sm text-content-muted sm:block">
            {subheadline}
          </p>
          <p className="mt-1 text-xs font-semibold text-accent sm:text-sm">
            {yearLabel(orderedYears[0] ?? 0)} – {yearLabel(orderedYears[1] ?? 0)}
          </p>
        </div>

        <div className="hidden border-l border-divider pl-6 lg:block">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-content-muted">
            <LuMapPin aria-hidden="true" /> Timeline position
          </p>
          <p className="mt-1 font-serif text-3xl text-content">{yearLabel(dataStartYear)}</p>
        </div>

        <label className="flex min-w-0 items-center gap-2 lg:flex-col lg:items-stretch">
          <span className="sr-only lg:not-sr-only lg:text-xs lg:font-bold lg:uppercase lg:tracking-[0.15em] lg:text-content-muted">
            Era perspective
          </span>
          <span className="pointer-events-none absolute ml-3 text-accent lg:mt-[2.25rem]">
            <LuGlobe aria-hidden="true" />
          </span>
          <select
            value={view}
            onChange={(event) => setView(event.target.value as typeof view)}
            className="atlas-control min-w-0 max-w-40 appearance-none pl-9 pr-7 text-xs sm:max-w-48 sm:text-sm lg:max-w-none"
            aria-label="Era perspective"
          >
            {VIEW_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>
      <EraStrip />
    </header>
  );
}
