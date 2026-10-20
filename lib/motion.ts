import type { Transition, Variants } from "framer-motion";

export const easeEditorial = [0.22, 1, 0.36, 1] as const;

export const slow: Transition = { duration: 1.1, ease: easeEditorial };

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: slow },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
