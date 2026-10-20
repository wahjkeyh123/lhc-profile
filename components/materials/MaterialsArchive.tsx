"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { EmptyState, SearchField, Segmented, SelectField, type FilterOption } from "@/components/page/Filters";
import { cn } from "@/lib/cn";
import { kindLabel, type Era, type Material, type MaterialKind } from "@/lib/data";
import { easeEditorial } from "@/lib/motion";

type KindFilter = "all" | MaterialKind;

const kindOptions: FilterOption<KindFilter>[] = [
  { value: "all", label: "全部类型" },
  { value: "official", label: "官宣" },
  { value: "commerce", label: "商务" },
  { value: "promo", label: "物料" },
  { value: "magazine", label: "杂志" },
];

const kindEn: Record<MaterialKind, string> = {
  official: "OFFICIAL",
  commerce: "COMMERCE",
  promo: "PROMO",
  magazine: "MAGAZINE",
};

type MaterialsArchiveProps = {
  materials: Material[];
  eras: Era[];
};

/** 物料归档：类型 / 时期 / 关键词筛选的编年条目。 */
export function MaterialsArchive({ materials, eras }: MaterialsArchiveProps) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [era, setEra] = useState("all");
  const [query, setQuery] = useState("");

  const eraOptions = useMemo<FilterOption<string>[]>(
    () => [{ value: "all", label: "全部时期" }, ...eras.map((item) => ({ value: item.id, label: `${item.range} ${item.title}` }))],
    [eras]
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter(
      (item) =>
        (kind === "all" || item.kind === kind) &&
        (era === "all" || item.eraId === era) &&
        (!q || `${item.title} ${item.work} ${item.summary}`.toLowerCase().includes(q))
    );
  }, [materials, kind, era, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-y border-[var(--rule)] py-5 xl:flex-row xl:items-center">
        <Segmented id="mat-kind" label="按类型筛选" options={kindOptions} value={kind} onChange={setKind} />
        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:justify-end">
          <SelectField label="按时期筛选" options={eraOptions} value={era} onChange={setEra} className="xl:w-60" />
          <SearchField label="搜索标题或作品" placeholder="搜索标题或作品" value={query} onChange={setQuery} className="xl:w-72" />
        </div>
      </div>

      <p className="micro mt-6 flex justify-between">
        <span>ARCHIVE LOG</span>
        <span className="tabular-nums">
          {String(list.length).padStart(2, "0")} / {String(materials.length).padStart(2, "0")}
        </span>
      </p>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <ul className="mt-4 border-t border-[var(--rule)]">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((item, index) => {
              const ended = item.status === "ended";
              return (
                <motion.li
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: easeEditorial, delay: Math.min(index, 6) * 0.03 }}
                  className="group relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 border-b border-[var(--rule)] py-6 md:grid-cols-[156px_120px_minmax(0,1fr)] md:py-7"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-5 w-px origin-top scale-y-0 bg-haohan transition-transform duration-700 ease-editorial group-hover:scale-y-100 sm:-left-8 lg:-left-6"
                  />
                  <span className="whitespace-nowrap font-display text-[20px] leading-none text-ice tabular-nums md:text-[22px]">{item.date}</span>
                  <span className="flex items-center gap-2 justify-self-end md:flex-col md:items-start md:gap-1 md:justify-self-start">
                    <span className="text-[13px] tracking-[0.18em] text-ice-dim">{kindLabel(item.kind)}</span>
                    <span className="font-mono text-[9px] tracking-[0.22em] text-ice-mute">{kindEn[item.kind]}</span>
                  </span>
                  <div className="col-span-2 min-w-0 md:col-span-1">
                    <h3 className="flex flex-wrap items-center gap-3 text-[16px] font-normal leading-7 tracking-[0.06em] text-ice transition-colors duration-500 group-hover:text-haohan md:text-[18px]">
                      {item.title}
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
                      {item.summary}（{item.source}）
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
