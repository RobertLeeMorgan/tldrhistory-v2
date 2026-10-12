import { useEffect, useRef, useState } from "react";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";

export function AnimatedNumber({
  value,
  format = Math.floor,
  className,
}: {
  value: number;
  format?: (value: number) => React.ReactNode;
  className?: string;
}) {
  const animated = useAnimatedNumber(value);
  return <span className={className}>{format(animated)}</span>;
}

export function TextSwap({ text, className }: { text: string; className?: string }) {
  const displayRef = useRef(text);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    let phaseStartedAt = performance.now();
    const previous = displayRef.current;
    const deletingFor = Math.max(previous.length * 20, 80);
    const typingFor = Math.max(text.length * 20, 80);

    const update = (next: string) => {
      displayRef.current = next;
      setDisplay(next);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = window.requestAnimationFrame(() => update(text));
      return () => window.cancelAnimationFrame(frame);
    }

    const type = (now: number) => {
      const progress = Math.min((now - phaseStartedAt) / typingFor, 1);
      update(text.slice(0, Math.floor(text.length * progress)));
      if (progress < 1) frame = window.requestAnimationFrame(type);
    };

    const remove = (now: number) => {
      const progress = Math.min((now - phaseStartedAt) / deletingFor, 1);
      update(previous.slice(0, Math.ceil(previous.length * (1 - progress))));
      if (progress < 1) {
        frame = window.requestAnimationFrame(remove);
      } else {
        phaseStartedAt = now;
        frame = window.requestAnimationFrame(type);
      }
    };

    frame = window.requestAnimationFrame(remove);
    return () => window.cancelAnimationFrame(frame);
  }, [text]);

  return <span className={className}>{display || "\u00a0"}</span>;
}

export function ContextSwap({
  transitionKey,
  children,
  className,
}: {
  transitionKey: React.Key;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span key={transitionKey} className={`atlas-context-swap ${className ?? ""}`}>
      {children}
    </span>
  );
}
