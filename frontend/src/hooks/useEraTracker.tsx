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

    const update = () => {
      tickingRef.current = false;

      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      let index = lastIndexRef.current;

      const checkIndex = (i: number) => {
        const post = posts[i];
        const el = postRefs.get(post.id)?.current;
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0;
      };

      if (scrollingDown) {
        // scan forward
        for (let i = index; i < posts.length; i++) {
          if (checkIndex(i)) {
            index = i;
            break;
          }
        }
      } else {
        // scan backward
        for (let i = index; i >= 0; i--) {
          if (checkIndex(i)) {
            index = i;
          } else {
            break;
          }
        }
      }

      lastIndexRef.current = index;

      const topPost = posts[index];
      if (!topPost) return;

      const newEraIndex = HISTORICAL_RANGES.findIndex(
        (r) =>
          topPost.startYear >= r.start &&
          topPost.startYear <= r.end
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
    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, postRefs, setEra, setDataStartYear]);
}
