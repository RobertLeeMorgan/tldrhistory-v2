import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useEra } from "../../../context/EraContext";
import type { Post } from "../../../generated/graphql";

export function useEraTracker(
  posts: Post[],
  postRefs: RefObject<Map<string, RefObject<HTMLDivElement | null>>>,
) {
  const { setDataStartYear } = useEra();
  const currentYearRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const updateRef = useRef<(() => void) | null>(null);

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      updateRef.current?.();
    });
  }, []);

  useEffect(() => {
    const update = () => {
      const occludingHeader = document.getElementById("timeline-context-header");
      const viewportTop = Math.max(0, occludingHeader?.getBoundingClientRect().bottom ?? 0);
      let candidate: Post | undefined;
      let crossing: Post | undefined;
      let crossingTop = -Infinity;
      // Only mounted, visible cards contribute. Virtual eviction must never
      // reset the year to an unmounted first card after a page append.
      for (const post of posts) {
        const element = postRefs.current.get(post.id)?.current;
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= viewportTop || rect.top >= window.innerHeight || rect.height === 0) continue;
        if (rect.top >= viewportTop) { candidate = post; break; }
        if (rect.top > crossingTop) { crossing = post; crossingTop = rect.top; }
      }
      const topPost = candidate ?? crossing;
      if (topPost && currentYearRef.current !== topPost.startYear) {
        currentYearRef.current = topPost.startYear;
        setDataStartYear(topPost.startYear);
      }
    };
    updateRef.current = update;
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      updateRef.current = null;
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [posts, postRefs, setDataStartYear, scheduleUpdate]);

  return scheduleUpdate;
}
