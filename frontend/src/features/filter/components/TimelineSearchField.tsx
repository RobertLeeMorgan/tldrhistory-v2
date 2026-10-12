import { LuArrowRight, LuSearch } from "react-icons/lu";

type TimelineSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export default function TimelineSearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Search the timeline…",
  label = "Search history",
  className = "",
  buttonLabel = "Search",
  compact = false,
}: TimelineSearchFieldProps) {
  return (
    <form
      role="search"
      className={`flex min-w-0 items-center rounded-full border border-control bg-cream-raised text-ink shadow-lg shadow-black/15 focus-within:border-accent ${compact ? "min-h-10 gap-1.5 px-3" : "min-h-12 gap-2 px-4"} ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <LuSearch className="size-5 shrink-0 text-ink/65" aria-hidden="true" />
      <label className="sr-only" htmlFor={label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
        {label}
      </label>
      <input
        id={label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/55 ${compact ? "py-1" : "py-2"}`}
      />
      <button
        type="submit"
        aria-label={buttonLabel}
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent-strong ${compact ? "size-8" : "size-9"}`}
      >
        <LuArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}
