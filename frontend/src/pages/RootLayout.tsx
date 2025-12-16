import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { prefetchInitialTimeline } from "../hooks/prefetchTimeline";

export default function RootLayout() {
  const location = useLocation();

  const filter = useMemo(
    () => ({
      type: [],
      subject: [],
      continent: [],
      yearStart: undefined,
      yearEnd: undefined,
      search: "",
      sortBy: true,
      group: 0,
    }),
    []
  );

  useEffect(() => {
    prefetchInitialTimeline(filter);
  }, [filter]);

  return (
    <>
      <Nav />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        theme="dark"
      />
    </>
  );
}
