import { Outlet } from "react-router-dom";
import Nav from "../components/ui/Nav";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { prefetchTimeline } from "../features/timeline/hooks/prefetchTimeline";
import { DEFAULT_TIMELINE_FILTER } from "../features/filter/components/TimelineFilter";

export default function RootLayout() {
  useEffect(() => {
    void prefetchTimeline({
      filter: DEFAULT_TIMELINE_FILTER,
      viewerKey: "anonymous",
    });
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      <Nav />
      <motion.div
        className="flex-1 relative z-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}