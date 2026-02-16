import { useMemo, useState } from "react";
import EraHeader from "../components/timeline/EraHeader";
import Timeline from "../components/timeline/Timeline";
import StatsPanel from "../components/timeline/StatsPanel";
import type { TimelineFilter } from "../components/drawer/drawerTypes";
import { Suspense, lazy } from "react";

const Drawer = lazy(() => import("../components/drawer/Drawer"));
const UtilityMenu = lazy(() => import("../components/timeline/UtilityMenu"));

export default function EraPage() {
  const [filter, setFilter] = useState<TimelineFilter>({
    type: [],
    subject: [],
    continent: [],
    yearStart: undefined,
    yearEnd: undefined,
    search: "",
    sortBy: true,
    group: 0,
  });

  const handleReset = () => {
    setFilter({
      type: [],
      subject: [],
      continent: [],
      yearStart: undefined,
      yearEnd: undefined,
      search: "",
      sortBy: true,
      group: 0,
    });
  };

  const handleSort = () => {
    setFilter((prev) => ({
      ...prev,
      sortBy: !prev.sortBy,
    }));
  };

  const memoizedFilter = useMemo(
    () => filter,
    [
      filter.type,
      filter.subject,
      filter.continent,
      filter.yearStart,
      filter.yearEnd,
      filter.search,
      filter.sortBy,
      filter.group,
    ],
  );

  return (
    <>
      <main className="flex flex-col min-h-screen bg-stone-300/90 w-full">
        <EraHeader filter={memoizedFilter} />

        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-[2fr_1fr]">
          <div className="flex flex-col min-h-0 p-4">
            <Timeline
              filter={memoizedFilter}
              key={`timeline-${memoizedFilter.sortBy}`}
            />
          </div>

          <aside className="sticky bottom-0 sm:top-[6.5rem] md:top-[7rem] lg:top-[7.5rem] sm:h-[calc(100vh-6.5rem)] md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-7.5rem)] z-30 shadow-xl">
            <StatsPanel filter={memoizedFilter} />
          </aside>
        </div>
      </main>

      <div className="drawer z-50">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <Suspense
          fallback={
            <span className="loading loading-spinner loading-md"></span>
          }
        >
          {" "}
          <Drawer filter={memoizedFilter} onChange={setFilter} />
        </Suspense>
      </div>
      <UtilityMenu
        filter={memoizedFilter}
        setFilter={setFilter}
        onReset={handleReset}
        onSort={handleSort}
      />
    </>
  );
}
