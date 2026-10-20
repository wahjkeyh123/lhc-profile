import type { Metadata } from "next";

import { EraTrack } from "@/components/eras/EraTrack";
import { ArchiveImage } from "@/components/media/ArchiveImage";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/page/PageHeader";
import { SectionTitle } from "@/components/page/SectionTitle";
import { eras, profile, works } from "@/lib/data";

export const metadata: Metadata = { title: "档案 · 时期" };

export default function ProfilePage() {
  const p = profile;
  const dossier: [string, string, string][] = [
    ["职业", "OCCUPATION", p.occupation],
    ["出生日期", "BORN", p.birthDate],
    ["出生地", "BIRTHPLACE", p.birthPlace],
    ["籍贯", "ANCESTRY", p.ancestry],
    ["民族", "ETHNICITY", p.ethnicity],
    ["语言", "LANGUAGE", p.language],
    ["星座", "ZODIAC", p.zodiac],
    ["身高", "HEIGHT", p.height],
    ["国籍", "NATIONALITY", p.nationality],
    ["学历", "EDUCATION", p.education],
    ["早年", "EARLY YEARS", p.earlySchool],
    ["出道", "DEBUT", `${p.debutDate} · ${p.debutWork}`],
    ["经纪", "AGENCY", p.agency],
  ];

  return (
    <>
      <PageHeader index="01" en="PROFILE" kicker="DOSSIER" title="档案 · 时期" meta={`SINCE ${p.activeFrom}`} />

      <section aria-label="个人档案" className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-[calc(var(--header-offset)+2.5rem)]">
            <figure className="relative mx-auto max-w-[360px] lg:max-w-none">
              <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 border border-[var(--rule)] lg:translate-x-5 lg:translate-y-5" />
              <ArchiveImage
                src={p.image}
                alt={`${p.name}肖像`}
                priority
                scanlines
                sizes="(min-width: 1024px) 30vw, 360px"
                objectPosition="50% 22%"
                className="relative aspect-[4/5] w-full"
              />
              <span className="micro absolute left-4 top-4 animate-flicker text-haohan">FIG. 01</span>
              <span className="micro absolute right-4 top-4 text-ice/80">PORTRAIT</span>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-4 pt-16">
                <span className="font-serifsc text-[14px] tracking-[0.3em] text-ice">{p.name}</span>
                <span className="font-display text-[12px] italic tracking-[0.24em] text-ice-dim">{p.nameEn.toUpperCase()}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="micro">FILE N°001 — IDENTITY</p>
            <h2 className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="font-serifsc text-[clamp(44px,6vw,92px)] font-semibold leading-none tracking-[0.08em] text-ice">{p.name}</span>
              <span className="font-display text-[clamp(18px,2vw,28px)] italic tracking-[0.18em] text-ice-dim">{p.nameEn}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="mt-12 grid border-t border-[var(--rule)] sm:grid-cols-2 sm:gap-x-10">
              {dossier.map(([label, en, value]) => (
                <div key={label} className="group grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-[var(--rule)] py-4">
                  <dt className="flex flex-col gap-1">
                    <span className="text-[13px] tracking-[0.16em] text-ice-dim">{label}</span>
                    <span className="font-mono text-[9px] tracking-[0.22em] text-ice-mute">{en}</span>
                  </dt>
                  <dd className="text-[14px] leading-6 tracking-[0.04em] text-ice transition-colors duration-500 group-hover:text-haohan">{value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-[var(--rule)] py-4 sm:col-span-2">
                <dt className="flex flex-col gap-1">
                  <span className="text-[13px] tracking-[0.16em] text-ice-dim">代表作</span>
                  <span className="font-mono text-[9px] tracking-[0.22em] text-ice-mute">SELECTED</span>
                </dt>
                <dd>
                  <span className="sr-only">{p.representWorks.join("、")}</span>
                  <ul aria-hidden className="flex flex-wrap gap-2">
                    {p.representWorks.map((title) => (
                      <li key={title} className="border border-[var(--rule)] px-3 py-1.5 text-[13px] tracking-[0.08em] text-ice">
                        《{title}》
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="mt-16">
            <h3 className="flex items-baseline justify-between gap-4 border-b border-[var(--rule-strong)] pb-4">
              <span className="font-serifsc text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[0.1em] text-ice">公开奖项</span>
              <span className="micro">AWARDS / {String(p.awards.length).padStart(2, "0")}</span>
            </h3>
            <ul>
              {p.awards.map((award) => (
                <li
                  key={`${award.year}-${award.title}`}
                  className="group grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-[var(--rule)] py-5 transition-colors duration-500 hover:bg-ice/[0.03] sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-baseline"
                >
                  <span className="font-display text-[22px] leading-none text-ice-dim tabular-nums">{award.year}</span>
                  <span className="text-[14px] leading-6 tracking-[0.05em] text-ice">
                    {award.title}
                    {award.work && <span className="text-ice-dim"> · {award.work}</span>}
                  </span>
                  <span
                    className={
                      award.result.startsWith("获奖")
                        ? "col-start-2 font-mono text-[11px] tracking-[0.2em] text-gilt sm:col-start-auto"
                        : "col-start-2 font-mono text-[11px] tracking-[0.2em] text-ice-mute sm:col-start-auto"
                    }
                  >
                    {award.result}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="path-title" className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:mt-40 lg:px-12">
        <SectionTitle id="path-title" kicker="PATH" title="出道路径" meta={`${String(p.path.length).padStart(2, "0")} STEPS`} />
        <ol className="relative mt-4">
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-haohan/60 via-[var(--rule)] to-transparent md:left-[calc(25%+7px)]" />
          {p.path.map((step, index) => (
            <li key={`${step.year}-${step.title}`}>
              <Reveal delay={index * 0.04} offset={18} className="group relative grid gap-3 py-8 pl-10 md:grid-cols-[25%_minmax(0,1fr)] md:gap-0 md:pl-0">
                <span className="font-display text-[clamp(30px,3.4vw,52px)] leading-none text-ice/90 tabular-nums transition-colors duration-500 group-hover:text-haohan md:pr-10 md:text-right">
                  {step.year}
                </span>
                <span
                  aria-hidden
                  className="absolute left-0 top-10 h-[15px] w-[15px] rounded-full border border-haohan/70 bg-ink transition-[background-color,box-shadow] duration-500 group-hover:bg-haohan group-hover:shadow-[0_0_18px_rgba(190,232,244,0.7)] md:left-[25%] md:top-[46px]"
                />
                <div className="md:pl-12">
                  <h3 className="font-serifsc text-[clamp(20px,2vw,26px)] font-semibold tracking-[0.08em] text-ice">{step.title}</h3>
                  <p className="mt-3 max-w-[44rem] text-[14px] leading-7 tracking-[0.05em] text-ice-dim">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section id="eras" aria-labelledby="eras-title" className="mx-auto mt-28 max-w-[1600px] scroll-mt-[var(--header-offset)] px-5 sm:px-8 lg:mt-40 lg:px-12">
        <SectionTitle id="eras-title" kicker="ERAS" title="职业时期" meta="桌面可横向翻阅，手机向下阅读完整长卷。" />
        <EraTrack eras={eras} works={works} idPrefix="profile-era" />
      </section>
    </>
  );
}
