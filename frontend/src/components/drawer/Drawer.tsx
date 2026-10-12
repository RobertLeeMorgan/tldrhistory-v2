import DrawerCheckbox from "./DrawerCheckbox";
import DrawerCollapse from "./DrawerCollapse";
import DrawerInput from "./DrawerInput";
import { collapseData, themes } from "../../utils/drawerValues";
import Button from "../ui/Button";
import { hasActiveState } from "../../utils/filterUtils";
import { useTimelineFilter } from "../../context/FilterContext";
import {
  DEFAULT_TIMELINE_FILTER,
  type TimelineFilter,
} from "../../features/filter/components/TimelineFilter";
import { useDrawerYearInputs } from "./useDrawerYearInputs";
import {
  getDateCount,
  getSectionCount,
  getThemeCount,
} from "./drawerFilterHelpers";
import SavedFilters from "./SavedFilters";
import ModalShell from "../modal/ModalShell";
import ModalCloseButton from "../modal/ModalCloseButton";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  const { filter, patchFilter, resetFilter } = useTimelineFilter();

  const {
    yearStartInput,
    yearEndInput,
    setYearStartInput,
    setYearEndInput,
  } = useDrawerYearInputs({ filter, patchFilter });

  const updateArrayFilter = (
    key: keyof TimelineFilter,
    value: string,
    checked: boolean,
  ) => {
    const current = (filter[key] as string[]) || [];
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);

    patchFilter({ [key]: next } as Partial<TimelineFilter>);
  };

  const updateValueFilter = (key: keyof TimelineFilter, raw: string) => {
    if (key === "group") {
      const num = raw.trim() === "" ? undefined : Number(raw);
      patchFilter({ [key]: num } as Partial<TimelineFilter>);
      return;
    }

    patchFilter({ [key]: raw } as Partial<TimelineFilter>);
  };

  const themeCount = getThemeCount(filter);
  const dateCount = getDateCount(filter);
  const hasActiveFilters = hasActiveState(filter);

  const handleReset = () => {
    resetFilter();
    setYearStartInput(String(DEFAULT_TIMELINE_FILTER.yearStart));
    setYearEndInput(String(DEFAULT_TIMELINE_FILTER.yearEnd));
  };

  return (
    <ModalShell open={isOpen} onClose={onClose} ariaLabel="Timeline filters" overlayClassName="justify-start p-0" panelClassName="h-full max-h-dvh max-w-sm rounded-none border-y-0 border-l-0">
      <aside className="flex h-full flex-col bg-surface text-content">
        <header className="flex items-center justify-between border-b border-divider px-5 py-4">
          <div>
            <p className="atlas-eyebrow">Refine the atlas</p>
            <h2 className="text-2xl font-bold">Timeline filters</h2>
          </div>
          <ModalCloseButton onClose={onClose} />
        </header>
        <div className="flex-1 overflow-y-auto p-3">
              <DrawerCollapse title="Theme" count={themeCount}>
                <select
                  value={filter.group ?? 0}
                  onChange={(e) => updateValueFilter("group", e.target.value)}
                  className="atlas-control w-full px-3"
                  aria-label="Theme Select"
                  name="Theme"
                >
                  <option value={0}>Select Theme</option>
                  {themes.options.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      aria-label={c.labelText}
                    >
                      {c.labelText}
                    </option>
                  ))}
                </select>
              </DrawerCollapse>

              {collapseData.map((section) => (
                <DrawerCollapse
                  key={section.title}
                  title={section.title}
                  count={getSectionCount(filter, section)}
                >
                  {section.options.map((opt) => (
                    <DrawerCheckbox
                      key={opt.value}
                      value={opt.value}
                      labelText={opt.labelText}
                      checked={
                        (filter[opt.name as keyof TimelineFilter] as string[] | undefined)?.includes(opt.value) ?? false
                      }
                      onChange={(checked) =>
                        updateArrayFilter(
                          opt.name as keyof TimelineFilter,
                          opt.value,
                          checked,
                        )
                      }
                    />
                  ))}
                </DrawerCollapse>
              ))}

              <DrawerCollapse title="Date Range" count={dateCount}>
                <DrawerInput
                  type="text"
                  inputMode="numeric"
                  pattern="-?[0-9]*"
                  name="start"
                  placeholder="Start"
                  className="w-full max-w-xs mb-2"
                  value={yearStartInput}
                  onChange={(val) => {
                    if (/^-?\d*$/.test(val)) {
                      setYearStartInput(val);
                    }
                  }}
                />
                <DrawerInput
                  type="text"
                  inputMode="numeric"
                  pattern="-?[0-9]*"
                  name="end"
                  placeholder="End"
                  className="w-full max-w-xs"
                  value={yearEndInput}
                  onChange={(val) => {
                    if (/^-?\d*$/.test(val)) {
                      setYearEndInput(val);
                    }
                  }}
                />
              </DrawerCollapse>
              <SavedFilters />

        </div>
        <footer className="flex items-center gap-3 border-t border-divider p-4">
          <Button label="Done" primary onClick={onClose} className="flex-1" />
          {hasActiveFilters && <Button label="Clear" onClick={handleReset} className="min-w-24" />}
        </footer>
      </aside>
    </ModalShell>
  );
}
