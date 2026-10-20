"use client";

import { createContext, useContext } from "react";

/** 路由转场时页面入场动效需要整体后移的秒数；首屏为 0。 */
export const EntryDelayContext = createContext(0);

export function useEntryDelay() {
  return useContext(EntryDelayContext);
}
