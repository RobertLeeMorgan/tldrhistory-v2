import DrawerCheckbox from "./DrawerCheckbox";
import DrawerCollapse from "./DrawerCollapse";
import DrawerInput from "./DrawerInput";
import { collapseData, themes } from "../../utils/drawerValues";
import Button from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { hasActiveState } from "../../utils/filterUtils";
import { useTimelineFilter } from "../../context/FilterContext";
import {
  DEFAULT_TIMELINE_FILTER,
  type TimelineFilter,
} from "../../features/filter/components/TimelineFilter";
import { createPortal } from "react-dom";
import { useDrawerYearInputs } from "./useDrawerYearInputs";
import {
  getDateCount,
  getSectionCount,
  getThemeCount,
} from "./drawerFilterHelpers";
import SavedFilters from "./SavedFilters";

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-stone-950/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close filters"
          />

          <motion.aside
            className="fixed inset-y-0 left-0 z-[65] w-80 bg-drawer text-stone-200 shadow-2xl shadow-stone-950/50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.24, ease: "easeOut" }}
          >
            <div className="h-full overflow-y-auto p-4 pt-10">
              <DrawerCollapse title="Theme" count={themeCount}>
                <select
                  value={filter.group ?? 0}
                  onChange={(e) => updateValueFilter("group", e.target.value)}
                  className="select select-bordered w-full bg-drawer border-stone-600 text-stone-200"
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

              <div className="min-h-20 flex items-center pt-4">
                <AnimatePresence mode="wait">
                  {hasActiveFilters ? (
                    <motion.div
                      className="w-full px-4"
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                    >
                      <Button label="Clear Filters" onClick={handleReset} />
                    </motion.div>
                  ) : (
                    <div className="w-full px-4 invisible">
                      <Button label="Clear Filters" onClick={() => {}} />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}