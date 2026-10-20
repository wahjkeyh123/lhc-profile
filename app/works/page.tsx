import type { Metadata } from "next";

import { PageHeader } from "@/components/page/PageHeader";
import { WorksArchive } from "@/components/works/WorksArchive";
import { works } from "@/lib/data";

export const metadata: Metadata = { title: "作品" };

export default function WorksPage() {
  return (
    <>
      <PageHeader index="02" en="WORKS" kicker="FILMOGRAPHY" title="作品库" meta={`${String(works.length).padStart(2, "0")} TITLES`} />
      <section aria-label="作品列表" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <WorksArchive works={works} />
      </section>
    </>
  );
}
