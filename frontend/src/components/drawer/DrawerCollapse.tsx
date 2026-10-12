import type { DrawerCollapseProps } from "./drawerTypes";

export default function DrawerCollapse({
  title,
  children,
  count,
}: DrawerCollapseProps) {
  return (
    <div className="collapse border-b border-divider bg-surface">
      <input type="checkbox" className="peer" name={title} aria-label={title} />
      <div className="collapse-title flex items-center justify-between text-base font-bold text-content">
        <span>{title}</span>

        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
