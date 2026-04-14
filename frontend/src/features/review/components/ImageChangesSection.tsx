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
    <div className="bg-stone-900/40 rounded-md p-3 space-y-2 border border-stone-600">
      <p className="text-sm text-gold font-semibold">
        Image metadata has been changed
      </p>
      <ReviewDiff fields={imageFields} />
    </div>
  );
}
