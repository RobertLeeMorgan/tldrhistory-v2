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
      className={`atlas-control mb-2 w-full px-3 ${className ?? ""}`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
