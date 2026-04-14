import { useState } from "react";
import {
  usePendingEdits,
  usePendingCreatedPostsQuery,
} from "../hooks/useSuggestions";
import { type TabConfig } from "../../../components/ui/TabbedTimeline";
import ReviewEditsPanel from "./ReviewEditsPanel";
import ReviewCreatedPanel from "./ReviewCreatedPanel";

export type ReviewTab = "edits" | "created";

export default function ReviewTimeline() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("edits");

  const {
    data: editsData,
    isLoading: editsLoading,
    isError: editsError,
  } = usePendingEdits();

  const {
    data: createdData,
    isLoading: createdLoading,
    isError: createdError,
  } = usePendingCreatedPostsQuery();

  const edits = editsData?.edits ?? [];
  const createdPosts = createdData?.createdPosts ?? [];

  const tabs: TabConfig<ReviewTab>[] = [
    { id: "edits", label: "Edits", count: edits.length },
    { id: "created", label: "Created", count: createdPosts.length },
  ];

  const isLoading = activeTab === "edits" ? editsLoading : createdLoading;
  const isError = activeTab === "edits" ? editsError : createdError;

  return activeTab === "edits" ? (
    <ReviewEditsPanel
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      edits={edits}
      isLoading={isLoading}
      isError={isError}
    />
  ) : (
    <ReviewCreatedPanel
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      createdPosts={createdPosts}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
