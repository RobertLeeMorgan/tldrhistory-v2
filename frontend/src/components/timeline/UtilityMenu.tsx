import type { TimelineFilter } from "../drawer/drawerTypes";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const UtilityMenuItems = lazy(() => import("./UtilityMenuItems"));

interface MenuProps {
  filter: TimelineFilter;
  setFilter: React.Dispatch<React.SetStateAction<TimelineFilter>>;
  onSort: () => void;
  onReset: () => void;
}

export default function UtilityMenu({
  filter,
  setFilter,
  onReset,
  onSort,
}: MenuProps) {
  return (
    <div className="fab fab-flower pb-20 sm:pb-2 sm:pr-12 z-45">
      {/* open menu */}
      <div className="tooltip" data-tip="Search, sort, filter">
        <motion.div
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-md sm:btn-lg btn-circle btn-secondary"
            aria-label="open utility menu"
          >
            <svg
              aria-label="New"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </motion.div>
      </div>
      <Suspense fallback={null}>
        <UtilityMenuItems
          filter={filter}
          setFilter={setFilter}
          onReset={onReset}
          onSort={onSort}
        />
      </Suspense>
    </div>
  );
}
