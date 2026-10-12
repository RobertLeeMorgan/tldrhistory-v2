import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router";

type ButtonProps = {
  label: string;
  primary?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: string;
  to?: string;
  className?: string;
  disabled?: boolean;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "aria-describedby">;

export default function Button({
  label,
  primary,
  onClick,
  isLoading = false,
  type = "button",
  loading = "Submitting...",
  to,
  className = "",
  disabled = false,
  ...ariaProps
}: ButtonProps) {
  const classes = `inline-flex min-h-11 min-w-32 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${
    primary
      ? "border-accent bg-accent text-on-accent hover:border-accent-strong hover:bg-accent-strong"
      : "border-control bg-surface text-content hover:border-accent hover:text-accent"
  } ${className}`;

  if (to) {
    return <Link to={to} className={classes} aria-label={label}>{label}</Link>;
  }

  return (
    <button className={classes} disabled={disabled || isLoading} aria-label={label} aria-busy={isLoading || undefined} onClick={onClick} type={type} {...ariaProps}>
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          {loading}
        </>
      ) : label}
    </button>
  );
}
