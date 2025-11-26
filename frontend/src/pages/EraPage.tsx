import EraHeader from "../components/EraHeader";
import Timeline from "../components/Timeline";
import StatsPanel from "../components/StatsPanel";

export default function EraPage() {
  return (
    <div className="min-h-screen bg-base-200 w-full">
      <EraHeader />

      <div className="flex-1 p-4">
        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <Timeline />

          <aside className="sticky top-40 self-start">
            <StatsPanel />
          </aside>
        </div>
      </div>
    </div>
  );
};
