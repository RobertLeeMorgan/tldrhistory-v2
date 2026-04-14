import StatCard from "../../stats/components/StatCard";
import StatsContainer from "../../stats/components/StatsContainer";

export type ReviewStatsProps = {
  isLoading: boolean;
  pendingCount: number;
  stats: {
    approved: number;
    rejected: number;
  };
};

export default function ReviewStats({
  isLoading,
  pendingCount,
  stats,
}: ReviewStatsProps) {
  return (
    <StatsContainer>
      <StatCard
        title="Pending Review"
        value={pendingCount}
        description="Left to Verify"
        isLoading={isLoading}
      />
      <StatCard
        title="Approved Submissions"
        value={stats.approved}
        description="Total Verified"
        isLoading={isLoading}
      />
      <StatCard
        title="Rejected Submissions"
        value={stats.rejected}
        description="Total Dismissed"
        isLoading={isLoading}
      />
    </StatsContainer>
  );
}
