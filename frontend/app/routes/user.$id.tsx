import type { Route } from "./+types/user.$id";
import { useLoaderData, useParams } from "react-router";
import { buildMeta } from "../../src/lib/seo";
import UserHeader from "../../src/features/user/components/UserHeader";
import UserTimeline from "../../src/features/user/components/UserTimeline";
import UserStats from "../../src/features/user/components/UserStats";
import {
  fetchUserStats,
  useUserStatsQuery,
} from "../../src/features/user/hooks/useUser";

export async function loader({ params }: Route.LoaderArgs) {
  const userId = Number(params.id);

  if (!Number.isFinite(userId) || userId <= 0) {
    throw new Response("Invalid user id", { status: 404 });
  }

  // SSR uses the configured private API and never retains user-ID cache entries
  // across requests. Browser hooks keep their existing bounded client cache.
  const data = await fetchUserStats({ userId });

  return { userStats: data?.userStats };
}

export function meta({ data, params }: Route.MetaArgs) {
  const stats = data?.userStats;

  if (!stats?.username) {
    return buildMeta({
      title: "User Profile | TLDR History",
      description: "User profile on TLDR History.",
      path: `/user/${params.id ?? "not-found"}`,
      robots: "noindex, nofollow",
      type: "website",
    });
  }

  return buildMeta({
    title: `${stats.username} | TLDR History`,
    description: `${stats.username}'s profile and timelines on TLDR History.`,
    path: `/user/${params.id}`,
    type: "website",
  });
}

export default function User() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const initial = useLoaderData<typeof loader>();
  const { data, isLoading } = useUserStatsQuery({ userId }, { userStats: initial.userStats });
  const stats = data?.userStats;

  const formattedDate = stats?.createdAt
    ? new Date(Number(stats.createdAt)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <main className="min-h-[calc(100dvh-var(--nav-height))] bg-canvas pb-16">
      <UserHeader
        memberSince={formattedDate}
        user={stats?.username}
        isLoading={isLoading}
        verified={stats?.emailVerifiedAt}
      />
      <div className="relative z-10 mx-auto -mt-5 grid max-w-[1600px] gap-6 px-4 sm:px-6 lg:grid-cols-[var(--timeline-sidebar-width)_minmax(0,1fr)] lg:items-start lg:px-8">
        <UserStats stats={stats?.stats} isLoading={isLoading} />
        <UserTimeline userId={userId} />
      </div>
    </main>
  );
}
