"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { easeEditorial } from "@/lib/motion";

type CountUpProps = {
  to: number;
  from?: number;
  /** 不足位数时左侧补零。 */
  pad?: number;
  duration?: number;
  className?: string;
};

export function CountUp({ to, from = 0, pad = 0, duration = 1.8, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    const format = (value: number) => String(Math.round(value)).padStart(pad, "0");
    if (reduce) {
      node.textContent = format(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: easeEditorial,
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, pad, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {String(from).padStart(pad, "0")}
    </span>
  );
}
