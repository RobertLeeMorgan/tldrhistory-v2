import { useEffect, useRef, type RefObject } from "react";
import { HISTORICAL_RANGES } from "../utils/historicalRanges";
import { useEra } from "../context/EraContext";
import type { Post } from "../generated/graphql";

export function useEraTracker(
  posts: Post[],
  postRefs: Map<string, RefObject<HTMLDivElement | null>>
) {
  const { setEra, setDataStartYear } = useEra();

  const currentEraRef = useRef<number | null>(null);
  const currentYearRef = useRef<number | null>(null);
  const lastIndexRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    lastIndexRef.current = 0;
    currentEraRef.current = null;
    currentYearRef.current = null;

    const update = () => {
      tickingRef.current = false;

      const scrollY = window.scrollY;
      lastScrollYRef.current = scrollY;

      let index = 0;
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const el = postRefs.get(post.id)?.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0) {
            index = i;
            break;
          }
        }
      }
      lastIndexRef.current = index;

      const topPost = posts[index];
      if (!topPost) return;

      const newEraIndex = HISTORICAL_RANGES.findIndex(
        (r) => topPost.startYear >= r.start && topPost.startYear <= r.end
      );

      if (newEraIndex !== -1 && currentEraRef.current !== newEraIndex) {
        currentEraRef.current = newEraIndex;
        setEra(newEraIndex);
      }

      if (currentYearRef.current !== topPost.startYear) {
        currentYearRef.current = topPost.startYear;
        setDataStartYear(topPost.startYear);
      }
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, postRefs, setEra, setDataStartYear]);
}
