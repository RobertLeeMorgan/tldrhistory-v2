import { LuArrowRight, LuSearch } from "react-icons/lu";

type TimelineSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
  buttonLabel?: string;
};

export default function TimelineSearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Search the timeline…",
  label = "Search history",
  className = "",
  buttonLabel = "Search",
}: TimelineSearchFieldProps) {
  return (
    <form
      role="search"
      className={`flex min-h-12 min-w-0 items-center gap-2 rounded-full border border-control bg-cream-raised px-4 text-ink shadow-lg shadow-black/15 focus-within:border-accent ${className}`}
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
        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink/55"
      />
      <button
        type="submit"
        aria-label={buttonLabel}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent-strong"
      >
        <LuArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}
