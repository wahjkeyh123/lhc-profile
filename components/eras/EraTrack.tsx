"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArchiveImage } from "@/components/media/ArchiveImage";
import { cn } from "@/lib/cn";
import { typeLabel, type Era, type EraId, type Work } from "@/lib/data";
import { easeEditorial } from "@/lib/motion";

const STORAGE_KEY = "haohan-era";
const STACKED_QUERY = "(max-width: 1023px)";

type EraTrackProps = {
  eras: Era[];
  works: Work[];
  /** 同页渲染多条长卷时用于区分锚点与滑块。 */
  idPrefix?: string;
};

/** 职业时期长卷：桌面横向翻页，手机纵向完整阅读；记住上次停留的时期。 */
export function EraTrack({ eras, works, idPrefix = "era" }: EraTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<EraId>(eras[0].id);
  const lockRef = useRef(0);
  const [active, setActive] = useState<EraId>(eras[0].id);
  const reduce = useReducedMotion();
  const { scrollXProgress } = useScroll({ container: trackRef });

  const slideId = useCallback((id: EraId) => `${idPrefix}-${id}`, [idPrefix]);

  const mark = useCallback((id: EraId) => {
    activeRef.current = id;
    setActive(id);
  }, []);

  const go = useCallback(
    (id: EraId, { focus = false, persist = true }: { focus?: boolean; persist?: boolean } = {}) => {
      const slide = document.getElementById(slideId(id));
      const track = trackRef.current;
      if (!slide || !track) return;
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";

      if (window.matchMedia(STACKED_QUERY).matches) {
        slide.scrollIntoView({ behavior, block: "nearest" });
      } else {
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior });
      }

      mark(id);
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, id);
        } catch {
          // 浏览器禁用本地存储时仍保留时期浏览功能。
        }
      }
      if (focus) slide.focus({ preventScroll: true });
    },
    [mark, reduce, slideId]
  );

  useEffect(() => {
    let saved = eras[0].id;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const match = eras.find((era) => era.id === stored);
      if (match) saved = match.id;
    } catch {
      // 使用首个时期作为安全回退。
    }
    mark(saved);
    if (!window.matchMedia(STACKED_QUERY).matches) {
      const slide = document.getElementById(slideId(saved));
      const track = trackRef.current;
      if (slide && track) track.scrollLeft = slide.offsetLeft - track.offsetLeft;
    }
  }, [eras, mark, slideId]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const layout = window.matchMedia(STACKED_QUERY);
    let observer: IntersectionObserver | undefined;

    const create = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) mark(visible.target.getAttribute("data-era") as EraId);
        },
        layout.matches
          ? { root: null, rootMargin: "-18% 0px -52% 0px", threshold: [0, 0.25, 0.55] }
          : { root: track, threshold: [0.4, 0.6, 0.8] }
      );
      track.querySelectorAll("[data-era]").forEach((slide) => observer?.observe(slide));
    };

    const onLayout = () => {
      create();
      if (!layout.matches) requestAnimationFrame(() => go(activeRef.current, { persist: false }));
    };

    create();
    layout.addEventListener("change", onLayout);
    return () => {
      observer?.disconnect();
      layout.removeEventListener("change", onLayout);
    };
  }, [go, mark]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;

    const onWheel = (event: WheelEvent) => {
      if (window.matchMedia(STACKED_QUERY).matches) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const index = eras.findIndex((era) => era.id === activeRef.current);
      const next = index + (event.deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= eras.length) return;
      event.preventDefault();
      const now = performance.now();
      if (now < lockRef.current) return;
      lockRef.current = now + 720;
      go(eras[next].id);
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [eras, go, reduce]);

  const activeIndex = eras.findIndex((era) => era.id === active);

  return (
    <div>
      <div className="sticky top-[var(--header-offset)] z-20 -mx-5 border-y border-[var(--rule)] bg-ink/70 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-x-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <div className="flex items-stretch justify-between gap-6">
          <div role="group" aria-label="时期快速导航" className="no-scrollbar -mb-px flex overflow-x-auto">
            {eras.map((era, index) => {
              const on = era.id === active;
              return (
                <button
                  key={era.id}
                  type="button"
                  aria-controls={slideId(era.id)}
                  aria-current={on ? "true" : undefined}
                  onClick={() => go(era.id, { focus: true })}
                  className={cn(
                    "relative flex min-h-[52px] shrink-0 items-center gap-3 px-4 transition-colors duration-500 first:pl-0",
                    on ? "text-ice" : "text-ice-mute hover:text-ice"
                  )}
                >
                  <span className="font-mono text-[10px] tracking-[0.2em]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[15px] tracking-[0.06em] tabular-nums">{era.range}</span>
                  {on && (
                    <motion.span
                      layoutId={`${idPrefix}-tick`}
                      className="absolute inset-x-0 bottom-0 h-px bg-haohan"
                      transition={{ duration: 0.6, ease: easeEditorial }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <span className="micro hidden shrink-0 items-center tabular-nums lg:flex">
            {String(activeIndex + 1).padStart(2, "0")} / {String(eras.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative mt-8 hidden h-px bg-[var(--rule)] lg:block">
        <motion.span className="absolute inset-0 origin-left bg-haohan/80" style={{ scaleX: scrollXProgress }} />
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar mt-8 flex flex-col gap-6 lg:snap-x lg:snap-mandatory lg:flex-row lg:overflow-x-auto lg:pb-2"
      >
        {eras.map((era, index) => {
          const list = works.filter((work) => work.eraId === era.id);
          const on = era.id === active;
          return (
            <article
              key={era.id}
              id={slideId(era.id)}
              data-era={era.id}
              tabIndex={-1}
              className={cn(
                "glass-thin relative shrink-0 scroll-mt-[150px] overflow-hidden p-6 outline-none transition-[opacity,box-shadow] duration-700 ease-editorial sm:p-8 lg:w-[min(82%,1120px)] lg:snap-start lg:p-10",
                on ? "lg:opacity-100" : "lg:opacity-45"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-haohan to-transparent transition-opacity duration-700",
                  on ? "opacity-100" : "opacity-0"
                )}
              />
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <p className="micro flex items-center gap-3">
                    <span className="text-haohan">ERA {String(index + 1).padStart(2, "0")}</span>
                    <span aria-hidden className="h-px w-8 bg-[var(--rule-strong)]" />
                    <span>{String(list.length).padStart(2, "0")} WORKS</span>
                  </p>
                  <p className="text-metal mt-6 font-display text-[clamp(44px,5.6vw,88px)] leading-[0.92] tracking-[-0.02em] tabular-nums">
                    {era.range}
                  </p>
                  <h3 className="mt-6 font-serifsc text-[clamp(24px,2.6vw,36px)] font-semibold tracking-[0.06em] text-ice">{era.title}</h3>
                  <p className="mt-4 max-w-[30rem] text-[14px] leading-7 tracking-[0.05em] text-ice-dim">{era.summary}</p>
                </div>

                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-4 lg:self-end xl:grid-cols-5">
                  {list.map((work) => (
                    <li key={work.id} className="group">
                      <ArchiveImage
                        src={work.image}
                        alt={`《${work.title}》海报`}
                        sizes="(min-width: 1024px) 180px, 45vw"
                        hoverZoom
                        className="aspect-[2/3] w-full"
                      />
                      <p className="mt-3 text-[12px] leading-5 tracking-[0.06em] text-ice-dim transition-colors duration-500 group-hover:text-haohan">
                        {work.year} · {work.title} · {typeLabel(work.type)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
