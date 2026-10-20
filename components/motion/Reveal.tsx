"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { easeEditorial } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** 进入时的纵向位移，单位 px。 */
  offset?: number;
};

/** 进入视口时缓慢淡入并轻微上移。 */
export function Reveal({ delay = 0, offset = 26, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: easeEditorial, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
