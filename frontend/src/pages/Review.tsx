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
          <main
        className="
          relative z-10
          pt-[8rem]
          sm:pt-[var(--header-height-sm)]
          md:pt-[var(--header-height-md)]
          lg:pt-[var(--header-height-lg)]

          pb-32
          sm:pb-6

          sm:pr-[min(34vw,420px)]
          md:pr-[min(32vw,440px)]
          lg:pr-[min(30vw,460px)]
        "
      >
        <div className="fixed inset-0 z-0 bg-base" />
        <ReviewTimeline />
        <ReviewStats
          isLoading={isLoading}
          stats={stats ?? defaultStats}
          pendingCount={stats?.pending ?? 0}
        />
      </main>
    </>
  );
}
