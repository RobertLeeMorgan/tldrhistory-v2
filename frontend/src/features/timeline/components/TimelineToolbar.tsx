import { useEffect, useRef, useState } from "react";
import { IoMdShare } from "react-icons/io";
import { LuChevronDown } from "react-icons/lu";
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

function ToolbarMenu({
  label,
  shortLabel = label,
  count = 0,
  open,
  onToggle,
  children,
}: {
  label: string;
  shortLabel?: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const menuId = `toolbar-menu-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="timeline-toolbar-menu relative" data-toolbar-menu={label}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onToggle}
        className={`timeline-toolbar-menu-button flex min-h-9 items-center gap-1.5 rounded-lg border bg-surface px-2 text-xs font-bold transition-colors ${open ? "border-accent text-content" : "border-divider text-content-muted hover:border-accent hover:text-content"}`}
      >
        <span className="timeline-toolbar-label-full">{label}</span>
        <span className="timeline-toolbar-label-short">{shortLabel}</span>
        {count > 0 && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] text-on-accent">{count}</span>}
        <LuChevronDown aria-hidden="true" className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={menuId} className="absolute left-0 top-[calc(100%+.4rem)] z-50 max-h-[min(28rem,60vh)] min-w-64 overflow-y-auto rounded-xl border border-divider bg-surface-raised p-3 shadow-2xl shadow-black/45">
          {children}
        </div>
      )}
    </div>
  );
}

export default function TimelineToolbar({ onOpenDrawer }: TimelineToolbarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const interactionLockedRef = useRef(false);
  const { filter, patchFilter, resetFilter } = useTimelineFilter();
  const { view, setView } = useEra();
  const { addToast } = useToast();
  const search = useTimelineSearch();
  const years = useDrawerYearInputs({ filter, patchFilter });
  const hasActiveFilters = hasActiveState(filter);

  useEffect(() => {
    if (!openMenu) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      const owner = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-toolbar-menu]")?.dataset.toolbarMenu
        : undefined;
      if (owner !== openMenu) setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  useEffect(() => {
    interactionLockedRef.current = Boolean(openMenu);
  }, [openMenu]);

  useEffect(() => {
    const hideDistance = 40;
    const revealDistance = 24;
    const topGuard = 96;
    let lastY = window.scrollY;
    let accumulatedDistance = 0;
    let direction = 0;
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;
      const nextY = window.scrollY;
      const delta = nextY - lastY;
      lastY = nextY;

      const focusIsWithin = toolbarRef.current?.contains(document.activeElement) ?? false;
      if (nextY <= topGuard || interactionLockedRef.current || focusIsWithin) {
        accumulatedDistance = 0;
        direction = 0;
        setHidden(false);
        return;
      }

      const nextDirection = Math.sign(delta);
      if (nextDirection === 0) return;
      if (nextDirection !== direction) {
        accumulatedDistance = 0;
        direction = nextDirection;
      }
      accumulatedDistance += delta;

      if (accumulatedDistance >= hideDistance) {
        setHidden(true);
        accumulatedDistance = 0;
      } else if (accumulatedDistance <= -revealDistance) {
        setHidden(false);
        accumulatedDistance = 0;
      }
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const menuProps = (label: string) => ({
    open: openMenu === label,
    onToggle: () => setOpenMenu((current) => current === label ? null : label),
  });

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
    <>
      <div data-timeline-toolbar-spacer aria-hidden="true" className="h-0 md:h-[calc(var(--timeline-toolbar-height)+1rem)]" />
      <div
        ref={toolbarRef}
        data-timeline-toolbar
        data-hidden={hidden ? "true" : "false"}
        onFocusCapture={() => setHidden(false)}
        className={`pointer-events-none fixed inset-x-0 top-[calc(var(--nav-height)+var(--timeline-header-height))] z-30 transform-gpu transition-transform duration-200 ease-out motion-reduce:transition-none ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="mx-auto max-w-[1600px] md:pl-[var(--timeline-sidebar-width)]">
          <div data-timeline-toolbar-frame className={`${hidden ? "pointer-events-none" : "pointer-events-auto"} h-[var(--timeline-toolbar-height)] border-b border-divider bg-canvas/95 px-4 backdrop-blur-xl sm:px-6 lg:px-7`}>
            <div data-timeline-toolbar-content className="timeline-toolbar-content mx-auto flex h-full max-w-[1280px] flex-nowrap items-center gap-1.5">
        <TimelineSearchField compact value={search.value} onChange={search.setValue} onSubmit={search.submit} label="Search timeline" className="timeline-toolbar-search min-w-0 flex-1 border-divider bg-cream-raised shadow-none" />

        <button type="button" className={`timeline-toolbar-drawer ${toolButton} gap-2`} onClick={onOpenDrawer} aria-label={`Open filters${filterCount ? `, ${filterCount} active` : ""}`}>
          <FilterIcon /> <span className="timeline-toolbar-drawer-label">Filters</span>
          {filterCount > 0 && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold text-on-accent">{filterCount}</span>}
        </button>

        <ToolbarMenu label="Theme" count={filter.group ? 1 : 0} {...menuProps("Theme")}>
          <label className="space-y-2 text-sm font-bold text-content-muted">
            <select value={filter.group} onChange={(event) => patchFilter({ group: Number(event.target.value) })} className="atlas-control w-full px-3" aria-label="Theme">
              {themes.options.map((option) => <option key={option.value} value={option.value}>{option.labelText}</option>)}
            </select>
          </label>
        </ToolbarMenu>

        {collapseData.map((section) => {
          const key = section.options[0]?.name as ArrayFilterKey;
          return (
            <ToolbarMenu key={section.title} label={section.title} shortLabel={section.title === "Continents" ? "Regions" : section.title === "Subjects" ? "Topics" : section.title} count={arrayCount(key)} {...menuProps(section.title)}>
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

        <ToolbarMenu label="Dates" count={(filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) + (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0)} {...menuProps("Dates")}>
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

        <ToolbarMenu label="Saved" {...menuProps("Saved")}><SavedFilters /></ToolbarMenu>

        <button type="button" className={toolButton} onClick={() => patchFilter({ sortBy: !filter.sortBy }, { replace: true })} aria-label={filter.sortBy ? "Sort newest first" : "Sort oldest first"} title={filter.sortBy ? "Oldest first" : "Newest first"}><SortIcon /></button>
        <button type="button" className={`timeline-toolbar-share ${toolButton}`} onClick={handleShare} aria-label="Copy share link" title="Copy share link"><IoMdShare className="h-5 w-5" /></button>
        {hasActiveFilters && <button type="button" className={`timeline-toolbar-reset ${toolButton} gap-2 text-accent`} onClick={() => { setOpenMenu(null); setView("global"); resetFilter({ replace: true }); search.clear(); }} aria-label="Reset filters"><CloseIcon /><span className="timeline-toolbar-reset-label">Reset</span></button>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
