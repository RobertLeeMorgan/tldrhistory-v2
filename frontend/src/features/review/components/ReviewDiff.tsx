import ReviewFieldDiff from "./ReviewFieldDiff";
import type { FieldDiff } from "../hooks/useReviewDiffs";

interface ReviewDiffProps {
  fields: FieldDiff[];
  className?: string;
}

export default function ReviewDiff({ fields, className = "" }: ReviewDiffProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {fields.map(({ label, from, to, isDiff, render = (v) => <span>{v || <span className="text-stone-500 italic">empty</span>}</span> }) => (
        <ReviewFieldDiff
          key={label}
          label={label}
          from={from}
          to={to}
          render={render}
          isDiff={isDiff}
        />
      ))}
    </div>
  );
}