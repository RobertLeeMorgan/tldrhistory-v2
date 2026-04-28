import { Outlet } from "react-router";
import TimelineHeader from "./TimelineHeader";
import TimelineStats from "./TimelineStats";
import { Suspense, lazy, useState } from "react";
import { useTimelineFilter } from "../../../context/FilterContext";
import { AnimatePresence } from "framer-motion";

const Drawer = lazy(() => import("../../../components/drawer/Drawer"));
const UtilityMenu = lazy(() => import("../../../components/ui/UtilityMenu"));

export default function TimelineLayout() {
  const { filter } = useTimelineFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <TimelineHeader filter={filter} />

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] w-full bg-base">
        <div className="flex flex-col relative">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>

          <div className="flex fixed z-40 right-0 top-1/2 -translate-y-1/10 sm:translate-y-0 sm:right-auto sm:top-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-4">
            <Suspense fallback={null}>
              <UtilityMenu onOpenDrawer={() => setDrawerOpen(true)} />
            </Suspense>
          </div>
        </div>

        <TimelineStats filter={filter} />
      </div>

      <Suspense fallback={null}>
        <AnimatePresence>
          {drawerOpen && (
            <Drawer
              key="timeline-drawer"
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
