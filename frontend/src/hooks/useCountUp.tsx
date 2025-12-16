import { useMotionValue, useTransform, animate } from "framer-motion";
import {useEffect, useState} from 'react'

export function useCountAnimation(value: any) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, latest => Math.floor(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value]);

  return rounded;
}

export const TextSwap = ({ text, className }: { text: string; className?: string }) => {
  const [display, setDisplay] = useState(text);
  const progress = useMotionValue(0);

  useEffect(() => {
    const oldText = display;
    const newText = text;

    animate(progress, 0, {
      duration: oldText.length * 0.02,
      ease: "linear",
      onUpdate: (v) => {
        const length = Math.floor(v);
        setDisplay(oldText.slice(0, length));
      },
      onComplete: () => {
        animate(progress, newText.length, {
          duration: newText.length * 0.02,
          ease: "linear",
          onUpdate: (v) => {
            const length = Math.floor(v);
            setDisplay(newText.slice(0, length));
          }
        });
      }
    });
  }, [text]);

  return (
    <span className={className}>
      {display}
      <span className="opacity-0">▌</span>
    </span>
  );
};