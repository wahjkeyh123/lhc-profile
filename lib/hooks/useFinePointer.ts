"use client";

import { useEffect, useState } from "react";

/**
 * 桌面端精细动效的开关：鼠标指针 + 宽屏。
 * 首次渲染返回 false，手机和服务端都按降级版本输出。
 */
export function useFinePointer(minWidth = 961): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(pointer: fine) and (min-width: ${minWidth}px)`);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [minWidth]);

  return enabled;
}
