import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

type SectionTitleProps = {
  id: string;
  kicker: string;
  title: string;
  meta?: ReactNode;
};

/** 内页分区标题：英文小标签 + 中文衬线标题，右侧附元信息，底部细线。 */
export function SectionTitle({ id, kicker, title, meta }: SectionTitleProps) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-[var(--rule)] pb-6">
      <div>
        <p className="micro text-haohan">{kicker}</p>
        <h2 id={id} className="mt-4 font-serifsc text-[clamp(32px,4.4vw,64px)] font-semibold leading-none tracking-[0.06em] text-ice">
          {title}
        </h2>
      </div>
      {meta && <p className="font-mono text-[11px] tracking-[0.2em] text-ice-mute">{meta}</p>}
    </Reveal>
  );
}
