import { useEffect, useRef } from "react";
import { HISTORICAL_RANGES } from "../utils/historicalRanges";
import { useEra } from "../context/EraContext";
import type { Post } from "../generated/graphql";

export function useEraTracker(posts: Post[]) {
  const { setEra, setDataStartYear } = useEra();

  const currentEraRef = useRef<number | null>(null);

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const handleScroll = () => {
      const topPost = posts.find((post) => {
        const el = document.querySelector(`[data-post-id="${post.id}"]`);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0;
      });

      if (!topPost) return;

      const newEraIndex = HISTORICAL_RANGES.findIndex(
        (r) => topPost.startYear >= r.start && topPost.startYear <= r.end
      );

      if (newEraIndex !== -1 && currentEraRef.current !== newEraIndex) {
        currentEraRef.current = newEraIndex;
        setEra(newEraIndex);
      }
      setDataStartYear(topPost.startYear);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts, setEra, setDataStartYear]);
}
