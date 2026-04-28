import { jsxs, jsx } from "react/jsx-runtime";
import { c as useEra, u as useTimelineFilter, h as useToast, D as DEFAULT_TIMELINE_FILTER, i as SearchIcon, F as FilterIcon, j as SortIcon, C as CloseIcon, f as filterToSearchParams, d as getGroupSlugFromId } from "./server-build-Ce5HpZmf.js";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { h as hasActiveState } from "./filterUtils-CpAiJP_3.js";
import { IoMdShare, IoIosAdd } from "react-icons/io";
import { Link } from "react-router";
import "node:stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "@tanstack/react-query";
import "axios";
import "react-icons/gi";
import "graphql-request";
import "d3-geo";
import "d3-selection";
import "topojson-client";
import "d3-scale";
import "d3-transition";
import "react-icons/fa";
import "react-icons/lu";
import "react-icons/md";
import "masonic";
import "zod";
function UtilityMenu({ onOpenDrawer }) {
  const { view, setView } = useEra();
  const { filter, patchFilter, resetFilter } = useTimelineFilter();
  const { addToast } = useToast();
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [active, setActive] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const nextSearch = searchInput.trim() || void 0;
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
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (!searchInput.trim()) setActive(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [searchInput]);
  const hasActiveFilters = hasActiveState(filter);
  const filterCount = filter.type.length + filter.subject.length + filter.continent.length + (filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) + (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0) + (filter.group !== DEFAULT_TIMELINE_FILTER.group ? 1 : 0);
  const hoverAnim = {
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
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
      window.location.origin
    ).toString();
    try {
      if (typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function" && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        addToast({
          message: "Share link copied to clipboard",
          type: "success"
        });
        return;
      }
      addToast({
        message: "Clipboard not available",
        type: "error"
      });
    } catch {
      addToast({
        message: "Failed to copy link",
        type: "error"
      });
    }
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      ref: menuRef,
      layout: true,
      className: "flex flex-col mx-1 gap-2 py-2 sm:flex-row sm:mx-0 sm:gap-6 sm:px-4 sm:py-0 bg-gradient-to-br from-stone-800/90 to-stone-900/90 backdrop-blur-lg border border-stone-900 rounded-3xl",
      children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            layout: true,
            className: "flex items-center overflow-hidden",
            onClick: () => {
              if (!active) setActive(true);
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `${searchInput ? "text-gold" : "text-stone-200"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer`,
                  children: /* @__PURE__ */ jsx(SearchIcon, {})
                }
              ),
              /* @__PURE__ */ jsx(
                motion.input,
                {
                  ref: inputRef,
                  type: "search",
                  layout: true,
                  placeholder: "Search timeline...",
                  value: searchInput,
                  onChange: (e) => setSearchInput(e.target.value),
                  className: "bg-transparent outline-none text-sm text-stone-200 placeholder:text-stone-500 flex-1",
                  animate: {
                    opacity: active ? 1 : 0,
                    width: active ? 200 : 0,
                    marginLeft: active ? 4 : 0
                  },
                  style: { overflow: "hidden" },
                  transition: { duration: 0.2, ease: "easeOut" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            type: "button",
            className: `${filterCount > 0 ? "text-gold" : "text-stone-200"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer relative`,
            "aria-label": "Filter timeline",
            onClick: onOpenDrawer,
            ...hoverAnim,
            children: [
              /* @__PURE__ */ jsx(FilterIcon, {}),
              /* @__PURE__ */ jsx(AnimatePresence, { children: filterCount > 0 && /* @__PURE__ */ jsx(
                motion.span,
                {
                  className: "absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-gold text-stone-950",
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0, opacity: 0 },
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                  children: filterCount
                },
                "filter-count"
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.button,
          {
            className: `${filter.sortBy ? "text-stone-200" : "text-gold"} rounded-xl hover:bg-stone-700 p-2 cursor-pointer`,
            "aria-label": "Sort",
            onClick: () => patchFilter({ sortBy: !filter.sortBy }, { replace: true }),
            ...hoverAnim,
            children: /* @__PURE__ */ jsx(SortIcon, {})
          }
        ),
        /* @__PURE__ */ jsx(
          motion.button,
          {
            type: "button",
            className: "text-stone-200 rounded-xl hover:bg-stone-700 hover:text-gold p-2 cursor-pointer",
            "aria-label": "Share current timeline view",
            onClick: handleShare,
            ...hoverAnim,
            children: /* @__PURE__ */ jsx(IoMdShare, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            layout: true,
            ...hoverAnim,
            className: "rounded-xl text-gold hover:bg-stone-700",
            children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/articles/create",
                "aria-label": "Create post",
                className: "text-gold shadow-sm",
                children: /* @__PURE__ */ jsx(IoIosAdd, { className: "w-9 h-9" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: hasActiveFilters && /* @__PURE__ */ jsx(
          motion.button,
          {
            className: "rounded-xl hover:bg-stone-700 p-2 cursor-pointer text-gold",
            type: "button",
            onClick: () => {
              setView("global");
              resetFilter({ replace: true });
              setSearchInput("");
            },
            "aria-label": "Reset filters",
            layout: true,
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            ...hoverAnim,
            children: /* @__PURE__ */ jsx(CloseIcon, {})
          }
        ) })
      ]
    }
  );
}
export {
  UtilityMenu as default
};
