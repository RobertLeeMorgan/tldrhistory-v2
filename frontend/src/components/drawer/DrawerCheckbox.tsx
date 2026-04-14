import type { DrawerCheckboxProps } from "./drawerTypes";

export default function DrawerCheckbox({
  value,
  labelText,
  checked,
  onChange,
}: DrawerCheckboxProps) {
  return (
    <input
      className={`btn btn-md m-1 border rounded-md  ${
        checked
          ? "bg-stone-950/40 border-gold text-gold shadow-sm shadow-stone-950/30 hover:bg-gold/10 hover:border-gold hover:text-gold/80"
          : "bg-drawer border-stone-600 text-stone-400 hover:text-stone-300 hover:bg-drawer/80 hover:border-stone-400"
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
