import { useEra } from "../context/EraContext";
import {
  useCivilisationQuery,
  usePopulationQuery,
  useSignificantQuery,
} from "../hooks/useStats";
import { formatPopulation } from "../utils/formatPopulation";
import { cleanName } from "../utils/cleanName";

export default function StatsPanel() {
  const { startYear, endYear, label } = useEra();

  const { data, isLoading, isError } = usePopulationQuery({ start: startYear });

  const {
    data: sigData,
    isLoading: sigLoading,
    isError: sigError,
  } = useSignificantQuery({ start: startYear, end: endYear });
  
  const { data: civData } = useCivilisationQuery({
    start: startYear,
    end: endYear,
  });

  const significant = sigData?.getSignificant;
  const civilisationsRaw = civData?.getCivilisation ?? [];

  const civilisations = Array.from(
    new Map(civilisationsRaw.map((c) => [cleanName(c.name), c])).values()
  );

  return (
    <div className="stats stats-vertical w-full max-w-lg shadow bg-base-100 p-4 rounded-lg border border-base-300 ">
      {/* Population */}
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
            />
          </svg>
        </div>
        <div className="stat-title truncate">Population</div>
        <div className="stat-value text-primary">
          {isLoading
            ? "…"
            : isError
            ? "Error"
            : data?.getPopulation
            ? formatPopulation(data.getPopulation)
            : "—"}
        </div>
        <div className="stat-desc truncate">{label}</div>
      </div>

      {/* Significant Figure */}
      <div className="stat">
        <div className="stat-figure text-secondary">
          {sigLoading ? (
            <div className="skeleton w-16 h-16 rounded-full" />
          ) : significant?.imageUrl ? (
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src={significant.imageUrl} alt={significant.name} />
              </div>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4S8 5.79 8 8s1.79 4 4 4zm0 2c-3.866 0-7 1.567-7 3.5V19h14v-1.5c0-1.933-3.134-3.5-7-3.5z"
              />
            </svg>
          )}
        </div>
        <div className="stat-title truncate">Most Significant</div>
        <div className="stat-value text-secondary truncate">
          {sigLoading
            ? "…"
            : sigError
            ? "Error"
            : significant?.name
            ? cleanName(significant.name)
            : "—"}
        </div>
        <div className="stat-desc truncate">
          {significant ? "Highly influential event" : ""}
        </div>
      </div>

      {/* Civilisations */}
      <div className="stat">
        <div className="stat-figure text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
        </div>
        <div className="stat-title truncate mb-2">Civilisations</div>
        <div className="stat-desc flex flex-wrap gap-1 max-w-full max-h-32 overflow-y-auto">
          {civilisations.map((c: { id: string; name: string }) => (
            <span
              key={c.id}
              className="badge badge-sm text-accent badge-outline truncate max-w-full"
            >
              {cleanName(c.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
