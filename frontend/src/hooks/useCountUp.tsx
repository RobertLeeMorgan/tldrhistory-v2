import { useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function useCountAnimation(value: number) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return rounded;
}

export function TextSwap({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const progress = useMotionValue(0);

  useEffect(() => {
    const previous = display;
    let controls: { stop: () => void } | undefined;

    controls = animate(progress, 0, {
      duration: Math.max(previous.length * 0.02, 0.08),
      ease: "linear",
      onUpdate: (v) => {
        setDisplay(previous.slice(0, Math.floor(v)));
      },
      onComplete: () => {
        controls = animate(progress, text.length, {
          duration: Math.max(text.length * 0.02, 0.08),
          ease: "linear",
          onUpdate: (v) => {
            setDisplay(text.slice(0, Math.floor(v)));
          },
        });
      },
    });

    return () => controls?.stop();
  }, [text]);

  return (
    <span
      className={`
    relative inline-block leading-none min-h-[1em] 
     truncate w-full
    ${className ?? ""}
  `}
    >
      {display || "\u00A0"}
    </span>
  );
}
