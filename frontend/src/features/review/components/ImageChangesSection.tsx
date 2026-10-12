import ReviewDiff from "./ReviewDiff";
import type { FieldDiff } from "../hooks/useReviewDiffs";

interface ImageChangesSectionProps {
  imageFields: FieldDiff[];
  hasAnyImageChange: boolean;
}

export default function ImageChangesSection({
  imageFields,
  hasAnyImageChange,
}: ImageChangesSectionProps) {
  if (!hasAnyImageChange) return null;

  return (
    <div className="space-y-3 rounded-lg border border-accent/45 bg-accent/8 p-3">
      <p className="text-sm font-bold text-accent">
        Image metadata has been changed
      </p>
      <ReviewDiff fields={imageFields} />
    </div>
  );
}
