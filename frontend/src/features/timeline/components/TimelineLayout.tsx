import { lazy, Suspense, useState } from "react";
import { Outlet } from "react-router";
import { AnimatePresence } from "framer-motion";
import TimelineHeader from "./TimelineHeader";
import TimelineStats from "./TimelineStats";
import { useTimelineFilter } from "../../../context/FilterContext";

const Drawer = lazy(() => import("../../../components/drawer/Drawer"));
const UtilityMenu = lazy(() => import("../../../components/ui/UtilityMenu"));

export default function TimelineLayout() {
  const { filter } = useTimelineFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <TimelineHeader filter={filter} />
      <main className="relative z-10 min-h-screen bg-canvas pt-[var(--timeline-header-height)]">
        <div className="relative mx-auto max-w-[1600px] lg:pl-[var(--timeline-sidebar-width)]">
          <TimelineStats filter={filter} />
          <section id="timeline-feed" aria-label="Historical timeline entries" className="min-w-0 px-4 pb-28 pt-4 sm:px-6 sm:pb-20 lg:px-7 lg:pt-6">
            <Outlet />
          </section>
        </div>

        <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-2 z-40 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
          <Suspense fallback={null}>
            <AnimatePresence>
              <UtilityMenu onOpenDrawer={() => setDrawerOpen(true)} />
            </AnimatePresence>
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <AnimatePresence>
          {drawerOpen && <Drawer key="timeline-drawer" isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
