import TimelineHeader from "./TimelineHeader";
import Timeline from "./Timeline";
import { Suspense, lazy } from "react";
import TimelineStats from "./TimelineStats";
import DrawerPortal from "../../../components/drawer/DrawerPortal";
import { useTimelineFilter } from "../../../context/FilterContext";

const Drawer = lazy(() => import("../../../components/drawer/Drawer"));
const UtilityMenu = lazy(() => import("../../../components/ui/UtilityMenu"));

export default function TimelinePageContent() {
  const { filter} = useTimelineFilter();

  return (
    <>
      <TimelineHeader filter={filter} />

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] w-full bg-base">
        <div className="flex flex-col relative">
          <div className="p-4 sm:p-6">
            <Timeline filter={filter} key={`timeline-${filter.sortBy}`} />
          </div>

          <div className="flex fixed z-40 right-0 top-1/2 -translate-y-1/10 sm:translate-y-0 sm:right-auto sm:top-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-4">
            <Suspense fallback={null}>
              <UtilityMenu />
            </Suspense>
          </div>
        </div>

        <TimelineStats filter={filter} />
      </div>

      <DrawerPortal>
        <div className="drawer z-50">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <Suspense
            fallback={
              <span className="loading loading-spinner loading-md"></span>
            }
          >
            <Drawer />
          </Suspense>
        </div>
      </DrawerPortal>
    </>
  );
}