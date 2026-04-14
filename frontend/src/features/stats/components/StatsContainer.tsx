type StatsProps = {
  children: React.ReactNode;
  timeline?: boolean;
};

export default function StatsContainer({ children, timeline }: StatsProps) {
  return (
    <aside
      className="fixed sm:sticky bottom-0 left-0 w-full z-30 sm:bottom-auto h-26 shadow-xl
  sm:top-[var(--header-height-sm)]
  md:top-[var(--header-height-md)]
  lg:top-[var(--header-height-lg)]
  sm:h-[calc(100vh-var(--header-height-sm))]
  md:h-[calc(100vh-var(--header-height-md))]
  lg:h-[calc(100vh-var(--header-height-lg))]
"
    >
      <div
        className={`${timeline ? "grid-cols-[29%_auto_33%] sm:grid-rows-[28%_32%_40%]" : "grid grid-cols-3 sm:grid-rows-3"} stats sm:stats-vertical sm:grid-cols-1 w-full h-full bg-gradient-to-br from-stats-primary to-stats-secondary border-t sm:border-l border-stone-800 shadow-lg shadow-stone-950/20 py-1 sm:py-0 rounded-none overflow-hidden`}
      >
        {children}
      </div>
    </aside>
  );
}
