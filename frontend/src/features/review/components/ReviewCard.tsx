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
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-stone-200">{post.name}</h2>
          <p className="text-sm text-stone-300 pt-1">
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

      <div className="mt-4 pt-4 flex gap-3 justify-center">
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
