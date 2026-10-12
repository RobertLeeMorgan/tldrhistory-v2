import type { PendingEditsQuery } from "../../../generated/graphql";
import Button from "../../../components/ui/Button";
import CardContainer from "../../../components/cards/CardContainer";
import ReviewDiff from "./ReviewDiff";
import ImageChangesSection from "./ImageChangesSection";
import { useReviewDiffs } from "../hooks/useReviewDiffs";

type PendingEditItem = PendingEditsQuery["pendingEdits"]["edits"][number];

interface ReviewCardProps {
  suggestion: PendingEditItem;
  onApprove: () => void;
  onReject: () => void;
  approving?: boolean;
  rejecting?: boolean;
}

export default function ReviewCard({
  suggestion,
  onApprove,
  onReject,
  approving = false,
  rejecting = false,
}: ReviewCardProps) {
  const {
    mainFields,
    descriptionFields,
    metadataFields,
    imageFields,
    hasAnyImageChange,
  } = useReviewDiffs(suggestion);

  const { post, suggestedBy } = suggestion;

  return (
    <CardContainer>
      <header className="flex items-start justify-between border-b border-divider pb-4">
        <div>
          <h2 className="text-xl font-bold text-content">{post.name}</h2>
          <p className="pt-1 text-sm text-content-muted">
            Suggested by @{suggestedBy.username}
          </p>
        </div>
      </header>

      <ReviewDiff fields={mainFields} />
      <ReviewDiff fields={descriptionFields} />
      <ReviewDiff
        fields={metadataFields}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      />

      <ImageChangesSection
        imageFields={imageFields}
        hasAnyImageChange={hasAnyImageChange}
      />

      <div className="mt-2 flex flex-wrap justify-end gap-3 border-t border-divider pt-4">
        <Button
          label="Reject"
          loading="Rejecting..."
          isLoading={rejecting}
          onClick={onReject}
        />
        <Button
          label="Approve"
          loading="Approving..."
          isLoading={approving}
          primary
          onClick={onApprove}
        />
      </div>
    </CardContainer>
  );
}
