"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useMotionAllowed } from "@/lib/hooks/useMotionAllowed";

type GlitchTextProps = {
  /** 切片层使用的纯文本。 */
  text: string;
  /** 主体内容，默认直接渲染 text。 */
  children?: ReactNode;
  className?: string;
  /** 两次自动切片之间的最短间隔（毫秒）。 */
  every?: number;
};

const slices = [
  { clip: "inset(14% 0 62% 0)", x: [0, -7, 5, -2, 0], tone: "text-haohan/75" },
  { clip: "inset(58% 0 18% 0)", x: [0, 6, -4, 2, 0], tone: "text-volt/55" },
];

/** 偶发的轻微故障切片：两条错位的冷色切片，悬停时也会触发一次。 */
export function GlitchText({ text, children, className, every = 5600 }: GlitchTextProps) {
  const allowed = useMotionAllowed();
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!allowed) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBurst((n) => n + 1);
        schedule();
      }, every + Math.random() * every * 0.8);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [allowed, every]);

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => allowed && setBurst((n) => n + 1)}
    >
      <span className="relative block">{children ?? text}</span>
      {slices.map((slice, index) => (
        <motion.span
          key={`${index}-${burst}`}
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 block select-none", slice.tone)}
          style={{ clipPath: slice.clip }}
          initial={{ opacity: 0, x: 0 }}
          animate={burst > 0 ? { opacity: [0, 0.95, 0.7, 0.35, 0], x: slice.x } : { opacity: 0 }}
          transition={{ duration: 0.46, times: [0, 0.18, 0.5, 0.8, 1], ease: "linear" }}
        >
          {text}
        </motion.span>
      ))}
    </span>
  );
}
