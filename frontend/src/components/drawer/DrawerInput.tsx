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
      className="input input-bordered w-full bg-zinc-900 text-neutral-100 caret-neutral-100 mb-2"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}