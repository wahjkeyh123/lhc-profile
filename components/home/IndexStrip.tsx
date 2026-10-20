import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export type IndexStat = {
  id: string;
  en: string;
  label: string;
  value: number;
  from?: number;
  pad?: number;
};

type IndexStripProps = {
  stats: IndexStat[];
  tag: string;
};

/** 首页数字索引条：fashion 数字铭牌，不做厚重卡片。 */
export function IndexStrip({ stats, tag }: IndexStripProps) {
  return (
    <section aria-label="站点索引" className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
      <Reveal className="grid grid-cols-2 border-y border-[var(--rule)] md:grid-cols-[minmax(0,0.7fr)_repeat(3,minmax(0,1fr))_minmax(0,1.2fr)]">
        <div className="col-span-2 flex items-center justify-between border-b border-[var(--rule)] py-4 md:col-span-1 md:flex-col md:items-start md:justify-between md:border-b-0 md:border-r md:py-7 md:pr-6">
          <span className="micro text-ice">INDEX</span>
          <span className="micro">索引 / 0{stats.length}</span>
        </div>

        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={cn(
              "group relative border-[var(--rule)] py-7 pl-5 pr-4 md:border-r md:py-9 md:pl-7",
              index % 2 === 0 && "border-r",
              index >= 2 && "border-t md:border-t-0"
            )}
          >
            <span
              aria-hidden
              className="flow-line absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-700 group-hover:animate-flow group-hover:opacity-100"
            />
            <div className="flex items-baseline justify-between gap-3">
              <span className="micro">N°{String(index + 1).padStart(2, "0")}</span>
              <span className="micro text-ice-dim">{stat.en}</span>
            </div>
            <p className="mt-5 font-display text-[clamp(52px,6.4vw,104px)] font-normal leading-[0.9] tracking-[-0.03em]">
              <CountUp to={stat.value} from={stat.from} pad={stat.pad} className="text-metal" />
            </p>
            <p className="mt-4 flex items-center gap-3 text-[13px] tracking-[0.12em] text-ice-dim sm:whitespace-nowrap">
              <span aria-hidden className="h-px w-5 bg-ice/30" />
              {stat.label}
            </p>
          </div>
        ))}

        <div className="col-span-2 flex flex-col justify-between gap-4 border-t border-[var(--rule)] py-7 md:col-span-1 md:border-t-0 md:pl-7 md:py-9">
          <span className="micro">TAG</span>
          <p className="font-serifsc text-[18px] leading-8 tracking-[0.14em] text-ice">{tag}</p>
          <span aria-hidden className="h-px w-10 bg-gilt/70" />
        </div>
      </Reveal>
    </section>
  );
}
