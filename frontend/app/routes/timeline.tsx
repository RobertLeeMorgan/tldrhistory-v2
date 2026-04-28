import { TimelineFilterProvider } from "../../src/context/FilterContext";
import TimelineLayout from "../../src/features/timeline/components/TimelineLayout";
import { EraProvider } from "../../src/context/EraContext";

export default function TimelineRoute() {
  return (
    <EraProvider>
      <TimelineFilterProvider>
        <TimelineLayout />
      </TimelineFilterProvider>
    </EraProvider>
  );
}