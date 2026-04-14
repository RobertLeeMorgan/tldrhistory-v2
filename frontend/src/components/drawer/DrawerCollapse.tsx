import type { DrawerCollapseProps } from "./drawerTypes";

export default function DrawerCollapse({
  title,
  children,
  count,
}: DrawerCollapseProps) {
  return (
    <div className="collapse bg-drawer">
      <input type="checkbox" className="peer" name={title} aria-label={title} />
      <div className="collapse-title text-lg font-medium text-stone-200 flex items-center justify-between">
        <span>{title}</span>

        {count !== undefined && count > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-900 font-medium">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
