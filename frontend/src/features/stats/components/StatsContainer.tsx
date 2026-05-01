type StatsProps = {
  children: React.ReactNode;
  timeline?: boolean;
};

export default function StatsContainer({ children, timeline }: StatsProps) {
  return (
    <aside
      className="
        fixed z-30

        bottom-0 left-0 w-full h-26
        sm:left-auto sm:right-0 sm:bottom-auto
        sm:w-[min(34vw,420px)]
        md:w-[min(32vw,440px)]
        lg:w-[min(30vw,460px)]

        sm:top-[var(--header-height-sm)]
        md:top-[var(--header-height-md)]
        lg:top-[var(--header-height-lg)]

        sm:h-[calc(100dvh-var(--header-height-sm))]
        md:h-[calc(100dvh-var(--header-height-md))]
        lg:h-[calc(100dvh-var(--header-height-lg))]
      "
    >
      <div
        className={`${
          timeline
            ? "grid grid-cols-[29%_auto_33%] sm:grid-cols-1 sm:grid-rows-[28%_32%_40%]"
            : "grid grid-cols-3 sm:grid-cols-1 sm:grid-rows-3"
        } stats sm:stats-vertical w-full h-full bg-gradient-to-br from-stats-primary to-stats-secondary border-t sm:border-l border-stone-800 shadow-lg shadow-stone-950/20 py-1 sm:py-0 rounded-none overflow-hidden`}
      >
        {children}
      </div>
    </aside>
  );
}