import { useParams } from "react-router-dom";
import UserHeader from "../features/user/components/UserHeader";
import UserTimeline from "../features/user/components/UserTimeline";
import UserStats from "../features/user/components/UserStats";
import { useUserStatsQuery } from "../features/user/hooks/useUser";

export default function User() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data, isLoading } = useUserStatsQuery({
    userId,
  });

  const stats = data?.userStats;

  const formattedDate = stats?.createdAt
    ? new Date(Number(stats.createdAt)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <>
      <UserHeader
        memberSince={formattedDate}
        user={stats?.username}
        isLoading={isLoading}
      />

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] bg-base">
        <UserTimeline userId={userId} />
        <UserStats stats={stats?.stats} isLoading={isLoading} />
      </div>
    </>
  );
}
