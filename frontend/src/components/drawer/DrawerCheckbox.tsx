import type { DrawerCheckboxProps } from "./drawerTypes";

export default function DrawerCheckbox({
  value,
  labelText,
  checked,
  onChange,
}: DrawerCheckboxProps) {
  return (
    <input
      className={`btn btn-md m-1 border hover:text-neutral-300 rounded-md hover:bg-neutral-900/80 hover:border-neutral-400 ${
                      checked ? "bg-stone-950/40 border-neutral-300 text-neutral-200 shadow-md shadow-indigo-300/30" : "bg-neutral-900 border-neutral-600 text-neutral-400"
                    } transition-all duration-200 ease-in-out`}
      type="checkbox"
      name={labelText}
      aria-label={labelText}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}
