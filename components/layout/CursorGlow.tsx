"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

import { useFinePointer } from "@/lib/hooks/useFinePointer";
import { useMotionAllowed } from "@/lib/hooks/useMotionAllowed";

const SIZE = 560;

export function CursorGlow() {
  const fine = useFinePointer();
  const allowed = useMotionAllowed();
  const enabled = fine && allowed;

  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const sx = useSpring(x, { stiffness: 110, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 110, damping: 22, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 50 });
  const dotY = useSpring(y, { stiffness: 900, damping: 50 });

  useEffect(() => {
    if (!enabled) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] rounded-full mix-blend-screen"
        style={{
          x: sx,
          y: sy,
          width: SIZE,
          height: SIZE,
          marginLeft: -SIZE / 2,
          marginTop: -SIZE / 2,
          background: "radial-gradient(circle, rgba(190,232,244,0.085), rgba(79,184,255,0.03) 34%, transparent 64%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[61] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-haohan/80 mix-blend-screen"
        style={{ x: dotX, y: dotY }}
      />
    </>
  );
}
