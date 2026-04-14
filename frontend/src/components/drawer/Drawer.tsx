import DrawerCheckbox from "./DrawerCheckbox";
import DrawerCollapse from "./DrawerCollapse";
import DrawerInput from "./DrawerInput";
import { collapseData, themes } from "../../utils/drawerValues";
import Button from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { hasActiveState } from "../../utils/filterUtils";
import { useTimelineFilter } from "../../context/FilterContext";
import { DEFAULT_TIMELINE_FILTER, type TimelineFilter } from "../../features/filter/components/TimelineFilter";

export default function Drawer() {
  const { filter, patchFilter, resetFilter } = useTimelineFilter();

  const updateArrayFilter = (
    key: keyof TimelineFilter,
    value: string,
    checked: boolean,
  ) => {
    const current = (filter[key] as string[]) || [];
    const newArray = checked
      ? [...current, value]
      : current.filter((v) => v !== value);

    patchFilter({ [key]: newArray } as Partial<TimelineFilter>);
  };

  const updateValueFilter = (key: keyof TimelineFilter, raw: string) => {
    if (key === "yearStart" || key === "yearEnd" || key === "group") {
      const num = raw.trim() === "" ? undefined : Number(raw);
      patchFilter({ [key]: num } as Partial<TimelineFilter>);
    } else {
      patchFilter({ [key]: raw } as Partial<TimelineFilter>);
    }
  };

  const themeCount = filter.group !== 0 ? 1 : 0;

  const getSectionCount = (section: (typeof collapseData)[number]) => {
    return section.options.reduce((acc, opt) => {
      const arr = filter[opt.name as keyof TimelineFilter] as string[] | undefined;
      return acc + (arr?.includes(opt.value) ? 1 : 0);
    }, 0);
  };

  const dateCount =
    (filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) +
    (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0);

  const hasActiveFilters = hasActiveState(filter);

  const handleReset = () => {
    resetFilter();
  };

  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      />

      <div className="menu p-4 pt-10 w-80 min-h-full bg-drawer text-stone-200">
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
              <option aria-label={c.labelText} key={c.value} value={c.value}>
                {c.labelText}
              </option>
            ))}
          </select>
        </DrawerCollapse>

        {collapseData.map((section) => (
          <DrawerCollapse
            title={section.title}
            key={section.title}
            count={getSectionCount(section)}
          >
            {section.options.map((opt) => (
              <DrawerCheckbox
                key={opt.value}
                value={opt.value}
                labelText={opt.labelText}
                checked={(filter as any)[opt.name]?.includes(opt.value) ?? false}
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
            type="number"
            name="start"
            min={-300000}
            max={2025}
            placeholder="Start"
            className="input input-bordered w-full max-w-xs mb-2"
            value={filter.yearStart !== undefined ? String(filter.yearStart) : ""}
            onChange={(val) => updateValueFilter("yearStart", val)}
          />
          <DrawerInput
            type="number"
            name="end"
            min={-300000}
            max={2025}
            placeholder="End"
            className="input input-bordered w-full max-w-xs"
            value={filter.yearEnd !== undefined ? String(filter.yearEnd) : ""}
            onChange={(val) => updateValueFilter("yearEnd", val)}
          />
        </DrawerCollapse>

        <div className="pt-4 min-h-20 flex items-center">
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
    </div>
  );
}