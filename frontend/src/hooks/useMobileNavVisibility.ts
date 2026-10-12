import { useEffect, useRef, useState } from "react";

const MOVEMENT_THRESHOLD = 24;
const TOP_GUARD = 16;

export function useMobileNavVisibility(locked = false) {
  const [hidden, setHidden] = useState(false);
  const lockedRef = useRef(locked);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    let lastY = window.scrollY;
    let accumulated = 0;
    let lastDirection = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const nextY = window.scrollY;
      const delta = nextY - lastY;
      lastY = nextY;

      if (window.innerWidth >= 768 || nextY <= TOP_GUARD || lockedRef.current) {
        accumulated = 0;
        lastDirection = 0;
        setHidden(false);
        return;
      }

      const direction = Math.sign(delta);
      if (!direction) return;
      if (direction !== lastDirection) accumulated = 0;
      lastDirection = direction;
      accumulated += delta;

      if (accumulated >= MOVEMENT_THRESHOLD) {
        setHidden(true);
        accumulated = 0;
      } else if (accumulated <= -MOVEMENT_THRESHOLD) {
        setHidden(false);
        accumulated = 0;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return locked ? false : hidden;
}
