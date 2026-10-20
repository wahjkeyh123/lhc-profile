import type { Metadata } from "next";

import { TypeMix } from "@/components/data/TypeMix";
import { YearBars } from "@/components/data/YearBars";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/page/PageHeader";
import { SectionTitle } from "@/components/page/SectionTitle";
import { works } from "@/lib/data";

export const metadata: Metadata = { title: "数据" };

export default function DataPage() {
  const movies = works.filter((work) => work.type === "movie").length;
  const series = works.filter((work) => work.type === "series").length;

  const byYear = new Map<number, number>();
  works.forEach((work) => byYear.set(work.year, (byYear.get(work.year) ?? 0) + 1));
  const yearData = Array.from(byYear.keys())
    .sort()
    .map((year) => ({ year, count: byYear.get(year) ?? 0 }));

  const board = [
    { en: "TOTAL", label: "作品总数", value: works.length },
    { en: "MOVIE", label: "电影", value: movies },
    { en: "SERIES", label: "剧集", value: series },
  ];

  return (
    <>
      <PageHeader index="05" en="DATA" kicker="STATS" title="公开数据" meta={`${yearData[0].year} — ${yearData[yearData.length - 1].year}`} />

      <section aria-label="作品数量" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal className="grid border-y border-[var(--rule)] sm:grid-cols-3">
          {board.map((item, index) => (
            <div
              key={item.en}
              className="group relative border-b border-[var(--rule)] py-8 last:border-b-0 sm:border-b-0 sm:border-r sm:px-8 sm:py-10 sm:first:pl-0 sm:last:border-r-0"
            >
              <span
                aria-hidden
                className="flow-line absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-700 group-hover:animate-flow group-hover:opacity-100"
              />
              <div className="flex items-baseline justify-between gap-3">
                <span className="micro">N°{String(index + 1).padStart(2, "0")}</span>
                <span className="micro text-ice-dim">{item.en}</span>
              </div>
              <p className="mt-6 font-display text-[clamp(72px,9vw,148px)] leading-[0.85] tracking-[-0.03em]">
                <CountUp to={item.value} pad={2} className="text-metal" />
              </p>
              <p className="mt-5 flex items-center gap-3 text-[14px] tracking-[0.16em] text-ice-dim">
                <span aria-hidden className="h-px w-6 bg-ice/30" />
                {item.label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="year-title" className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:mt-36 lg:px-12">
        <SectionTitle id="year-title" kicker="BY YEAR" title="年份分布" meta={`${yearData.length} YEARS`} />
        <Reveal className="mt-12">
          <YearBars data={yearData} />
        </Reveal>
      </section>

      <section aria-labelledby="mix-title" className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:mt-36 lg:px-12">
        <SectionTitle id="mix-title" kicker="MIX" title="类型占比" meta={`${works.length} TITLES`} />
        <Reveal className="mt-12">
          <TypeMix movies={movies} series={series} />
        </Reveal>
      </section>
    </>
  );
}
