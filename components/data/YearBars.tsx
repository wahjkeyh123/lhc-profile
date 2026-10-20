"use client";

import { motion } from "framer-motion";

import { easeEditorial } from "@/lib/motion";

type YearBarsProps = {
  data: { year: number; count: number }[];
};

/** 年份分布柱状图：进入视口时柱体自底部依次升起。 */
export function YearBars({ data }: YearBarsProps) {
  const max = Math.max(...data.map((item) => item.count));

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[240px] sm:h-[300px]">
        {[0, 0.5, 1].map((line) => (
          <span key={line} className="absolute inset-x-0 h-px bg-[var(--rule)]" style={{ top: `${line * 100}%` }} />
        ))}
      </div>
      <ol className="relative grid h-[240px] items-end gap-2 sm:h-[300px] sm:gap-4" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((item, index) => (
          <li key={item.year} className="group flex h-full flex-col items-center justify-end" title={`${item.count}部`}>
            <span className="sr-only">{item.year}年</span>
            <span className="mb-3 text-center font-display text-[clamp(20px,2.4vw,34px)] leading-none text-ice tabular-nums transition-colors duration-500 group-hover:text-haohan">
              {item.count}
            </span>
            <motion.span
              className="relative block w-full max-w-[56px] origin-bottom overflow-hidden bg-gradient-to-t from-volt/30 via-haohan/60 to-ice/90"
              style={{ height: `${(item.count / max) * 78}%` }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.2, ease: easeEditorial, delay: index * 0.08 }}
            >
              <span aria-hidden className="scanlines absolute inset-0 opacity-60" />
              <span aria-hidden className="absolute inset-0 bg-ice opacity-0 transition-opacity duration-500 group-hover:opacity-25" />
            </motion.span>
          </li>
        ))}
      </ol>
      <ol aria-hidden className="mt-4 grid gap-2 border-t border-[var(--rule-strong)] pt-4 sm:gap-4" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((item) => (
          <li key={item.year} className="text-center font-mono text-[10px] tracking-[0.18em] text-ice-mute sm:text-[11px]">
            {item.year}
          </li>
        ))}
      </ol>
    </div>
  );
}
