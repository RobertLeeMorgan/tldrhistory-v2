import { useState } from "react";
import type { PendingEditsQuery } from "../../../generated/graphql";
import { useApproveEdit, useRejectEdit } from "../hooks/useEdit";
import TabbedTimeline, {
  type TabConfig,
} from "../../../components/ui/TabbedTimeline";
import ReviewCard from "./ReviewCard";
import type { ReviewTab } from "./ReviewTimeline";

type PendingEditItem = PendingEditsQuery["pendingEdits"]["edits"][number];

type ReviewEditsPanelProps = {
  tabs: TabConfig<ReviewTab>[];
  activeTab: ReviewTab;
  onTabChange: (tab: ReviewTab) => void;
  edits: PendingEditItem[];
  isLoading: boolean;
  isError: boolean;
};

export default function ReviewEditsPanel({
  tabs,
  activeTab,
  onTabChange,
  edits,
  isLoading,
  isError,
}: ReviewEditsPanelProps) {
  const approveEdit = useApproveEdit();
  const rejectEdit = useRejectEdit();
  const [actingEditId, setActingEditId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setActingEditId(id);
    approveEdit.mutate(id, {
      onSettled: () => setActingEditId(null),
    });
  };

  const handleReject = (id: number) => {
    setActingEditId(id);
    rejectEdit.mutate(id, {
      onSettled: () => setActingEditId(null),
    });
  };

  return (
    <TabbedTimeline
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      items={edits}
      getItemKey={(item) => item.id}
      renderCard={(item) => (
        <ReviewCard
          suggestion={item}
          onApprove={() => handleApprove(item.id)}
          onReject={() => handleReject(item.id)}
          approving={approveEdit.isPending && actingEditId === item.id}
          rejecting={rejectEdit.isPending && actingEditId === item.id}
        />
      )}
      renderEmpty={() => (
        <p className="min-h-[40vh] text-stone-800/86 text-shadow-sm">
          No edit suggestions pending.
        </p>
      )}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
