"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { ArchiveImage } from "@/components/media/ArchiveImage";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import type { HomeGate } from "@/lib/data";
import { easeEditorial } from "@/lib/motion";

type ContentsDirectoryProps = {
  kicker: string;
  title: string;
  gates: HomeGate[];
};

/** 首页杂志目录：左侧目录条目，右侧随悬停切换的封面预览。 */
export function ContentsDirectory({ kicker, title, gates }: ContentsDirectoryProps) {
  const [activeKey, setActiveKey] = useState(gates[0]?.key);
  const active = gates.find((gate) => gate.key === activeKey) ?? gates[0];

  return (
    <section aria-labelledby="contents-title" className="relative mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:mt-40 lg:px-12">
      <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--rule)] pb-8">
        <div>
          <p className="micro text-haohan">{kicker}</p>
          <h2 id="contents-title" className="mt-4 font-serifsc text-[clamp(40px,5.4vw,84px)] font-semibold leading-none tracking-[0.04em]">
            {title}
          </h2>
        </div>
        <p className="micro text-right">
          CONTENTS
          <br />
          {String(gates.length).padStart(2, "0")} SECTIONS
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
        <ol className="lg:col-span-7">
          {gates.map((gate, index) => {
            const lit = gate.key === activeKey;
            return (
              <li key={gate.key}>
                <Reveal delay={index * 0.06} offset={18}>
                  <Link
                    href={gate.href}
                    onMouseEnter={() => setActiveKey(gate.key)}
                    onFocus={() => setActiveKey(gate.key)}
                    className="group relative grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 border-b border-[var(--rule)] py-7 sm:grid-cols-[72px_minmax(0,1fr)_auto] lg:py-9"
                  >
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-[0.2em] transition-colors duration-500",
                        lit ? "text-haohan" : "text-ice-mute"
                      )}
                    >
                      {gate.k}
                    </span>

                    <span className="min-w-0">
                      <span className="flex items-baseline gap-4 transition-transform duration-700 ease-editorial lg:group-hover:translate-x-4">
                        <span className="relative font-serifsc text-[clamp(34px,4.2vw,64px)] font-semibold leading-none tracking-[0.06em] text-ice">
                          {gate.t}
                          <span
                            aria-hidden
                            className="absolute left-0 top-0 translate-x-[3px] text-haohan opacity-0 transition-[opacity,transform] duration-500 [clip-path:inset(46%_0_18%_0)] group-hover:translate-x-[7px] group-hover:opacity-60"
                          >
                            {gate.t}
                          </span>
                        </span>
                        <span className="micro">{gate.en}</span>
                      </span>
                      <span className="mt-3 block text-[13px] tracking-[0.08em] text-ice-dim transition-transform delay-75 duration-700 ease-editorial lg:group-hover:translate-x-4">
                        {gate.d}
                      </span>
                    </span>

                    <span className="flex items-center gap-4">
                      <ArchiveImage
                        src={gate.cover}
                        alt=""
                        zoom={false}
                        sizes="64px"
                        className="h-[72px] w-[54px] lg:hidden"
                      />
                      <span
                        aria-hidden
                        className="hidden font-mono text-[11px] tracking-label text-ice-mute transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-haohan lg:inline"
                      >
                        VIEW →
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-haohan via-ice/60 to-transparent transition-transform duration-[900ms] ease-editorial group-hover:scale-x-100"
                    />
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-[calc(var(--header-offset)+2.5rem)] pt-9">
            <div className="relative aspect-[4/5] w-full">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={active.key}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.06 }}
                  animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: easeEditorial }}
                >
                  <ArchiveImage src={active.cover} alt="" zoom={false} scanlines sizes="30vw" className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
              <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(228,235,241,0.14)]" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active.key}
                  className="micro text-ice"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: easeEditorial }}
                >
                  FIG. {active.k} — {active.en}
                </motion.span>
              </AnimatePresence>
              <span className="micro">{active.t}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
