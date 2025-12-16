import type { DrawerCollapseProps } from "./drawerTypes";

export default function DrawerCollapse({
  title,
  children,
}: DrawerCollapseProps) {
  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" className="peer" name={title} aria-label={title} />
      <div className="collapse-title text-lg font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
