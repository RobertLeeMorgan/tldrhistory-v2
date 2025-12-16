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
    ]
  );

  return (
    <>
      <main className="flex flex-col min-h-screen bg-base-100 w-full">
        <EraHeader filter={memoizedFilter} />

        <div className="flex-1 p-2">
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 h-full">
            <div className="flex flex-col min-h-0 overflow-y-auto">
              <Timeline
                filter={memoizedFilter}
                key={`timeline-${memoizedFilter.sortBy}`}
              />
            </div>
            <aside className="sticky bottom-0 sm:top-32 sm:m-0 -m-2 self-start z-30 pt-2 pr-2">
              <StatsPanel filter={memoizedFilter} />
            </aside>
          </div>
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
