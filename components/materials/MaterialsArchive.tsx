"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

import { EmptyState, SearchField, Segmented, SelectField, type FilterOption } from "@/components/page/Filters";
import { cn } from "@/lib/cn";
import { kindLabel, type Era, type MagazineTrack, type Material, type MaterialKind } from "@/lib/data";
import { easeEditorial } from "@/lib/motion";

type KindFilter = "all" | MaterialKind;
type MagMode = "era" | "type";
type TrackFilter = "all" | MagazineTrack;
type FormFilter = "all" | "cover" | "inside" | "campaign";

const kindOptions: FilterOption<KindFilter>[] = [
  { value: "all", label: "全部类型" },
  { value: "official", label: "官宣" },
  { value: "commerce", label: "商务" },
  { value: "promo", label: "物料" },
  { value: "magazine", label: "杂志" },
];

const magModeOptions: FilterOption<MagMode>[] = [
  { value: "era", label: "按时期" },
  { value: "type", label: "按类型" },
];

const trackOptions: FilterOption<TrackFilter>[] = [
  { value: "all", label: "全部刊物" },
  { value: "fashion", label: "时尚／设计" },
  { value: "screen", label: "电影／新闻／专业期刊" },
];

const formOptions: FilterOption<FormFilter>[] = [
  { value: "all", label: "全部版面" },
  { value: "cover", label: "封面" },
  { value: "inside", label: "内页" },
  { value: "campaign", label: "品牌投放" },
];

const kindEn: Record<MaterialKind, string> = {
  official: "OFFICIAL",
  commerce: "COMMERCE",
  promo: "PROMO",
  magazine: "MAGAZINE",
};

const trackLabel: Record<MagazineTrack, string> = {
  fashion: "时尚／设计",
  screen: "电影／新闻",
};

const placementLabel = {
  cover: "封面",
  back: "封底",
  inside: "内页",
  campaign: "投放",
} as const;

type MaterialsArchiveProps = {
  materials: Material[];
  eras: Era[];
};

