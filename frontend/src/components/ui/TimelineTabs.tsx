interface TimelineTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role?: "tab";
  ariaSelected?: boolean;
  ariaControls?: string;
  id?: string;
}

export default function TimelineTabs({
  active,
  onClick,
  children,
  role,
  ariaSelected,
  ariaControls,
  id,
}: TimelineTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={role}
      aria-selected={ariaSelected}
      aria-controls={ariaControls}
      id={id}
      className={`pb-2 px-2 text-base sm:text-lg transition ${
        active
          ? "border-b-3 border-gold font-bold text-gold"
          : "font-semibold text-stone-400 hover:text-stone-500"
      }`}
    >
      {children}
    </button>
  );
}
