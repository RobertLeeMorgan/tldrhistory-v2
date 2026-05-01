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
      <TimelineStats filter={filter} />

      <main
        className="
          relative z-10
          pt-[8rem]
          sm:pt-[var(--header-height-sm)]
          md:pt-[var(--header-height-md)]
          lg:pt-[var(--header-height-lg)]

          pb-32
          sm:pb-6

          sm:pr-[min(34vw,420px)]
          md:pr-[min(32vw,440px)]
          lg:pr-[min(30vw,460px)]
        "
      >
        <div className="fixed inset-0 z-0 bg-base" />
        <div className="relative z-10 p-4 sm:p-6">
          <Outlet />
        </div>

        <div className="fixed z-40 right-1 bottom-[calc(7rem+env(safe-area-inset-bottom))] sm:right-auto sm:top-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2">
          <Suspense fallback={null}>
            <AnimatePresence>
              <UtilityMenu onOpenDrawer={() => setDrawerOpen(true)} />
            </AnimatePresence>
          </Suspense>
        </div>
      </main>

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
