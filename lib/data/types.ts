export type SiteMeta = {
  title: string;
  tagline: string;
  disclaimer: string;
};

export type PathStep = {
  year: string;
  title: string;
  text: string;
};

export type Award = {
  year: string;
  title: string;
  /** 空字符串表示该奖项未绑定具体作品。 */
  work: string;
  result: string;
};

export type Profile = {
  name: string;
  nameEn: string;
  birthPlace: string;
  birthDate: string;
  nationality: string;
  occupation: string;
  education: string;
  earlySchool: string;
  debutDate: string;
  debutWork: string;
  activeFrom: number;
  representWorks: string[];
  path: PathStep[];
  image: string;
  ancestry: string;
  ethnicity: string;
  language: string;
  zodiac: string;
  height: string;
  agency: string;
  awards: Award[];
};

export type EraId = "debut" | "breakout" | "range" | "multi" | "now";

export type Era = {
  id: EraId;
  range: string;
  title: string;
  summary: string;
};

export type WorkType = "movie" | "series";

export type Work = {
  id: string;
  year: number;
  title: string;
  type: WorkType;
  role: string;
  eraId: EraId;
  note: string;
  image: string;
};

export type MaterialKind = "official" | "promo" | "commerce" | "magazine";

/** 仅商务条目带合约状态。 */
export type MaterialStatus = "active" | "ended";

export type Material = {
  id: string;
  date: string;
  eraId: EraId;
  kind: MaterialKind;
  title: string;
  /** 空字符串表示未关联作品。 */
  work: string;
  summary: string;
  source: string;
  status?: MaterialStatus;
};
