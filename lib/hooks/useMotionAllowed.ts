"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * 挂载后才返回 true，避免服务端与客户端首帧不一致；
 * 用户开启「减少动态效果」时始终为 false。
 */
export function useMotionAllowed(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && !reduce;
}
