"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { navItems } from "@/lib/data";
import { EntryDelayContext } from "@/lib/hooks/useEntryDelay";
import { easeEditorial } from "@/lib/motion";

/** 首屏不播放转场，避免服务端 HTML 被幕布遮住而拖慢首次绘制。 */
let hasHydrated = false;

/** 幕布揭开到一半时，页面自身的入场动效再开始。 */
const ENTRY_DELAY = 0.5;

function labelFor(pathname: string) {
  const index = navItems.findIndex((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
  if (index < 0) return null;
  const item = navItems[index];
  return { no: String(index).padStart(2, "0"), en: item.en, label: item.label };
}

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [transition] = useState(() => hasHydrated);
  const label = labelFor(pathname);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <>
      {transition && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-[linear-gradient(172deg,#174a7c_0%,#0e3159_58%,#0a2443_100%)]"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: easeEditorial, delay: 0.22 }}
        >
          <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-haohan to-transparent shadow-[0_0_24px_rgba(190,232,244,0.8)]" />
          {label && (
            <motion.span
              className="flex items-baseline gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -12] }}
              transition={{ duration: 0.75, times: [0, 0.3, 0.7, 1], ease: easeEditorial }}
            >
              <span className="micro text-haohan">N°{label.no}</span>
              <span className="text-metal font-display text-[clamp(28px,4vw,56px)] italic tracking-[0.2em]">{label.en}</span>
              <span className="font-serifsc text-[15px] tracking-[0.3em] text-ice-dim">{label.label}</span>
            </motion.span>
          )}
        </motion.div>
      )}
      <EntryDelayContext.Provider value={transition ? ENTRY_DELAY : 0}>
        <motion.div
          initial={transition ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeEditorial, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </EntryDelayContext.Provider>
    </>
  );
}
