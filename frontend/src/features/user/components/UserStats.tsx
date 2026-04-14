import { ICON_MAP } from "../../../icons/iconMap";
import { HISTORICAL_RANGES } from "../../../utils/historicalRanges";
import StatsContainer from "../../stats/components/StatsContainer";
import StatCard from "../../stats/components/StatCard"; // <-- import your reusable component

type StatsProps = {
  stats?: any;
  isLoading: boolean;
};

export default function UserStats({ stats, isLoading }: StatsProps) {
  const isNotFound = !isLoading && !stats;

  const imageSrc = stats?.mostLikedPost?.cdnId
    ? `https://cdn.tldrhistory.xyz/${stats?.mostLikedPost?.cdnId}`
    : stats?.mostLikedPost?.imageUrl;

  const icon = stats?.favouriteGroup?.icon;
  const IconComponent = icon ? ICON_MAP[icon] : undefined;

  const era = HISTORICAL_RANGES.find((r) => r.label === stats?.favouriteEra);
  const EraIcon = era?.icon;

  return (
    <StatsContainer>
      {/* Most Liked Post */}
      <StatCard
        title="Top Contribution"
        value={stats?.mostLikedPost?.name ?? "—"}
        description="Most Liked Article"
        isLoading={isLoading}
        isNotFound={isNotFound}
        imageSrc={imageSrc ?? undefined}
      />

      {/* Favourite Era */}
      <StatCard
        title="Favourite Era"
        value={stats?.favouriteEra ?? "—"}
        description="Most Contributions"
        isLoading={isLoading}
        isNotFound={isNotFound}
        icon={EraIcon}
      />

      {/* Favourite Group */}
      <StatCard
        title="Favourite Group"
        value={stats?.favouriteGroup?.name ?? "—"}
        description="Most Liked Articles"
        isLoading={isLoading}
        isNotFound={isNotFound}
        icon={IconComponent}
      />
    </StatsContainer>
  );
}
