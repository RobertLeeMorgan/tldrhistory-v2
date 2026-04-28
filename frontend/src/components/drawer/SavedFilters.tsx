import { useState } from "react";
import DrawerCollapse from "./DrawerCollapse";
import { useTimelineFilter } from "../../context/FilterContext";
import { hasActiveState } from "../../utils/filterUtils";
import {
  type SaveFilterInput,
  type SavedFiltersQuery,
} from "../../generated/graphql";
import {
  useDeleteSavedFilterMutation,
  useEditSavedFilterMutation,
  useSaveFilterMutation,
} from "../../features/filter/hooks/useSavedFilters";
import { useSavedFiltersQuery } from "../../features/filter/hooks/useSavedFilterQueries";
import { useNavigate, useSearchParams } from "react-router";
import { filterToSearchParams } from "../../features/filter/components/timelineFilterParams";
import { getGroupSlugFromId } from "../../utils/groupLookup";
import { useEra } from "../../context/EraContext";
import { parseView } from "../../utils/rangeViews";

type SavedFilter = SavedFiltersQuery["savedFilters"][number];

function normalizeName(name: string) {
  return name.trim();
}

function normalizeView(view: any) {
  return view === "global" ? null : view;
}

function isSameArray<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function isActiveSavedFilter(
  saved: SavedFilter,
  current: SaveFilterInput["state"],
) {
  return (
    isSameArray(saved.state.type, current.type) &&
    isSameArray(saved.state.subject, current.subject) &&
    isSameArray(saved.state.continent, current.continent) &&
    saved.state.yearStart === current.yearStart &&
    saved.state.yearEnd === current.yearEnd &&
    (saved.state.search ?? undefined) === (current.search ?? undefined) &&
    (saved.state.sortBy ?? true) === (current.sortBy ?? true) &&
    (saved.state.group ?? 0) === (current.group ?? 0)
  );
}

export default function SavedFilters() {
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const currentState: SaveFilterInput["state"] = {
    type: filter.type,
    subject: filter.subject,
    continent: filter.continent,
    yearStart: filter.yearStart ?? -300000,
    yearEnd: filter.yearEnd ?? 2025,
    search: filter.search ?? undefined,
    sortBy: filter.sortBy ?? true,
    group: filter.group,
    view: normalizeView(view),
  };

  const hasActiveFilters = hasActiveState(filter);

  const matchingSavedFilter = savedFilters.find((saved) =>
    isActiveSavedFilter(saved, currentState),
  );

  const canCreate =
    hasActiveFilters && savedFilters.length < 3 && !matchingSavedFilter;

  const handleApply = (saved: SavedFilter, includeView = false) => {
    const nextFilter = {
      type: saved.state.type,
      subject: saved.state.subject,
      continent: saved.state.continent,
      yearStart: saved.state.yearStart ?? -300000,
      yearEnd: saved.state.yearEnd ?? 2025,
      search: saved.state.search ?? undefined,
      sortBy: saved.state.sortBy ?? true,
      group: saved.state.group ?? 0,
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
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true },
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
          state: currentState,
        },
      },
      {
        onSuccess: () => {
          setIsCreating(false);
          setNewName("");
        },
      },
    );
  };

  const handleStartRename = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setIsCreating(false);
    setNewName("");
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveRename = (id: number) => {
    const name = normalizeName(editingName);
    if (!name) return;

    editSavedFilterMutation.mutate(
      {
        input: {
          id,
          name,
        },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingName("");
        },
      },
    );
  };

  if (!savedFilters.length && !canCreate && !isCreating) {
    return null;
  }

  return (
    <DrawerCollapse title="Saved Filters" count={savedFilters.length}>
      <div className="space-y-3">
        {savedFilters.length > 0 && (
          <div className="space-y-2">
            {savedFilters.map((saved) => {
              const isEditing = editingId === saved.id;
              const isActive = isActiveSavedFilter(saved, currentState);

              return (
                <div
                  key={saved.id}
                  className={`rounded-lg border px-3 py-2 ${
                    isActive
                      ? "border-stone-500 bg-stone-700/60"
                      : "border-stone-700 bg-stone-800/40"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="input input-sm w-full bg-drawer border-stone-600 text-stone-200"
                        maxLength={50}
                        autoFocus
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs text-stone-200"
                          onClick={() => handleSaveRename(saved.id)}
                          disabled={editSavedFilterMutation.isPending}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="text-xs text-stone-400"
                          onClick={handleCancelRename}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        className="flex-1 min-w-0 text-left"
                        onClick={() => handleApply(saved, false)}
                      >
                        <div className="truncate text-sm text-stone-100">
                          {saved.name}
                        </div>
                        {isActive && (
                          <div className="mt-1 text-[11px] text-stone-400">
                            Active
                          </div>
                        )}
                      </button>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="text-xs text-stone-400 hover:text-stone-200"
                          onClick={() =>
                            handleStartRename(saved.id, saved.name)
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs text-red-300 hover:text-red-200"
                          onClick={() =>
                            deleteSavedFilterMutation.mutate({
                              input: { id: saved.id },
                            })
                          }
                          disabled={deleteSavedFilterMutation.isPending}
                        >
                          Delete
                        </button>
                        {saved.state.view && (
                          <button
                            type="button"
                            className="text-xs text-gold hover:text-gold-hover"
                            onClick={() => handleApply(saved, true)}
                            title="Apply filter + view"
                          >
                            ↻
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isCreating ? (
          <div className="rounded-lg border border-dashed border-stone-600 px-3 py-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Filter name"
              className="input input-sm w-full bg-drawer border-stone-600 text-stone-200"
              maxLength={50}
              autoFocus
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="text-xs text-stone-200"
                onClick={handleSaveCreate}
                disabled={saveFilterMutation.isPending}
              >
                Save
              </button>
              <button
                type="button"
                className="text-xs text-stone-400"
                onClick={handleCancelCreate}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : canCreate ? (
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-stone-600 px-3 py-2 text-left text-sm text-stone-300 hover:border-stone-500 hover:text-stone-100"
            onClick={handleStartCreate}
          >
            + Save current filter
          </button>
        ) : null}

        {savedFilters.length >= 3 && (
          <p className="text-xs text-stone-500">
            You can save up to 3 filters for now.
          </p>
        )}
      </div>
    </DrawerCollapse>
  );
}
