import { ContentsDirectory } from "@/components/home/ContentsDirectory";
import { HomeHero } from "@/components/home/HomeHero";
import { IndexStrip, type IndexStat } from "@/components/home/IndexStrip";
import { eras, homeGates, navItems, profile, site, works } from "@/lib/data";

export default function HomePage() {
  const latestYear = Math.max(...works.map((work) => work.year));

  const stats: IndexStat[] = [
    { id: "works", en: "WORKS", label: "公开收录作品", value: works.length, pad: 2 },
    { id: "eras", en: "ERAS", label: "职业时期", value: eras.length, pad: 2 },
    { id: "from", en: "SINCE", label: "活跃起始年", value: profile.activeFrom, from: profile.activeFrom - 20 },
  ];

  return (
    <>
      <HomeHero
        kicker="FAN ARCHIVE · CINEMA RECORD"
        title="浩瀚蓝"
        titleEn="HAOHAN BLUE"
        lead="以浩瀚星空蓝为底、天光为晕、银白为字、淡金为点：把刘浩存公开可见的银幕履历，收成一部可翻阅的影院纪录。"
        portrait={profile.image}
        name={profile.name}
        nameEn={profile.nameEn}
        yearFrom={profile.activeFrom}
        yearTo={latestYear}
        keywords={navItems.filter((item) => item.key !== "home")}
      />
      <IndexStrip stats={stats} tag={site.tagline} />
      <ContentsDirectory kicker="ENTER" title="进入纪录" gates={homeGates} />
    </>
  );
}
