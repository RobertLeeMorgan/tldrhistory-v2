import { useState } from "react";
import type { PendingCreatedPostsQuery } from "../../../generated/graphql";
import {
  useApproveCreatedPost,
  useRejectCreatedPost,
} from "../hooks/useCreate";
import TabbedTimeline, {
  type TabConfig,
} from "../../../components/ui/TabbedTimeline";
import CreatedCard from "./CreatedCard";
import type { ReviewTab } from "./ReviewTimeline";

type PendingCreatedItem =
  PendingCreatedPostsQuery["pendingCreatedPosts"]["createdPosts"][number];

type ReviewCreatedPanelProps = {
  tabs: TabConfig<ReviewTab>[];
  activeTab: ReviewTab;
  onTabChange: (tab: ReviewTab) => void;
  createdPosts: PendingCreatedItem[];
  isLoading: boolean;
  isError: boolean;
};

export default function ReviewCreatedPanel({
  tabs,
  activeTab,
  onTabChange,
  createdPosts,
  isLoading,
  isError,
}: ReviewCreatedPanelProps) {
  const approveCreatedPost = useApproveCreatedPost();
  const rejectCreatedPost = useRejectCreatedPost();
  const [actingCreatedId, setActingCreatedId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setActingCreatedId(id);
    approveCreatedPost.mutate(id, {
      onSettled: () => setActingCreatedId(null),
    });
  };

  const handleReject = (id: number) => {
    setActingCreatedId(id);
    rejectCreatedPost.mutate(id, {
      onSettled: () => setActingCreatedId(null),
    });
  };

  return (
    <TabbedTimeline
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      items={createdPosts}
      getItemKey={(item) => item.id}
      renderCard={(item) => (
        <CreatedCard
          post={item.data}
          onApprove={() => handleApprove(item.id)}
          onReject={() => handleReject(item.id)}
          approving={
            approveCreatedPost.isPending && actingCreatedId === item.id
          }
          rejecting={rejectCreatedPost.isPending && actingCreatedId === item.id}
        />
      )}
      renderEmpty={() => (
        <p className="min-h-[40vh] text-stone-800/86 text-shadow-sm">
          No created post submissions yet.
        </p>
      )}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
