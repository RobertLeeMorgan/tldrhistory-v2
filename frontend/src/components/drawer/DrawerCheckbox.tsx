import type { DrawerCheckboxProps } from "./drawerTypes";

export default function DrawerCheckbox({
  value,
  labelText,
  checked,
  onChange,
}: DrawerCheckboxProps) {
  return (
    <input
      className={`m-1 min-h-10 cursor-pointer rounded-lg border px-3 text-sm font-bold ${
        checked
          ? "border-accent bg-accent/12 text-accent"
          : "border-divider bg-canvas/35 text-content-muted hover:border-control hover:text-content"
      } transition-colors`}
      type="checkbox"
      name={labelText}
      aria-label={labelText}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}
