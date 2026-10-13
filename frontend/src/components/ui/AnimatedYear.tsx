import { AnimatedNumber } from "./AnimatedValue";
import { formatYear } from "../../utils/formatYear";

export default function AnimatedYear({ year, className }: { year: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 tabular-nums ${className ?? ""}`}>
      <AnimatedNumber value={Math.abs(year)} format={(value) => Math.floor(value).toLocaleString()} />
      <span className="text-[0.7em] font-semibold text-content-muted">{formatYear(year)}</span>
    </span>
  );
}
