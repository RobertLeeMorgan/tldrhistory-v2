import { useEffect, useRef, useState } from "react";

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

export function useAnimatedNumber(value: number, duration = 1000) {
  const displayedRef = useRef(value);
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    let frame = 0;
    const from = displayedRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || from === value) {
      frame = window.requestAnimationFrame(() => {
        displayedRef.current = value;
        setDisplayed(value);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const next = from + (value - from) * easeOutCubic(progress);
      displayedRef.current = next;
      setDisplayed(next);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, value]);

  return displayed;
}
