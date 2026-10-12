import { useState } from "react";
import Skeleton from "../ui/Skeleton";
import TimelineTabs from "../ui/TimelineTabs";

export interface TabConfig<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface TabbedTimelineProps<T extends string, Item> {
  tabs: TabConfig<T>[];
  items: Item[];
  activeTab?: T;
  onTabChange?: (tab: T) => void;
  getItemKey: (item: Item, index: number) => React.Key;
  renderCard: (item: Item) => React.ReactNode;
  renderEmpty?: (activeTab: T) => React.ReactNode;
  isLoading: boolean;
  isError?: boolean;
  className?: string;
}

export default function TabbedTimeline<T extends string, Item>({
  tabs,
  items,
  activeTab,
  onTabChange,
  getItemKey,
  renderCard,
  renderEmpty,
  isLoading,
  isError = false,
  className = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
}: TabbedTimelineProps<T, Item>) {
  const [internalActiveTab, setInternalActiveTab] = useState<T>(tabs[0].id);

  const currentTab = activeTab ?? internalActiveTab;

  const handleTabChange = (tab: T) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }

    setInternalActiveTab(tab);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    const next = tabs[nextIndex];
    if (!next) return;
    handleTabChange(next.id);
    window.requestAnimationFrame(() => document.getElementById(`timeline-tab-${next.id}`)?.focus());
  };

  return (
    <div className={className}>
      <div
        className="mb-6 flex gap-1 border-b border-divider"
        role="tablist"
        aria-label="Timeline tabs"
        onKeyDown={handleTabKeyDown}
      >
        {tabs.map((tab) => (
          <TimelineTabs
            key={tab.id}
            active={currentTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            ariaSelected={currentTab === tab.id}
            ariaControls={`timeline-panel-${tab.id}`}
            id={`timeline-tab-${tab.id}`}
            tabIndex={currentTab === tab.id ? 0 : -1}
          >
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </TimelineTabs>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton />
          <Skeleton />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-danger/40 bg-danger/8 p-6 font-semibold text-danger" role="alert">
          Failed to load timeline data.
        </div>
      ) : items.length === 0 ? (
        renderEmpty ? (
          renderEmpty(currentTab)
        ) : (
          <p className="min-h-[30vh] rounded-xl border border-divider bg-surface p-8 text-center text-content-muted">
            No items yet.
          </p>
        )
      ) : (
          <div
            id={`timeline-panel-${currentTab}`}
            role="tabpanel"
            aria-labelledby={`timeline-tab-${currentTab}`}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <div
                  key={getItemKey(item, index)}
                  className="min-w-0"
                >
                  {renderCard(item)}
                </div>
              ))}
            </div>
          </div>
      )}
    </div>
  );
}
