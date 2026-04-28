import { useEffect, useRef, type RefObject } from "react";
import { useEra } from "../../../context/EraContext";
import type { Post } from "../../../generated/graphql";

export function useEraTracker(
  posts: Post[],
  postRefs: Map<string, RefObject<HTMLDivElement | null>>
) {
  const { setDataStartYear } = useEra();

  const currentYearRef = useRef<number | null>(null);
  const lastIndexRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!posts.length) return;

    lastIndexRef.current = 0;
    currentYearRef.current = null;

    const update = () => {
      tickingRef.current = false;

      const scrollY = window.scrollY;
      const scrollingDown = scrollY >= lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      let index = lastIndexRef.current;
      const start = Math.max(0, Math.min(index, posts.length - 1));

      if (scrollingDown) {
        for (let i = start; i < posts.length; i++) {
          const el = postRefs.get(posts[i].id)?.current;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0) {
            index = i;
            break;
          }
        }
      } else {
        for (let i = start; i >= 0; i--) {
          const el = postRefs.get(posts[i].id)?.current;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            index = Math.min(i + 1, posts.length - 1);
            break;
          }
          index = i;
        }
      }

      lastIndexRef.current = index;

      const topPost = posts[index];
      if (!topPost) return;

      if (currentYearRef.current !== topPost.startYear) {
        currentYearRef.current = topPost.startYear;
        setDataStartYear(topPost.startYear);
      }
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafIdRef.current = requestAnimationFrame(update);
      }
    };

    rafIdRef.current = requestAnimationFrame(update);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [posts, postRefs, setDataStartYear]);
}