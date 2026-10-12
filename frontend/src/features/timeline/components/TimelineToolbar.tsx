import { Link } from "react-router";
import { IoIosAdd } from "react-icons/io";
import { IoMdShare } from "react-icons/io";
import { CloseIcon, FilterIcon, SortIcon } from "../../../icons/icons";
import { useTimelineFilter } from "../../../context/FilterContext";
import { useEra } from "../../../context/EraContext";
import { useToast } from "../../../context/ToastContext";
import { collapseData, themes } from "../../../utils/drawerValues";
import { hasActiveState } from "../../../utils/filterUtils";
import { filterToSearchParams } from "../../filter/components/timelineFilterParams";
import { DEFAULT_TIMELINE_FILTER, type TimelineFilter } from "../../filter/components/TimelineFilter";
import TimelineSearchField from "../../filter/components/TimelineSearchField";
import { useTimelineSearch } from "../../filter/hooks/useTimelineSearch";
import { getGroupSlugFromId } from "../../../utils/groupLookup";
import { useDrawerYearInputs } from "../../../components/drawer/useDrawerYearInputs";
import SavedFilters from "../../../components/drawer/SavedFilters";

type TimelineToolbarProps = { onOpenDrawer: () => void };
type ArrayFilterKey = "type" | "subject" | "continent";

function ToolbarMenu({ label, count = 0, children }: { label: string; count?: number; children: React.ReactNode }) {
  return (
    <details className="group relative hidden md:block">
      <summary className="flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-lg border border-divider bg-surface px-2.5 text-xs font-bold text-content-muted transition-colors hover:border-accent hover:text-content">
        {label}
        {count > 0 && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] text-on-accent">{count}</span>}
        <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute left-0 top-[calc(100%+.4rem)] z-50 max-h-[min(28rem,60vh)] min-w-64 overflow-y-auto rounded-xl border border-divider bg-surface-raised p-3 shadow-2xl shadow-black/45">
        {children}
      </div>
    </details>
  );
}

export default function TimelineToolbar({ onOpenDrawer }: TimelineToolbarProps) {
  const { filter, patchFilter, resetFilter } = useTimelineFilter();
  const { view, setView } = useEra();
  const { addToast } = useToast();
  const search = useTimelineSearch();
  const years = useDrawerYearInputs({ filter, patchFilter });
  const hasActiveFilters = hasActiveState(filter);

  const arrayCount = (key: ArrayFilterKey) => filter[key].length;
  const filterCount = filter.type.length + filter.subject.length + filter.continent.length
    + (filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0)
    + (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0)
    + (filter.group !== DEFAULT_TIMELINE_FILTER.group ? 1 : 0);

  const updateArrayFilter = (key: ArrayFilterKey, value: string, checked: boolean) => {
    const current = filter[key] as string[];
    const next = checked ? [...current, value] : current.filter((item) => item !== value);
    patchFilter({ [key]: next } as Partial<TimelineFilter>);
  };

  async function handleShare() {
    const params = filterToSearchParams(filter, new URLSearchParams());
    if (view !== "global") params.set("v", view);
    const slug = getGroupSlugFromId(filter.group);
    const pathname = slug ? `/timeline/${slug}` : "/timeline";
    const shareUrl = new URL(`${pathname}${params.size ? `?${params}` : ""}`, window.location.origin).toString();
    try {
      if (!navigator.clipboard?.writeText || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl);
      addToast({ message: "Share link copied to clipboard", type: "success" });
    } catch {
      addToast({ message: "Clipboard not available", type: "error" });
    }
  }

  const toolButton = "inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-divider bg-surface px-2.5 text-content-muted transition-colors hover:border-accent hover:text-content";

  return (
    <div className="sticky top-[calc(var(--nav-height)+var(--timeline-header-height))] z-30 -mx-4 mb-4 border-b border-divider bg-canvas/95 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1.5">
        <TimelineSearchField compact value={search.value} onChange={search.setValue} onSubmit={search.submit} label="Search timeline" className="min-w-0 flex-1 border-divider bg-cream-raised shadow-none sm:min-w-56 md:max-w-xs" />

        <button type="button" className={`${toolButton} gap-2 md:hidden`} onClick={onOpenDrawer} aria-label={`Open filters${filterCount ? `, ${filterCount} active` : ""}`}>
          <FilterIcon /> <span className="hidden xs:inline">Filters</span>
          {filterCount > 0 && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold text-on-accent">{filterCount}</span>}
        </button>

        <ToolbarMenu label="Theme" count={filter.group ? 1 : 0}>
          <label className="space-y-2 text-sm font-bold text-content-muted">
            <span>Historical theme</span>
            <select value={filter.group} onChange={(event) => patchFilter({ group: Number(event.target.value) })} className="atlas-control w-full px-3" aria-label="Theme">
              <option value={0}>All themes</option>
              {themes.options.map((option) => <option key={option.value} value={option.value}>{option.labelText}</option>)}
            </select>
          </label>
        </ToolbarMenu>

        {collapseData.map((section) => {
          const key = section.options[0]?.name as ArrayFilterKey;
          return (
            <ToolbarMenu key={section.title} label={section.title} count={arrayCount(key)}>
              <fieldset className="grid gap-1.5">
                <legend className="sr-only">{section.title}</legend>
                {section.options.map((option) => (
                  <label key={option.value} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-content-muted hover:bg-canvas/55 hover:text-content">
                    <input type="checkbox" className="checkbox checkbox-sm border-control [--chkbg:var(--color-accent)] [--chkfg:var(--color-on-accent)]" checked={(filter[key] as string[]).includes(option.value)} onChange={(event) => updateArrayFilter(key, option.value, event.target.checked)} />
                    {option.labelText}
                  </label>
                ))}
              </fieldset>
            </ToolbarMenu>
          );
        })}

        <ToolbarMenu label="Dates" count={(filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) + (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0)}>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs font-bold uppercase tracking-wide text-content-muted">From
              <input className="atlas-control w-full px-3 text-base font-normal" inputMode="numeric" value={years.yearStartInput} onChange={(event) => /^-?\d*$/.test(event.target.value) && years.setYearStartInput(event.target.value)} />
            </label>
            <label className="space-y-1 text-xs font-bold uppercase tracking-wide text-content-muted">To
              <input className="atlas-control w-full px-3 text-base font-normal" inputMode="numeric" value={years.yearEndInput} onChange={(event) => /^-?\d*$/.test(event.target.value) && years.setYearEndInput(event.target.value)} />
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-content-muted">Use negative years for BCE dates.</p>
        </ToolbarMenu>

        <ToolbarMenu label="Saved"><SavedFilters /></ToolbarMenu>

        <button type="button" className={toolButton} onClick={() => patchFilter({ sortBy: !filter.sortBy }, { replace: true })} aria-label={filter.sortBy ? "Sort newest first" : "Sort oldest first"} title={filter.sortBy ? "Oldest first" : "Newest first"}><SortIcon /></button>
        <button type="button" className={toolButton} onClick={handleShare} aria-label="Copy share link" title="Copy share link"><IoMdShare className="h-5 w-5" /></button>
        <Link to="/articles/create" className={`${toolButton} text-accent`} aria-label="Create article" title="Create article"><IoIosAdd className="h-7 w-7" /></Link>
        {hasActiveFilters && <button type="button" className={`${toolButton} gap-2 text-accent`} onClick={() => { setView("global"); resetFilter({ replace: true }); search.clear(); }} aria-label="Reset filters"><CloseIcon /><span className="hidden xl:inline">Reset</span></button>}
      </div>
    </div>
  );
}
