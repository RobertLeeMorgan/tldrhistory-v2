import { ICON_MAP } from "../../../icons/iconMap";
import { HISTORICAL_RANGES } from "../../../utils/historicalRanges";
import CompactStat from "../../stats/components/CompactStat";
import type { UserStatsQuery } from "../../../generated/graphql";

type UserStatData = NonNullable<NonNullable<UserStatsQuery["userStats"]>["stats"]>;

type StatsProps = {
  stats?: UserStatData;
  isLoading: boolean;
};

export default function UserStats({ stats, isLoading }: StatsProps) {
  const imageSrc = stats?.mostLikedPost?.cdnId
    ? `https://cdn.tldrhistory.xyz/${stats.mostLikedPost.cdnId}`
    : stats?.mostLikedPost?.imageUrl;
  const groupIcon = stats?.favouriteGroup?.icon;
  const GroupIcon = groupIcon ? ICON_MAP[groupIcon] : undefined;
  const era = HISTORICAL_RANGES.find((range) => range.label === stats?.favouriteEra);

  return (
    <aside className="h-fit overflow-hidden rounded-xl border border-divider bg-surface/95 shadow-xl shadow-black/20 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]" aria-label="Profile statistics">
      <div className="grid divide-y divide-divider/70 xs:grid-cols-3 xs:divide-x xs:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
        <CompactStat
          title="Top contribution"
          value={stats?.mostLikedPost?.name ?? "—"}
          transitionKey={stats?.mostLikedPost?.id ?? "top-empty"}
          description="Most liked article"
          imageSrc={imageSrc ?? undefined}
          isLoading={isLoading}
        />
        <CompactStat
          title="Favourite era"
          value={stats?.favouriteEra ?? "—"}
          transitionKey={stats?.favouriteEra ?? "era-empty"}
          description="Most contributions"
          icon={era?.icon}
          isLoading={isLoading}
        />
        <CompactStat
          title="Favourite group"
          value={stats?.favouriteGroup?.name ?? "—"}
          transitionKey={stats?.favouriteGroup?.name ?? "group-empty"}
          description="Most liked articles"
          icon={GroupIcon}
          isLoading={isLoading}
        />
      </div>
    </aside>
  );
}
