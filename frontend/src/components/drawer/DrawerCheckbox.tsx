import type { DrawerCheckboxProps } from "./drawerTypes";

export default function DrawerCheckbox({
  value,
  labelText,
  checked,
  onChange,
}: DrawerCheckboxProps) {
  return (
    <input
      className="btn btn-md m-1"
      type="checkbox"
      name={labelText}
      aria-label={labelText}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}
