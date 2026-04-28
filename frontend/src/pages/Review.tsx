import ReviewHeader from "../../src/features/review/components/ReviewHeader";
import ReviewStats from "../../src/features/review/components/ReviewStats";
import ReviewTimeline from "../../src/features/review/components/ReviewTimeline";
import { usePendingStats } from "../../src/features/review/hooks/useSuggestions";

const defaultStats = { pending: 0, approved: 0, rejected: 0 };

export default function Review() {
  const { data: stats, isLoading } = usePendingStats();

  return (
    <>
      <ReviewHeader />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] bg-base">
        <ReviewTimeline />
        <ReviewStats
          isLoading={isLoading}
          stats={stats ?? defaultStats}
          pendingCount={stats?.pending ?? 0}
        />
      </div>
    </>
  );
}
