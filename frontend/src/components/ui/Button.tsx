import { Link } from "react-router-dom";

type ButtonProps = {
  label: string;
  primary?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: string;
  to?: string;
};

export default function Button({
  label,
  primary,
  onClick,
  isLoading = false,
  type = "button",
  loading = "Submitting...",
  to,
}: ButtonProps) {
  const className = `btn rounded-lg w-32 sm:w-40 self-center shadow-sm shadow-stone-950/30 hover:shadow-lg transition-all duration-300 ${
    primary
      ? "bg-gold text-stone-100 hover:bg-gold-hover"
      : "btn-outline text-stone-100 bg-stone-900 border-stone-200 hover:border-gold hover:text-gold hover:bg-stone-950/90"
  }`;

  if (to) {
    return (
      <Link to={to} className={className} aria-label={label}>
        {label}
      </Link>
    );
  }

  return (
    <button
      className={className}
      disabled={isLoading}
      aria-label={label}
      onClick={onClick}
      type={type}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-md"></span>
          {loading}
        </>
      ) : (
        label
      )}
    </button>
  );
}