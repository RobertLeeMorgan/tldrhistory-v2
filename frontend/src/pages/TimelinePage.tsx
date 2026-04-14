import { TimelineFilterProvider } from "../context/FilterContext";
import TimelinePageContent from "../features/timeline/components/TimelinePageContent";

export default function TimelinePage() {

  return (
    <TimelineFilterProvider>
      <TimelinePageContent />
    </TimelineFilterProvider>
  );
}