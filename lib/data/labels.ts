import type { MaterialKind, WorkType } from "./types";

const kindLabels: Record<MaterialKind, string> = {
  official: "官宣",
  commerce: "商务",
  promo: "物料",
  magazine: "杂志",
};

export function kindLabel(kind: MaterialKind): string {
  return kindLabels[kind] ?? kind;
}

export function typeLabel(type: WorkType): string {
  return type === "movie" ? "电影" : "剧集";
}
