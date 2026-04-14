import { CloseIcon, FilterIcon, SearchIcon, SortIcon } from "../../icons/icons";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { hasActiveState } from "../../utils/filterUtils";
import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useTimelineFilter } from "../../context/FilterContext";
import { DEFAULT_TIMELINE_FILTER } from "../../features/filter/components/TimelineFilter";

export default function UtilityMenu() {
  const { filter, patchFilter, resetFilter } = useTimelineFilter();

  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(filter.search ?? "");
  }, [filter.search]);

  useEffect(() => {
    const id = setTimeout(() => {
      const nextSearch = searchInput.trim() || undefined;

      if (filter.search === nextSearch) return;

      patchFilter({ search: nextSearch });
    }, 300);

    return () => clearTimeout(id);
  }, [searchInput, filter.search, patchFilter]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const hasActiveFilters = hasActiveState(filter);

  const filterCount =
    filter.type.length +
    filter.subject.length +
    filter.continent.length +
    (filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) +
    (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0) +
    (filter.group !== DEFAULT_TIMELINE_FILTER.group ? 1 : 0);

  const hoverAnim: {
    whileHover: { scale: number };
    transition: Transition;
  } = {
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  return (
    <motion.div
      ref={menuRef}
      layout
      className="flex flex-col mx-1 gap-2 sm:gap-4 py-2 sm:flex-row sm:gap-6 sm:mx-0 sm:py-0 sm:px-4 bg-gradient-to-br from-stone-800/90 to-stone-900/90 backdrop-blur-lg border border-stone-900 rounded-3xl"
    >
      <motion.div
        layout
        className="flex items-center overflow-hidden"
        onClick={() => {
          if (!active) setActive(true);
        }}
      >
        <div
          className={`${filter.search ? "text-gold" : "text-stone-200"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer`}
        >
          <SearchIcon />
        </div>

        <motion.input
          ref={inputRef}
          type="search"
          layout
          placeholder="Search timeline..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-transparent outline-none text-sm text-stone-200 placeholder:text-stone-500 flex-1"
          animate={{
            opacity: active ? 1 : 0,
            maxWidth: active ? 200 : 0,
            paddingLeft: active ? "0.5rem" : 0,
            paddingRight: active ? "0.5rem" : 0,
          }}
          style={{ overflow: "hidden" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      <motion.label
        className={`${filterCount > 0 ? "text-gold" : "text-stone-200"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer relative`}
        aria-label="Filter timeline"
        htmlFor="my-drawer"
        {...hoverAnim}
      >
        <FilterIcon />
        <AnimatePresence>
          {filterCount > 0 && (
            <motion.span
              key="filter-count"
              className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-gold text-stone-950"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {filterCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.label>

      <motion.button
        className={`${filter.sortBy ? "text-stone-200" : "text-gold"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer`}
        aria-label="Sort"
        onClick={() => patchFilter({ sortBy: !filter.sortBy })}
        {...hoverAnim}
      >
        <SortIcon />
      </motion.button>

      <motion.div
        layout
        {...hoverAnim}
        className="rounded-xl text-gold hover:bg-stone-700"
      >
        <Link
          to="/create"
          aria-label="Create post"
          className="text-gold shadow-sm"
        >
          <IoIosAdd className="w-9 h-9" />
        </Link>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {hasActiveFilters && (
          <motion.button
            className="rounded-xl hover:bg-stone-700 p-2 cursor-pointer text-gold"
            type="button"
            onClick={() => {
              resetFilter();
              setSearchInput("");
            }}
            aria-label="Reset filters"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            {...hoverAnim}
          >
            <CloseIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
