import { IoIosRemove } from "react-icons/io";
import { CloseIcon, FilterIcon, SearchIcon, SortIcon } from "../../icons/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TimelineFilter } from "../drawer/drawerTypes";

interface MenuProps {
  filter: TimelineFilter;
  setFilter: React.Dispatch<React.SetStateAction<TimelineFilter>>;
  onSort: () => void;
  onReset: () => void;
}

export default function UtilityMenuItems({ filter, setFilter, onReset, onSort }: MenuProps) {
  const [searchInput, setSearchInput] = useState(filter.search ?? "");

  useEffect(() => {
    const id = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        search: searchInput || undefined,
      }));
    }, 300);

    return () => clearTimeout(id);
  }, [searchInput, setFilter]);
  return (
    <>
      {/* Main Action button replaces the original button when FAB is open */}
      <div className="fab-close pb-20 sm:pb-2 pr-2 sm:pr-12">
        <motion.div
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <span className="btn btn-circle btn-md sm:btn-lg btn-error z-50">
            <CloseIcon />
          </span>
        </motion.div>
      </div>
      {/* buttons that show up when FAB is open */}
      <div className="pointer-events-auto">
        <label className="btn btn-lg btn-circle overflow-hidden absolute bottom-0 right-0 transition-all duration-200 focus-within:w-48 bg-slate-800">
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <SearchIcon />
          </motion.div>
          <input
            name="search"
            type="search"
            aria-label="search input"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="opacity-0 w-0 focus:w-40 focus:opacity-100 transition-all duration-300 bg-transparent outline-none focus:px-2"
          />
        </label>
      </div>
      <div className="tooltip tooltip-left" data-tip="Filter">
        <label
          htmlFor="my-drawer"
          className="btn btn-lg btn-circle bg-slate-800"
          aria-label="Filter timeline"
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <FilterIcon />
          </motion.div>
        </label>
      </div>
      <div className="tooltip" data-tip="Sort">
        <button className="btn btn-lg btn-circle bg-slate-800" onClick={onSort}>
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
            }}
            aria-label="sort"
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <SortIcon />
          </motion.div>
        </button>
      </div>
      <div className="tooltip" data-tip="Clear Filters">
        <button
          className="btn btn-lg btn-circle text-3xl bg-slate-800"
          onClick={onReset}
          aria-label="reset"
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <IoIosRemove />
          </motion.div>
        </button>
      </div>
    </>
  );
}
