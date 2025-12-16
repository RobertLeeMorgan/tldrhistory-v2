import DrawerCheckbox from "./DrawerCheckbox";
import DrawerCollapse from "./DrawerCollapse";
import DrawerInput from "./DrawerInput";
import { collapseData, themes } from "../../utils/drawerValues";
import type { DrawerProps, TimelineFilter } from "./drawerTypes";

export default function Drawer({ filter, onChange }: DrawerProps) {
  const updateArrayFilter = (
    key: keyof TimelineFilter,
    value: string,
    checked: boolean
  ) => {
    const current = (filter[key] as string[]) || [];
    const newArray = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onChange({ ...filter, [key]: newArray });
  };

  const updateValueFilter = (key: keyof TimelineFilter, raw: string) => {
    if (key === "yearStart" || key === "yearEnd" || key === "group") {
      const num = raw.trim() === "" ? undefined : Number(raw);
      onChange({ ...filter, [key]: num });
    } else {
      onChange({ ...filter, [key]: raw });
    }
  };

  return (
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="menu p-4 pt-10 w-80 min-h-full bg-base-200 text-base-content">
          <DrawerCollapse title="Theme">
            <select
              value={filter.group ?? 0}
              onChange={(e) => updateValueFilter("group", e.target.value)}
              className="select select-bordered w-full"
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
            <DrawerCollapse title={section.title} key={section.title}>
              {section.options.map((opt, idx) => (
                <DrawerCheckbox
                  key={idx}
                  value={opt.value}
                  labelText={opt.labelText}
                  checked={
                    (filter as any)[opt.name]?.includes(opt.value) ?? false
                  }
                  onChange={(checked) =>
                    updateArrayFilter(
                      opt.name as keyof TimelineFilter,
                      opt.value,
                      checked
                    )
                  }
                />
              ))}
            </DrawerCollapse>
          ))}

          <DrawerCollapse title="Date Range">
            <DrawerInput
              type="number"
              name="start"
              min={-300000}
              max={1900}
              placeholder="Start"
              className="input input-bordered w-full max-w-xs mb-2"
              value={
                filter.yearStart !== undefined ? String(filter.yearStart) : ""
              }
              onChange={(val) => updateValueFilter("yearStart", val)}
            />
            <DrawerInput
              type="number"
              name="end"
              min={-300000}
              max={1950}
              placeholder="End"
              className="input input-bordered w-full max-w-xs"
              value={filter.yearEnd !== undefined ? String(filter.yearEnd) : ""}
              onChange={(val) => updateValueFilter("yearEnd", val)}
            />
          </DrawerCollapse>
        </div>
      </div>
  );
}
