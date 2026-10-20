import type { Metadata } from "next";

import { EraTrack } from "@/components/eras/EraTrack";
import { PageHeader } from "@/components/page/PageHeader";
import { eras, works } from "@/lib/data";

export const metadata: Metadata = { title: "时期" };

export default function ErasPage() {
  return (
    <>
      <PageHeader index="03" en="ERA" kicker="ERAS" title="职业时期" meta={`${String(eras.length).padStart(2, "0")} ERAS`}>
        <p className="max-w-[34rem] pb-10 text-[14px] leading-7 tracking-[0.06em] text-ice-dim">桌面可横向翻阅，手机向下阅读完整长卷。</p>
      </PageHeader>

      <section aria-label="职业时期长卷" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <EraTrack eras={eras} works={works} />
      </section>
    </>
  );
}
