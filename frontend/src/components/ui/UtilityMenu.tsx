import { CloseIcon, FilterIcon, SearchIcon, SortIcon } from "../../icons/icons";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { hasActiveState } from "../../utils/filterUtils";
import { IoIosAdd } from "react-icons/io";
import { IoMdShare } from "react-icons/io";
import { Link } from "react-router";
import { useTimelineFilter } from "../../context/FilterContext";
import { DEFAULT_TIMELINE_FILTER } from "../../features/filter/components/TimelineFilter";
import { useToast } from "../../context/ToastContext";
import { useEra } from "../../context/EraContext";
import { getGroupSlugFromId } from "../../utils/groupLookup";
import { filterToSearchParams } from "../../features/filter/components/timelineFilterParams";

type UtilityMenuProps = {
  onOpenDrawer: () => void;
};

export default function UtilityMenu({ onOpenDrawer }: UtilityMenuProps) {
  const { view, setView } = useEra();
  const { filter, patchFilter, resetFilter } = useTimelineFilter();
  const { addToast } = useToast();

  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [active, setActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const nextSearch = searchInput.trim() || undefined;
      if (nextSearch !== filter.search) {
        patchFilter({ search: nextSearch }, { replace: true });
      }
    }, 300);

    return () => window.clearTimeout(id);
  }, [searchInput, filter.search, patchFilter]);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (!searchInput.trim()) setActive(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [searchInput]);

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

 async function handleShare() {
    const params = filterToSearchParams(filter, new URLSearchParams());

    if (view !== "global") {
      params.set("v", view);
    }

    const slug = getGroupSlugFromId(filter.group);
    const pathname = slug ? `/timeline/${slug}` : "/timeline";

    const shareUrl = new URL(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      window.location.origin,
    ).toString();

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.writeText === "function" &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(shareUrl);
        addToast({
          message: "Share link copied to clipboard",
          type: "success",
        });
        return;
      }

      addToast({
        message: "Clipboard not available",
        type: "error",
      });
    } catch {
      addToast({
        message: "Failed to copy link",
        type: "error",
      });
    }
  }

  return (
    <motion.div
      ref={menuRef}
      layout
      className="flex flex-col mx-1 gap-2 py-2 sm:flex-row sm:mx-0 sm:gap-6 sm:px-4 sm:py-0 bg-gradient-to-br from-stone-800/90 to-stone-900/90 backdrop-blur-lg border border-stone-900 rounded-3xl"
    >
      <motion.div
        layout
        className="flex items-center overflow-hidden"
        onClick={() => {
          if (!active) setActive(true);
        }}
      >
        <div
          className={`${searchInput ? "text-gold" : "text-stone-200"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer`}
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
            width: active ? 200 : 0,
            marginLeft: active ? 4 : 0,
          }}
          style={{ overflow: "hidden" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      <motion.button
        type="button"
        className={`${filterCount > 0 ? "text-gold" : "text-stone-200"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer relative`}
        aria-label="Filter timeline"
        onClick={onOpenDrawer}
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
      </motion.button>

      <motion.button
        className={`${filter.sortBy ? "text-stone-200" : "text-gold"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer`}
        aria-label="Sort"
        onClick={() =>
          patchFilter({ sortBy: !filter.sortBy }, { replace: true })
        }
        {...hoverAnim}
      >
        <SortIcon />
      </motion.button>

      <motion.button
        type="button"
        className="text-stone-200 rounded-xl hover:bg-stone-700 hover:text-gold p-2 cursor-pointer"
        aria-label="Share current timeline view"
        onClick={handleShare}
        {...hoverAnim}
      >
        <IoMdShare className="w-5 h-5" />
      </motion.button>

      <motion.div
        layout
        {...hoverAnim}
        className="rounded-xl text-gold hover:bg-stone-700"
      >
        <Link
          to="/articles/create"
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
              setView("global")
              resetFilter({ replace: true });
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