function timeKey(date: string) {
  const [year = "", month = "00", day = "00"] = date.split("-");
  if (!/^\d{4}$/.test(year)) return "9999-99-99";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function isCover(item: Material) {
  return item.placement === "cover" || item.placement === "back" || !item.placement;
}

/** 物料归档：商务与杂志分块；杂志可按时期或按两类刊浏览。 */
export function MaterialsArchive({ materials, eras }: MaterialsArchiveProps) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [era, setEra] = useState("all");
  const [query, setQuery] = useState("");
  const [magMode, setMagMode] = useState<MagMode>("era");
  const [year, setYear] = useState("all");
  const [track, setTrack] = useState<TrackFilter>("all");
  const [form, setForm] = useState<FormFilter>("all");

  const eraOptions = useMemo<FilterOption<string>[]>(
    () => [{ value: "all", label: "全部时期" }, ...eras.map((item) => ({ value: item.id, label: `${item.range} ${item.title}` }))],
    [eras]
  );

  const yearOptions = useMemo<FilterOption<string>[]>(() => {
    const years = Array.from(
      new Set(materials.filter((item) => item.kind === "magazine" && /^\d{4}/.test(item.date)).map((item) => item.date.slice(0, 4)))
    ).sort();
    return [{ value: "all", label: "全部年份" }, ...years.map((value) => ({ value, label: `${value}年` }))];
  }, [materials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter(
      (item) =>
        (kind === "all" || item.kind === kind) &&
        (era === "all" || item.eraId === era) &&
        (!q || `${item.title} ${item.work} ${item.summary}`.toLowerCase().includes(q))
    );
  }, [materials, kind, era, query]);

  const split = kind === "all" || kind === "commerce" || kind === "magazine";
  const rest = split ? filtered.filter((item) => item.kind !== "commerce" && item.kind !== "magazine") : filtered;
  const commerce = filtered.filter((item) => item.kind === "commerce");
  const magazines = filtered
    .filter((item) => item.kind === "magazine")
    .filter((item) => magMode !== "era" || year === "all" || item.date.startsWith(year))
    .filter((item) => magMode !== "type" || track === "all" || item.magazineTrack === track)
    .filter((item) => magMode !== "type" || form === "all" || (form === "cover" ? isCover(item) : item.placement === form))
    .slice()
    .sort((a, b) => timeKey(a.date).localeCompare(timeKey(b.date)));

  const showRest = !split || kind === "all";
  const showCommerce = kind === "all" || kind === "commerce";
  const showMagazines = kind === "all" || kind === "magazine";
  const nothing =
    (showRest ? rest.length : 0) + (showCommerce ? commerce.length : 0) + (showMagazines ? magazines.length : 0) === 0;

  return (
    <div>
      <div className="flex flex-col gap-3 border-y border-[var(--rule)] py-5 xl:flex-row xl:items-center">
        <Segmented id="mat-kind" label="按类型筛选" options={kindOptions} value={kind} onChange={setKind} />
        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:justify-end">
          {kind !== "magazine" && (
            <SelectField label="按时期筛选" options={eraOptions} value={era} onChange={setEra} className="xl:w-60" />
          )}
          <SearchField label="搜索标题或作品" placeholder="搜索标题或作品" value={query} onChange={setQuery} className="xl:w-72" />
        </div>
      </div>

      <p className="micro mt-6 flex justify-between">
        <span>ARCHIVE LOG</span>
        <span className="tabular-nums">
          {String(filtered.length).padStart(2, "0")} / {String(materials.length).padStart(2, "0")}
        </span>
      </p>

      {nothing ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <>
          {showRest && rest.length > 0 && (
            <LogList items={rest} title={split ? "官宣 · 物料" : undefined} kicker={split ? "NOTES" : undefined} />
          )}
          {showCommerce && (
            <LogList items={commerce} title="商务" kicker="COMMERCE" />
          )}
          {showMagazines && (
            <section aria-label="杂志" className="mt-16">
              <div className="flex flex-col gap-6 border-b border-[var(--rule)] pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="micro text-haohan">MAGAZINE</p>
                  <h2 className="mt-3 font-serifsc text-[clamp(28px,3vw,44px)] font-semibold tracking-[0.08em] text-ice">杂志</h2>
                  <p className="mt-3 max-w-[40rem] text-[13px] leading-6 tracking-[0.04em] text-ice-dim">
                    查看杂志来源地址，请点击杂志名字。有官方图片的用官方链接，没有官方原帖的才用粉丝或认证媒体链接。按时期用年份筛选。按类型时自己选择刊物类别和版面。
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {magMode === "era" ? (
                    <SelectField label="按年份筛选" options={yearOptions} value={year} onChange={setYear} className="sm:w-40" />
                  ) : (
                    <>
                      <SelectField label="按刊物类别筛选" options={trackOptions} value={track} onChange={setTrack} className="sm:w-56" />
                      <SelectField label="按版面筛选" options={formOptions} value={form} onChange={setForm} className="sm:w-40" />
                    </>
                  )}
                  <Segmented id="mag-mode" label="杂志浏览方式" options={magModeOptions} value={magMode} onChange={setMagMode} />
                </div>
              </div>

              {magazines.length === 0 ? (
                <div className="mt-6">
                  <EmptyState />
                </div>
              ) : (
                <LogList items={magazines} />
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function LogList({ items, title, kicker }: { items: Material[]; title?: string; kicker?: string }) {
  return (
    <div className={title ? "mt-12" : "mt-4"}>
      {title && (
        <div className="flex items-end justify-between gap-4 border-b border-[var(--rule-strong)] pb-3">
          <div>
            {kicker && <p className="micro">{kicker}</p>}
            <h3 className="mt-2 font-serifsc text-[clamp(22px,2.4vw,32px)] font-semibold tracking-[0.08em] text-ice">{title}</h3>
          </div>
          <span className="micro tabular-nums">{String(items.length).padStart(2, "0")}</span>
        </div>
      )}
      {items.length === 0 ? (
        <p className="border-b border-[var(--rule)] py-8 text-[13px] tracking-[0.08em] text-ice-mute">这个筛选下暂无条目。</p>
      ) : (
        <ul className={title ? "" : "border-t border-[var(--rule)]"}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, index) => (
              <MaterialRow key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function CoverShot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[3/4] w-[88px] overflow-hidden bg-ink-700 sm:w-[120px]">
      <Image src={src} alt={alt} fill sizes="120px" className="object-cover" />
    </div>
  );
}

function MaterialRow({ item, index }: { item: Material; index: number }) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const ended = item.status === "ended";
  const track = item.magazineTrack ? trackLabel[item.magazineTrack] : null;
  const placement = item.placement ? placementLabel[item.placement] : item.kind === "magazine" ? "封面" : null;
  const photos = item.images ?? [];
  const cover = photos[0];
  const titleClass = "text-left text-[16px] font-normal leading-7 tracking-[0.06em] text-ice transition-colors duration-500 hover:text-haohan md:text-[18px]";

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: easeEditorial, delay: Math.min(index, 6) * 0.03 }}
      className="group relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 border-b border-[var(--rule)] py-6 md:grid-cols-[156px_132px_minmax(0,1fr)] md:py-7"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 -left-5 w-px origin-top scale-y-0 bg-haohan transition-transform duration-700 ease-editorial group-hover:scale-y-100 sm:-left-8 lg:-left-6"
      />
      <span className="whitespace-nowrap font-display text-[20px] leading-none text-ice tabular-nums md:text-[22px]">{item.date}</span>
      <span className="flex items-center gap-2 justify-self-end md:flex-col md:items-start md:gap-1 md:justify-self-start">
        <span className="text-[13px] tracking-[0.18em] text-ice-dim">{track ?? kindLabel(item.kind)}</span>
        <span className="font-mono text-[9px] tracking-[0.22em] text-ice-mute">{kindEn[item.kind]}</span>
      </span>
      <div className="col-span-2 min-w-0 md:col-span-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
        <h3 className="flex flex-wrap items-center gap-3">
          {item.kind === "magazine" && item.sourceUrl ? (
            <button type="button" className={titleClass} aria-expanded={sourceOpen} onClick={() => setSourceOpen((value) => !value)}>
              {item.title}
            </button>
          ) : (
            <span className={titleClass}>{item.title}</span>
          )}
          {placement && (
            <span
              className={cn(
                "px-3 py-1 text-[14px] font-medium tracking-[0.18em]",
                item.placement === "inside" && "bg-haohan text-ink",
                item.placement === "cover" && "border border-haohan/70 text-haohan",
                item.placement === "back" && "border border-ice/50 text-ice",
                item.placement === "campaign" && "border border-gilt/70 text-gilt"
              )}
            >
              {placement}
            </span>
          )}
          {item.kind === "commerce" && (
            <span
              className={cn(
                "border px-2 py-0.5 font-mono text-[10px] tracking-[0.2em]",
                ended ? "border-[var(--rule)] text-ice-mute" : "border-gilt/60 text-gilt"
              )}
            >
              {ended ? "到期" : "在约"}
            </span>
          )}
        </h3>
        <p className="mt-2 max-w-[56rem] text-[13px] leading-6 tracking-[0.04em] text-ice-dim">
          {item.work ? `关联：${item.work} · ` : ""}
          {item.summary}
          {item.kind !== "magazine" ? `（${item.source}）` : ""}
        </p>
        {sourceOpen && item.sourceUrl && (
          <p className="mt-3 max-w-[40rem] select-all break-all border border-[var(--rule)] bg-ink/40 px-3 py-2 font-mono text-[13px] leading-6 text-ice">
            {item.sourceUrl}
          </p>
        )}
          </div>
          {cover && (
            <div className="shrink-0">
              <CoverShot src={cover} alt={`${item.title}封面`} />
              {photos.length > 1 && (
                <button
                  type="button"
                  className="mt-2 block text-left text-[12px] tracking-[0.08em] text-haohan"
                  aria-expanded={galleryOpen}
                  onClick={() => setGalleryOpen((value) => !value)}
                >
                  {galleryOpen ? "收起图片" : "查看全部图片"}
                </button>
              )}
            </div>
          )}
        </div>
        {galleryOpen && (
          <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {photos.map((src, photoIndex) => (
              <li key={src} className="w-[120px] shrink-0">
                <CoverShot src={src} alt={`${item.title} 图 ${photoIndex + 1}`} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.li>
  );
}
