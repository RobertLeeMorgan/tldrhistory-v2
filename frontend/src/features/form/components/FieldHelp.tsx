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
        className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-stone-400 transition hover:text-gold focus:outline-none"
      >
        <IoMdInformationCircleOutline className="text-base hover:text-gold" />
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute left-full top-1/2 z-30 ml-2 w-64 -translate-y-1/2 rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-xs leading-relaxed text-stone-200 shadow-xl"
        >
          {text}
        </div>
      )}
    </span>
  );
}
