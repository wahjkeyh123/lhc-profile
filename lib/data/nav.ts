export type NavKey = "home" | "profile" | "works" | "eras" | "materials" | "data";

export type NavItem = {
  key: NavKey;
  href: string;
  label: string;
  en: string;
};

export const navItems: NavItem[] = [
  { key: "home", href: "/", label: "首页", en: "INDEX" },
  { key: "profile", href: "/profile", label: "档案", en: "PROFILE" },
  { key: "works", href: "/works", label: "作品", en: "WORKS" },
  { key: "eras", href: "/eras", label: "时期", en: "ERA" },
  { key: "materials", href: "/materials", label: "物料", en: "MATERIALS" },
  { key: "data", href: "/data", label: "数据", en: "DATA" },
];

export type HomeGate = {
  key: Exclude<NavKey, "home">;
  href: string;
  k: string;
  t: string;
  d: string;
  en: string;
  /** 目录悬停预览图，复用 public/assets 下的既有图片。 */
  cover: string;
};

export const homeGates: HomeGate[] = [
  { key: "profile", href: "/profile", k: "01", t: "档案", d: "籍贯、母校与出道路径。", en: "PROFILE", cover: "/assets/profile/liu-haocun.jpg" },
  { key: "works", href: "/works", k: "02", t: "作品", d: "电影与剧集可筛选翻阅。", en: "WORKS", cover: "/assets/works/one-second.jpg" },
  { key: "eras", href: "/eras", k: "03", t: "时期", d: "从一秒钟到现役阶段。", en: "ERA", cover: "/assets/works/cliff-walkers.jpg" },
  { key: "materials", href: "/materials", k: "04", t: "物料", d: "官宣、商务与宣发归档。", en: "MATERIALS", cover: "/assets/works/brilliant-her.jpg" },
  { key: "data", href: "/data", k: "05", t: "数据", d: "年份与类型分布。", en: "DATA", cover: "/assets/works/girl-who-wanted-to-fly.jpg" },
];
