import type { DrawerInputProps } from "./drawerTypes";

export default function DrawerInput({
  value,
  onChange,
  className,
  ...props
}: DrawerInputProps) {
  return (
    <input
      {...props}
      value={value}
      name={props.name}
      aria-label={props.name}
      className={`input input-bordered w-full bg-drawer border-stone-600 text-stone-100 caret-stone-100 mb-2 ${className ?? ""}`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}