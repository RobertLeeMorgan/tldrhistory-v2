import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { D as DEFAULT_TIMELINE_FILTER, g as graphqlRequest, S as SAVE_FILTER_MUTATION, E as EDIT_SAVED_FILTER_MUTATION, a as DELETE_SAVED_FILTER_MUTATION, b as SAVED_FILTERS_QUERY, u as useTimelineFilter, c as useEra, p as parseView, f as filterToSearchParams, d as getGroupSlugFromId, t as themes, e as collapseData, B as Button } from "./server-build-FJRFwkCb.js";
import { AnimatePresence, motion } from "framer-motion";
import { h as hasActiveState } from "./filterUtils-87yPDh1_.js";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import "node:stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
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
import "react-icons/io";
function DrawerCheckbox({
  value,
  labelText,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      className: `btn btn-md m-1 border rounded-md  ${checked ? "bg-stone-950/40 border-gold text-gold shadow-sm shadow-stone-950/30 hover:bg-gold/10 hover:border-gold hover:text-gold/80" : "bg-drawer border-stone-600 text-stone-400 hover:text-stone-300 hover:bg-drawer/80 hover:border-stone-400"} transition-all duration-200 ease-in-out`,
      type: "checkbox",
      name: labelText,
      "aria-label": labelText,
      value,
      checked,
      onChange: (e) => onChange(e.target.checked)
    }
  );
}
function DrawerCollapse({
  title,
  children,
  count
}) {
  return /* @__PURE__ */ jsxs("div", { className: "collapse bg-drawer", children: [
    /* @__PURE__ */ jsx("input", { type: "checkbox", className: "peer", name: title, "aria-label": title }),
    /* @__PURE__ */ jsxs("div", { className: "collapse-title text-lg font-medium text-stone-200 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: title }),
      count !== void 0 && count > 0 && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-900 font-medium", children: count > 9 ? "9+" : count })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "collapse-content", children })
  ] });
}
function DrawerInput({
  value,
  onChange,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      value,
      name: props.name,
      "aria-label": props.name,
      className: `input input-bordered w-full bg-drawer border-stone-600 text-stone-100 caret-stone-100 mb-2 ${className ?? ""}`,
      onChange: (e) => onChange(e.target.value)
    }
  );
}
function parseYearInput(raw, min, max) {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-") {
    return void 0;
  }
  if (!/^-?\d+$/.test(trimmed)) {
    return "invalid";
  }
  const num = Number(trimmed);
  if (!Number.isInteger(num) || num < min || num > max) {
    return "invalid";
  }
  return num;
}
function getThemeCount(filter) {
  return filter.group !== 0 ? 1 : 0;
}
function getSectionCount(filter, section) {
  return section.options.reduce((acc, opt) => {
    const arr = filter[opt.name];
    return acc + (arr?.includes(opt.value) ? 1 : 0);
  }, 0);
}
function getDateCount(filter) {
  return (filter.yearStart !== DEFAULT_TIMELINE_FILTER.yearStart ? 1 : 0) + (filter.yearEnd !== DEFAULT_TIMELINE_FILTER.yearEnd ? 1 : 0);
}
function useDrawerYearInputs({ filter, patchFilter }) {
  const [yearStartInput, setYearStartInput] = useState(
    filter.yearStart !== void 0 ? String(filter.yearStart) : ""
  );
  const [yearEndInput, setYearEndInput] = useState(
    filter.yearEnd !== void 0 ? String(filter.yearEnd) : ""
  );
  useEffect(() => {
    const next = filter.yearStart !== void 0 ? String(filter.yearStart) : "";
    if (next !== yearStartInput) {
      setYearStartInput(next);
    }
  }, [filter.yearStart]);
  useEffect(() => {
    const next = filter.yearEnd !== void 0 ? String(filter.yearEnd) : "";
    if (next !== yearEndInput) {
      setYearEndInput(next);
    }
  }, [filter.yearEnd]);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const nextStart = parseYearInput(yearStartInput, -3e5, 2025);
      const nextEnd = parseYearInput(yearEndInput, -3e5, 2025);
      if (nextStart === "invalid" || nextEnd === "invalid") return;
      if (nextStart !== void 0 && nextEnd !== void 0 && nextEnd < nextStart) {
        return;
      }
      const patch = {};
      if (nextStart !== filter.yearStart) {
        patch.yearStart = nextStart;
      }
      if (nextEnd !== filter.yearEnd) {
        patch.yearEnd = nextEnd;
      }
      if (Object.keys(patch).length > 0) {
        patchFilter(patch);
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [
    yearStartInput,
    yearEndInput,
    filter.yearStart,
    filter.yearEnd,
    patchFilter
  ]);
  return {
    yearStartInput,
    yearEndInput,
    setYearStartInput,
    setYearEndInput
  };
}
function useSaveFilterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      SAVE_FILTER_MUTATION,
      variables
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savedFilters"] });
    }
  });
}
function useEditSavedFilterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      EDIT_SAVED_FILTER_MUTATION,
      variables
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savedFilters"] });
    }
  });
}
function useDeleteSavedFilterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      DELETE_SAVED_FILTER_MUTATION,
      variables
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savedFilters"] });
    }
  });
}
function useSavedFiltersQuery(variables) {
  return useQuery({
    queryKey: ["savedFilters", null],
    queryFn: () => graphqlRequest(
      SAVED_FILTERS_QUERY,
      {}
    ),
    staleTime: 1e3 * 60 * 5,
    placeholderData: (prev) => prev
  });
}
function normalizeName(name) {
  return name.trim();
}
function normalizeView(view) {
  return view === "global" ? null : view;
}
function isSameArray(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
function isActiveSavedFilter(saved, current) {
  return isSameArray(saved.state.type, current.type) && isSameArray(saved.state.subject, current.subject) && isSameArray(saved.state.continent, current.continent) && saved.state.yearStart === current.yearStart && saved.state.yearEnd === current.yearEnd && (saved.state.search ?? void 0) === (current.search ?? void 0) && (saved.state.sortBy ?? true) === (current.sortBy ?? true) && (saved.state.group ?? 0) === (current.group ?? 0);
}
function SavedFilters() {
  const { filter } = useTimelineFilter();
  const { view, setView } = useEra();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data } = useSavedFiltersQuery();
  const savedFilters = data?.savedFilters ?? [];
  const saveFilterMutation = useSaveFilterMutation();
  const editSavedFilterMutation = useEditSavedFilterMutation();
  const deleteSavedFilterMutation = useDeleteSavedFilterMutation();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const currentState = {
    type: filter.type,
    subject: filter.subject,
    continent: filter.continent,
    yearStart: filter.yearStart ?? -3e5,
    yearEnd: filter.yearEnd ?? 2025,
    search: filter.search ?? void 0,
    sortBy: filter.sortBy ?? true,
    group: filter.group,
    view: normalizeView(view)
  };
  const hasActiveFilters = hasActiveState(filter);
  const matchingSavedFilter = savedFilters.find(
    (saved) => isActiveSavedFilter(saved, currentState)
  );
  const canCreate = hasActiveFilters && savedFilters.length < 3 && !matchingSavedFilter;
  const handleApply = (saved, includeView = false) => {
    const nextFilter = {
      type: saved.state.type,
      subject: saved.state.subject,
      continent: saved.state.continent,
      yearStart: saved.state.yearStart ?? -3e5,
      yearEnd: saved.state.yearEnd ?? 2025,
      search: saved.state.search ?? void 0,
      sortBy: saved.state.sortBy ?? true,
      group: saved.state.group ?? 0
    };
    if (includeView) {
      const nextView = parseView(saved.state.view ?? null) ?? "global";
      setView(nextView);
    }
    const params = filterToSearchParams(nextFilter, searchParams);
    const slug = getGroupSlugFromId(nextFilter.group);
    const pathname = slug ? `/timeline/${slug}` : "/timeline";
    navigate(
      {
        pathname,
        search: params.toString() ? `?${params.toString()}` : ""
      },
      { replace: true }
    );
  };
  const handleStartCreate = () => {
    setIsCreating(true);
    setNewName("");
    setEditingId(null);
    setEditingName("");
  };
  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewName("");
  };
  const handleSaveCreate = () => {
    const name = normalizeName(newName);
    if (!name) return;
    saveFilterMutation.mutate(
      {
        input: {
          name,
          state: currentState
        }
      },
      {
        onSuccess: () => {
          setIsCreating(false);
          setNewName("");
        }
      }
    );
  };
  const handleStartRename = (id, name) => {
    setEditingId(id);
    setEditingName(name);
    setIsCreating(false);
    setNewName("");
  };
  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };
  const handleSaveRename = (id) => {
    const name = normalizeName(editingName);
    if (!name) return;
    editSavedFilterMutation.mutate(
      {
        input: {
          id,
          name
        }
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingName("");
        }
      }
    );
  };
  if (!savedFilters.length && !canCreate && !isCreating) {
    return null;
  }
  return /* @__PURE__ */ jsx(DrawerCollapse, { title: "Saved Filters", count: savedFilters.length, children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    savedFilters.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: savedFilters.map((saved) => {
      const isEditing = editingId === saved.id;
      const isActive = isActiveSavedFilter(saved, currentState);
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `rounded-lg border px-3 py-2 ${isActive ? "border-stone-500 bg-stone-700/60" : "border-stone-700 bg-stone-800/40"}`,
          children: isEditing ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: editingName,
                onChange: (e) => setEditingName(e.target.value),
                className: "input input-sm w-full bg-drawer border-stone-600 text-stone-200",
                maxLength: 50,
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-stone-200",
                  onClick: () => handleSaveRename(saved.id),
                  disabled: editSavedFilterMutation.isPending,
                  children: "Save"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-stone-400",
                  onClick: handleCancelRename,
                  children: "Cancel"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "flex-1 min-w-0 text-left",
                onClick: () => handleApply(saved, false),
                children: [
                  /* @__PURE__ */ jsx("div", { className: "truncate text-sm text-stone-100", children: saved.name }),
                  isActive && /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] text-stone-400", children: "Active" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-stone-400 hover:text-stone-200",
                  onClick: () => handleStartRename(saved.id, saved.name),
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-red-300 hover:text-red-200",
                  onClick: () => deleteSavedFilterMutation.mutate({
                    input: { id: saved.id }
                  }),
                  disabled: deleteSavedFilterMutation.isPending,
                  children: "Delete"
                }
              ),
              saved.state.view && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs text-gold hover:text-gold-hover",
                  onClick: () => handleApply(saved, true),
                  title: "Apply filter + view",
                  children: "↻"
                }
              )
            ] })
          ] })
        },
        saved.id
      );
    }) }),
    isCreating ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-stone-600 px-3 py-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: newName,
          onChange: (e) => setNewName(e.target.value),
          placeholder: "Filter name",
          className: "input input-sm w-full bg-drawer border-stone-600 text-stone-200",
          maxLength: 50,
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "text-xs text-stone-200",
            onClick: handleSaveCreate,
            disabled: saveFilterMutation.isPending,
            children: "Save"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "text-xs text-stone-400",
            onClick: handleCancelCreate,
            children: "Cancel"
          }
        )
      ] })
    ] }) : canCreate ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "w-full rounded-lg border border-dashed border-stone-600 px-3 py-2 text-left text-sm text-stone-300 hover:border-stone-500 hover:text-stone-100",
        onClick: handleStartCreate,
        children: "+ Save current filter"
      }
    ) : null,
    savedFilters.length >= 3 && /* @__PURE__ */ jsx("p", { className: "text-xs text-stone-500", children: "You can save up to 3 filters for now." })
  ] }) });
}
function Drawer({ isOpen, onClose }) {
  const { filter, patchFilter, resetFilter } = useTimelineFilter();
  const {
    yearStartInput,
    yearEndInput,
    setYearStartInput,
    setYearEndInput
  } = useDrawerYearInputs({ filter, patchFilter });
  const updateArrayFilter = (key, value, checked) => {
    const current = filter[key] || [];
    const next = checked ? [...current, value] : current.filter((v) => v !== value);
    patchFilter({ [key]: next });
  };
  const updateValueFilter = (key, raw) => {
    {
      const num = raw.trim() === "" ? void 0 : Number(raw);
      patchFilter({ [key]: num });
      return;
    }
  };
  const themeCount = getThemeCount(filter);
  const dateCount = getDateCount(filter);
  const hasActiveFilters = hasActiveState(filter);
  const handleReset = () => {
    resetFilter();
    setYearStartInput(String(DEFAULT_TIMELINE_FILTER.yearStart));
    setYearEndInput(String(DEFAULT_TIMELINE_FILTER.yearEnd));
  };
  return createPortal(
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "fixed inset-0 z-[60] bg-stone-950/30",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: onClose,
          "aria-label": "Close filters"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.aside,
        {
          className: "fixed inset-y-0 left-0 z-[65] w-80 bg-drawer text-stone-200 shadow-2xl shadow-stone-950/50",
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
          transition: { type: "tween", duration: 0.24, ease: "easeOut" },
          children: /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto p-4 pt-10", children: [
            /* @__PURE__ */ jsx(DrawerCollapse, { title: "Theme", count: themeCount, children: /* @__PURE__ */ jsxs(
              "select",
              {
                value: filter.group ?? 0,
                onChange: (e) => updateValueFilter("group", e.target.value),
                className: "select select-bordered w-full bg-drawer border-stone-600 text-stone-200",
                "aria-label": "Theme Select",
                name: "Theme",
                children: [
                  /* @__PURE__ */ jsx("option", { value: 0, children: "Select Theme" }),
                  themes.options.map((c) => /* @__PURE__ */ jsx(
                    "option",
                    {
                      value: c.value,
                      "aria-label": c.labelText,
                      children: c.labelText
                    },
                    c.value
                  ))
                ]
              }
            ) }),
            collapseData.map((section) => /* @__PURE__ */ jsx(
              DrawerCollapse,
              {
                title: section.title,
                count: getSectionCount(filter, section),
                children: section.options.map((opt) => /* @__PURE__ */ jsx(
                  DrawerCheckbox,
                  {
                    value: opt.value,
                    labelText: opt.labelText,
                    checked: filter[opt.name]?.includes(opt.value) ?? false,
                    onChange: (checked) => updateArrayFilter(
                      opt.name,
                      opt.value,
                      checked
                    )
                  },
                  opt.value
                ))
              },
              section.title
            )),
            /* @__PURE__ */ jsxs(DrawerCollapse, { title: "Date Range", count: dateCount, children: [
              /* @__PURE__ */ jsx(
                DrawerInput,
                {
                  type: "text",
                  inputMode: "numeric",
                  pattern: "-?[0-9]*",
                  name: "start",
                  placeholder: "Start",
                  className: "w-full max-w-xs mb-2",
                  value: yearStartInput,
                  onChange: (val) => {
                    if (/^-?\d*$/.test(val)) {
                      setYearStartInput(val);
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                DrawerInput,
                {
                  type: "text",
                  inputMode: "numeric",
                  pattern: "-?[0-9]*",
                  name: "end",
                  placeholder: "End",
                  className: "w-full max-w-xs",
                  value: yearEndInput,
                  onChange: (val) => {
                    if (/^-?\d*$/.test(val)) {
                      setYearEndInput(val);
                    }
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx(SavedFilters, {}),
            /* @__PURE__ */ jsx("div", { className: "min-h-20 flex items-center pt-4", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: hasActiveFilters ? /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "w-full px-4",
                initial: { opacity: 0, y: 2 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 2 },
                children: /* @__PURE__ */ jsx(Button, { label: "Clear Filters", onClick: handleReset })
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full px-4 invisible", children: /* @__PURE__ */ jsx(Button, { label: "Clear Filters", onClick: () => {
            } }) }) }) })
          ] })
        }
      )
    ] }) }),
    document.body
  );
}
export {
  Drawer as default
};
