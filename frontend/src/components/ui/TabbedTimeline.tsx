import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  className = "p-4 pb-40 sm:p-6",
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

  return (
    <div className={className}>
      <div
        className="mb-6 mt-1 flex gap-4 border-b border-stone-600 sm:mt-3"
        role="tablist"
        aria-label="Timeline tabs"
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
        <div className="py-10 text-gold font-semibold">
          Failed to load timeline data.
        </div>
      ) : items.length === 0 ? (
        renderEmpty ? (
          renderEmpty(currentTab)
        ) : (
          <p className="min-h-[40vh] text-stone-800/86 text-shadow-sm">
            No items yet.
          </p>
        )
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={String(currentTab)}
            id={`timeline-panel-${currentTab}`}
            role="tabpanel"
            aria-labelledby={`timeline-tab-${currentTab}`}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {items.map((item, index) => (
                <div
                  key={getItemKey(item, index)}
                  className="card shadow-lg shadow-black/40"
                >
                  {renderCard(item)}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}