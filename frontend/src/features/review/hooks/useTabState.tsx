import { useState } from "react";

export function useTabState<TTab extends string>(initialTab: TTab) {
  const [activeTab, setActiveTab] = useState<TTab>(initialTab);

  return {
    activeTab,
    setActiveTab,
  };
}