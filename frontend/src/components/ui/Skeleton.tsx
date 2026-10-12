export default function Skeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-divider bg-surface-raised shadow-[0_16px_42px_rgba(0,0,0,.2)]" aria-hidden="true">
      <div className="motion-safe:animate-pulse">
        <div className="aspect-[16/9] w-full bg-divider/45" />
        <div className="space-y-3 p-4 sm:p-5">
          <div className="h-7 w-3/4 rounded bg-divider/80" />
          <div className="h-4 w-2/5 rounded bg-divider/60" />
          <div className="h-4 w-full rounded bg-divider/55" />
          <div className="h-4 w-full rounded bg-divider/55" />
          <div className="h-4 w-2/3 rounded bg-divider/55" />
          <div className="flex gap-2 border-t border-divider pt-3">
            <div className="h-7 w-20 rounded-full bg-divider/55" />
            <div className="h-7 w-24 rounded-full bg-divider/55" />
          </div>
        </div>
      </div>
    </div>
  );
}
