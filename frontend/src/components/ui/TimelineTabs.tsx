interface TimelineTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role?: "tab";
  ariaSelected?: boolean;
  ariaControls?: string;
  id?: string;
  tabIndex?: number;
}

export default function TimelineTabs({
  active,
  onClick,
  children,
  role,
  ariaSelected,
  ariaControls,
  id,
  tabIndex,
}: TimelineTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={role}
      aria-selected={ariaSelected}
      aria-controls={ariaControls}
      id={id}
      tabIndex={tabIndex}
      className={`min-h-11 rounded-t-lg px-4 text-sm font-bold transition-colors ${
        active
          ? "border-b-2 border-accent bg-surface text-accent"
          : "text-content-muted hover:bg-surface/60 hover:text-content"
      }`}
    >
      {children}
    </button>
  );
}
