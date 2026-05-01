import type { Route } from "./+types/user.$id";
import { useParams } from "react-router";
import { buildMeta } from "../../src/lib/seo";
import UserHeader from "../../src/features/user/components/UserHeader";
import UserTimeline from "../../src/features/user/components/UserTimeline";
import UserStats from "../../src/features/user/components/UserStats";
import {
  useUserStatsQuery,
  getUserStatsQueryOptions,
} from "../../src/features/user/hooks/useUser";
import { queryClient } from "../../src/lib/queryClient";

export async function loader({ params, request }: Route.LoaderArgs) {
  const userId = Number(params.id);

  if (!Number.isFinite(userId) || userId <= 0) {
    throw new Response("Invalid user id", { status: 404 });
  }

  const apiOrigin = new URL(request.url).origin;

  const data = await queryClient.ensureQueryData(
    getUserStatsQueryOptions({ userId, apiOrigin }),
  );

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

  const { data, isLoading } = useUserStatsQuery({ userId });
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
        verified={stats?.emailVerifiedAt}
      />
      <UserStats stats={stats?.stats} isLoading={isLoading} />

      <main
        className="
          relative z-10
          sm:pr-[min(34vw,420px)]
          md:pr-[min(32vw,440px)]
          lg:pr-[min(30vw,460px)]
                  pt-[8rem]
          sm:pt-[var(--header-height-sm)]
          md:pt-[var(--header-height-md)]
          lg:pt-[var(--header-height-lg)]
        "
      >
        <div className="fixed inset-0 z-0 bg-base" />
        <UserTimeline userId={userId} />
      </main>
    </>
  );
}
