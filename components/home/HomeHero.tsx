"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

import { ArchiveImage } from "@/components/media/ArchiveImage";
import { GlitchText } from "@/components/motion/GlitchText";
import type { NavItem } from "@/lib/data";
import { useEntryDelay } from "@/lib/hooks/useEntryDelay";
import { useFinePointer } from "@/lib/hooks/useFinePointer";
import { useMotionAllowed } from "@/lib/hooks/useMotionAllowed";
import { easeEditorial } from "@/lib/motion";

type HomeHeroProps = {
  kicker: string;
  title: string;
  titleEn: string;
  lead: string;
  portrait: string;
  name: string;
  nameEn: string;
  yearFrom: number;
  yearTo: number;
  keywords: NavItem[];
};

function CornerMarks() {
  const mark = "absolute h-3 w-3 border-ice/50";
  return (
    <>
      <span aria-hidden className={`${mark} left-2 top-2 border-l border-t`} />
      <span aria-hidden className={`${mark} right-2 top-2 border-r border-t`} />
      <span aria-hidden className={`${mark} bottom-2 left-2 border-b border-l`} />
      <span aria-hidden className={`${mark} bottom-2 right-2 border-b border-r`} />
    </>
  );
}

export function HomeHero({
  kicker,
  title,
  titleEn,
  lead,
  portrait,
  name,
  nameEn,
  yearFrom,
  yearTo,
  keywords,
}: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const allowed = useMotionAllowed();
  const fine = useFinePointer();
  const parallax = allowed && fine;
  const offset = useEntryDelay();
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: easeEditorial, delay: delay + offset },
  });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  const chars = Array.from(title);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-[var(--header-offset)]" aria-labelledby="home-title">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <motion.line
          x1="0%"
          y1="100%"
          x2="72%"
          y2="0%"
          stroke="rgba(228,235,241,0.12)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: easeEditorial, delay: 0.4 + offset }}
        />
      </svg>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <motion.div
          className="micro flex items-center justify-between gap-4 border-b border-[var(--rule)] py-4"
          {...enter(0.05)}
        >
          <span>N°001 — ARCHIVE</span>
          <span className="hidden text-ice-dim md:inline">{kicker}</span>
          <span className="tabular-nums">
            {yearFrom} — {yearTo}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-y-10 pb-16 pt-10 lg:min-h-[calc(100svh-var(--header-offset)-57px)] lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-14">
          <motion.div
            className="relative z-10 flex flex-col lg:col-span-7 lg:row-start-1"
            style={parallax ? { y: titleY, opacity: fade } : undefined}
          >
            <motion.p className="micro mb-6 text-haohan md:hidden" {...enter(0.1)}>
              {kicker}
            </motion.p>

            <h1 id="home-title" aria-label={title} className="relative lg:-mr-[22%]">
              <GlitchText
                text={title}
                className="max-w-full font-serifsc text-[clamp(64px,17vw,288px)] font-semibold leading-[0.84] tracking-[-0.04em]"
              >
                <span aria-hidden className="text-metal flex">
                  {chars.map((char, index) => (
                    <span key={`${char}-${index}`} className="inline-block overflow-hidden pb-[0.06em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: "108%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1.4, ease: easeEditorial, delay: 0.25 + index * 0.12 + offset }}
                      >
                        {char}
                      </motion.span>
                    </span>
                  ))}
                </span>
              </GlitchText>
            </h1>

            <motion.div className="mt-8 flex items-center gap-5" {...enter(0.75)}>
              <span aria-hidden className="h-px w-16 bg-ice/40" />
              <span className="font-display text-[clamp(18px,1.6vw,26px)] italic tracking-[0.42em] text-ice-dim">
                {titleEn}
              </span>
            </motion.div>

            <motion.p
              className="mt-10 max-w-[31rem] text-[15px] font-light leading-8 tracking-[0.06em] text-ice-dim"
              {...enter(0.9)}
            >
              {lead}
            </motion.p>

            <motion.nav aria-label="首页关键词" className="mt-auto pt-12" {...enter(1.05)}>
              <ul className="flex flex-wrap gap-x-7 gap-y-3">
                {keywords.map((item, index) => (
                  <li key={item.key}>
                    <Link href={item.href} className="group relative inline-flex items-baseline gap-2 py-1">
                      <span className="font-mono text-[9px] text-ice-mute">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[11px] tracking-label text-ice transition-colors duration-500 group-hover:text-haohan">
                        {item.en}
                      </span>
                      <span className="sr-only">{item.label}</span>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-haohan transition-transform duration-700 ease-editorial group-hover:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>

          <div className="flex justify-end lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:items-center">
          <div className="relative w-[68%] max-w-[320px] sm:max-w-[360px] lg:w-full lg:max-w-[400px]">
            <motion.div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 border border-[var(--rule)] lg:translate-x-6 lg:translate-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.1 + offset }}
            />
            <motion.figure
              className="relative"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.6, ease: easeEditorial, delay: 0.2 + offset }}
            >
              <motion.div style={parallax ? { y: imageY, scale: imageScale } : undefined}>
                <ArchiveImage
                  src={portrait}
                  alt={`${name}肖像`}
                  priority
                  zoom
                  scanlines
                  sizes="(min-width: 1024px) 400px, 68vw"
                  className="aspect-[4/5] w-full"
                  objectPosition="50% 22%"
                />
              </motion.div>
              <CornerMarks />
              <span className="micro absolute left-4 top-4 animate-flicker text-haohan">FIG. 01</span>
              <span className="micro absolute right-4 top-4 text-ice/80">PROFILE</span>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-4 pt-16">
                <span className="font-serifsc text-[14px] tracking-[0.3em] text-ice">{name}</span>
                <span className="font-display text-[12px] italic tracking-[0.24em] text-ice-dim">{nameEn.toUpperCase()}</span>
              </figcaption>
            </motion.figure>

            <span
              aria-hidden
              className="micro absolute -left-8 top-full hidden origin-top-left -rotate-90 whitespace-nowrap xl:block"
            >
              HAOHAN BLUE ARCHIVE — 浩瀚蓝
            </span>
          </div>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="micro absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
          {...enter(1.4)}
        >
          <span>SCROLL</span>
          <span className="relative block h-10 w-px overflow-hidden bg-[var(--rule)]">
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-haohan"
              animate={allowed ? { y: ["-100%", "200%"] } : undefined}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
