"use client";

import { motion } from "framer-motion";

import { Starfield } from "@/components/layout/Starfield";
import { cn } from "@/lib/cn";
import { useFinePointer } from "@/lib/hooks/useFinePointer";
import { useMotionAllowed } from "@/lib/hooks/useMotionAllowed";

/** 全站固定背景：黑蓝渐变、星空画布、冷雾、金属光束、低透明网格、扫描线与胶片颗粒。 */
export function Atmosphere() {
  const fine = useFinePointer();
  const allowed = useMotionAllowed();
  const drift = fine && allowed;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(172deg,#174a7c_0%,#123f6c_26%,#0e3159_58%,#0a2443_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_68%_0%,rgba(140,206,240,0.36),rgba(140,206,240,0.08)_52%,transparent_78%)]" />
      <Starfield className="absolute inset-0 h-full w-full" />

      <motion.div
        className="absolute -right-[22%] -top-[28%] h-[82vmax] w-[82vmax] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(126,198,238,0.3), rgba(126,198,238,0.08) 40%, transparent 66%)" }}
        animate={drift ? { x: [0, -48, 0], y: [0, 36, 0] } : undefined}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[36%] -left-[24%] h-[70vmax] w-[70vmax] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(190,232,244,0.14), transparent 60%)" }}
        animate={drift ? { x: [0, 40, 0], y: [0, -24, 0] } : undefined}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -top-[20%] left-[8%] h-[150%] w-[26%] rotate-[16deg]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(228,235,241,0.045) 45%, rgba(190,232,244,0.06) 50%, rgba(228,235,241,0.04) 55%, transparent)" }}
        animate={drift ? { x: ["-18%", "22%"] } : undefined}
        transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_62%_28%,black_10%,transparent_72%)]" />
      <div className="scanlines absolute inset-0 opacity-30" />
      <div className={cn("grain-layer absolute -inset-[12%] opacity-[0.075] mix-blend-overlay", drift && "animate-grain")} />
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_0%,transparent_60%,rgba(6,20,38,0.5)_100%)]" />
    </div>
  );
}
