"use client";

import { motion } from "framer-motion";

import { easeEditorial } from "@/lib/motion";

type TypeMixProps = {
  movies: number;
  series: number;
};

/** 类型占比：电影与剧集的分段长条，自左向右展开。 */
export function TypeMix({ movies, series }: TypeMixProps) {
  const total = movies + series;
  const parts = [
    { key: "movie", label: "电影", en: "MOVIE", count: movies, bar: "bg-gradient-to-r from-volt/80 to-haohan", dot: "bg-volt" },
    { key: "series", label: "剧集", en: "SERIES", count: series, bar: "bg-gradient-to-r from-gilt/70 to-gilt", dot: "bg-gilt" },
  ];

  return (
    <div>
      <div className="flex h-16 w-full gap-1 overflow-hidden sm:h-20">
        {parts.map((part, index) => (
          <motion.span
            key={part.key}
            title={`${part.label} ${part.count}部`}
            className={`relative block h-full origin-left ${part.bar}`}
            style={{ width: `${(part.count / total) * 100}%` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.4, ease: easeEditorial, delay: index * 0.2 }}
          >
            <span aria-hidden className="scanlines absolute inset-0 opacity-50" />
          </motion.span>
        ))}
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {parts.map((part) => (
          <li key={part.key} className="flex items-baseline justify-between gap-4 border-b border-[var(--rule)] pb-4">
            <span className="flex items-center gap-3">
              <i aria-hidden className={`block h-2.5 w-2.5 ${part.dot}`} />
              <span className="text-[14px] tracking-[0.16em] text-ice">{part.label}</span>
              <span className="font-mono text-[9px] tracking-[0.22em] text-ice-mute">{part.en}</span>
            </span>
            <span className="font-display text-[clamp(24px,2.6vw,36px)] leading-none text-ice tabular-nums">
              {part.count}
              <span className="ml-3 font-mono text-[11px] tracking-[0.16em] text-ice-mute">{Math.round((part.count / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
