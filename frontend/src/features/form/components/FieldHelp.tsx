import { useId, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface FieldHelpProps {
  text: string;
}

export default function FieldHelp({ text }: FieldHelpProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="More information"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="ml-2 inline-flex min-h-7 min-w-7 items-center justify-center rounded-full text-content-muted transition-colors hover:bg-canvas hover:text-accent"
      >
        <IoMdInformationCircleOutline className="text-base" />
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute right-0 top-full z-30 mt-1 w-64 rounded-lg border border-divider bg-canvas px-3 py-2 text-xs font-normal leading-relaxed text-content shadow-xl sm:left-full sm:right-auto sm:top-1/2 sm:ml-2 sm:mt-0 sm:-translate-y-1/2"
        >
          {text}
        </div>
      )}
    </span>
  );
}
