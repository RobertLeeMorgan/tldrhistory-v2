import ReviewHeader from "../../src/features/review/components/ReviewHeader";
import ReviewStats from "../../src/features/review/components/ReviewStats";
import ReviewTimeline from "../../src/features/review/components/ReviewTimeline";
import { usePendingStats } from "../../src/features/review/hooks/useSuggestions";

const defaultStats = { pending: 0, approved: 0, rejected: 0 };

export default function Review() {
  const { data: stats, isLoading } = usePendingStats();

  return (
    <main className="min-h-[calc(100dvh-var(--nav-height))] bg-canvas pb-16">
      <ReviewHeader />
      <div className="relative z-10 -mt-5 space-y-8">
        <ReviewStats
          isLoading={isLoading}
          stats={stats ?? defaultStats}
          pendingCount={stats?.pending ?? 0}
        />
        <ReviewTimeline />
      </div>
    </main>
  );
}
