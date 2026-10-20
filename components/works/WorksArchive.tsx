"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { ArchiveImage } from "@/components/media/ArchiveImage";
import { EmptyState, SearchField, Segmented, SelectField, type FilterOption } from "@/components/page/Filters";
import { cn } from "@/lib/cn";
import { typeLabel, type Work, type WorkType } from "@/lib/data";
import { easeEditorial } from "@/lib/motion";

type TypeFilter = "all" | WorkType;

const typeOptions: FilterOption<TypeFilter>[] = [
  { value: "all", label: "全部" },
  { value: "movie", label: "电影" },
  { value: "series", label: "剧集" },
];

/** 作品库：类型 / 年份 / 关键词筛选，海报卡片点击展开备注。 */
export function WorksArchive({ works }: { works: Work[] }) {
  const [type, setType] = useState<TypeFilter>("all");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const yearOptions = useMemo<FilterOption<string>[]>(
    () => [
      { value: "all", label: "全部年份" },
      ...Array.from(new Set(works.map((work) => work.year)))
        .sort()
        .map((value) => ({ value: String(value), label: `${value}年` })),
    ],
    [works]
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter(
      (work) =>
        (type === "all" || work.type === type) &&
        (year === "all" || String(work.year) === year) &&
        (!q || `${work.title} ${work.role} ${work.note}`.toLowerCase().includes(q))
    );
  }, [works, type, year, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-y border-[var(--rule)] py-5 md:flex-row md:items-center">
        <Segmented id="work-type" label="按类型筛选" options={typeOptions} value={type} onChange={setType} />
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-1 md:justify-end">
          <SelectField label="按年份筛选" options={yearOptions} value={year} onChange={setYear} className="md:w-44" />
          <SearchField label="搜索片名或角色" placeholder="搜索片名或角色" value={query} onChange={setQuery} className="md:w-72" />
        </div>
      </div>

      <p className="micro mt-6 flex justify-between">
        <span>FILMOGRAPHY INDEX</span>
        <span className="tabular-nums">
          {String(list.length).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
        </span>
      </p>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-x-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((work) => {
              const open = openId === work.id;
              const index = works.indexOf(work) + 1;
              return (
                <motion.li
                  key={work.id}
                  layout="position"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: easeEditorial }}
                  className={cn(open && "sm:col-span-2")}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : work.id)}
                    className={cn(
                      "group block w-full text-left transition-transform duration-700 ease-editorial hover:-translate-y-1.5",
                      open && "sm:grid sm:grid-cols-2 sm:gap-5"
                    )}
                  >
                    <div className="relative">
                      <ArchiveImage
                        src={work.image}
                        alt={`《${work.title}》海报`}
                        hoverZoom
                        sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 48vw"
                        className="aspect-[2/3] w-full"
                      />
                      <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(228,240,248,0.12)] transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(190,232,244,0.55)]" />
                      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink/80 to-transparent" />
                      <span className="micro absolute left-3 top-3 text-ice">{work.year}</span>
                      <span className="micro absolute right-3 top-3 text-ice/70">N°{String(index).padStart(2, "0")}</span>
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent px-3 pb-3 pt-14">
                        <span className="block font-serifsc text-[clamp(16px,1.5vw,21px)] font-semibold tracking-[0.08em] text-ice transition-colors duration-500 group-hover:text-haohan">
                          {work.title}
                        </span>
                      </span>
                    </div>

                    <div className={cn("pt-3", open && "sm:flex sm:flex-col sm:justify-end sm:pt-0")}>
                      <p className="text-[12px] tracking-[0.1em] text-ice-dim">
                        {typeLabel(work.type)} · 饰 {work.role}
                      </p>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: easeEditorial }}
                            className="overflow-hidden text-[13px] leading-6 tracking-[0.05em] text-haohan/90"
                          >
                            <span className="block pt-3">{work.note}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <span aria-hidden className="mt-3 block font-mono text-[10px] tracking-label text-ice-mute transition-colors duration-500 group-hover:text-ice">
                        {open ? "CLOSE —" : "NOTE +"}
                      </span>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
