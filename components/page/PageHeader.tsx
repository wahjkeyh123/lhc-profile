"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useEntryDelay } from "@/lib/hooks/useEntryDelay";
import { easeEditorial } from "@/lib/motion";

type PageHeaderProps = {
  /** 版面编号，如 "02"。 */
  index: string;
  /** 英文栏目名，如 "WORKS"。 */
  en: string;
  /** 原站页面 kicker，如 "FILMOGRAPHY"。 */
  kicker: string;
  title: string;
  /** 右侧元信息，如条目数量。 */
  meta?: ReactNode;
  /** 标题较长时缩小字号。 */
  compact?: boolean;
  children?: ReactNode;
};

/** 内页统一页头：杂志版面编号、英文小标签与大号衬线标题。 */
export function PageHeader({ index, en, kicker, title, meta, compact = false, children }: PageHeaderProps) {
  const offset = useEntryDelay();
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: easeEditorial, delay: delay + offset },
  });

  return (
    <header className="relative mx-auto max-w-[1600px] px-5 pt-[var(--header-offset)] sm:px-8 lg:px-12">
      <motion.div className="micro flex items-center justify-between gap-4 border-b border-[var(--rule)] py-4" {...enter(0.05)}>
        <span>
          N°{index} — {en}
        </span>
        <span className="hidden text-ice-dim sm:inline">HAOHAN BLUE ARCHIVE</span>
        <span>{meta}</span>
      </motion.div>

      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-10 pt-14 lg:pb-14 lg:pt-20">
        <div className="min-w-0">
          <motion.p className="micro flex items-center gap-4 text-haohan" {...enter(0.15)}>
            <span aria-hidden className="h-px w-10 bg-haohan/60" />
            {kicker}
          </motion.p>
          <h1 className="mt-6 overflow-hidden pb-[0.08em]">
            <motion.span
              className={cn(
                "text-metal block font-serifsc font-semibold leading-[1.02] tracking-[0.02em]",
                compact ? "text-balance text-[clamp(28px,7.4vw,92px)]" : "text-balance text-[clamp(40px,8.4vw,132px)]"
              )}
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.3, ease: easeEditorial, delay: 0.2 + offset }}
            >
              {title}
            </motion.span>
          </h1>
        </div>
        <motion.span
          aria-hidden
          className="font-display text-[clamp(64px,10vw,168px)] italic leading-none text-ice/[0.07]"
          {...enter(0.35)}
        >
          {index}
        </motion.span>
      </div>

      {children && <motion.div {...enter(0.45)}>{children}</motion.div>}
    </header>
  );
}
