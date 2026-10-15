import { lazy, Suspense, useState } from "react";
import { Outlet } from "react-router";
import TimelineHeader from "./TimelineHeader";
import TimelineStats from "./TimelineStats";
import TimelineToolbar from "./TimelineToolbar";
import { useTimelineFilter } from "../../../context/FilterContext";

const Drawer = lazy(() => import("../../../components/drawer/Drawer"));

export default function TimelineLayout() {
  const { filter } = useTimelineFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <TimelineHeader filter={filter} />
      <main className="relative z-10 min-h-screen bg-canvas pt-[var(--timeline-header-height)]">
        <div className="relative mx-auto max-w-[1600px] sm:pl-[var(--timeline-sidebar-width)]">
          <TimelineStats filter={filter} />
          <section id="timeline-feed" aria-label="Historical timeline entries" className="min-w-0 px-4 pb-40 sm:px-6 lg:px-7 lg:pb-20">
            <TimelineToolbar onOpenDrawer={() => setDrawerOpen(true)} />
            <Outlet />
          </section>
        </div>
      </main>

      <Suspense fallback={null}>
        {drawerOpen && <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      </Suspense>
    </>
  );
}
