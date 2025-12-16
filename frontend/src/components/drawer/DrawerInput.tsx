import type { DrawerInputProps } from "./drawerTypes";

export default function DrawerInput({
  value,
  onChange,
  ...props
}: DrawerInputProps) {
  return (
    <input
      {...props}
      value={value}
      name={props.name}
      aria-label={props.name}
      className="input input-bordered w-full"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}