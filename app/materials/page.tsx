import type { Metadata } from "next";

import { MaterialsArchive } from "@/components/materials/MaterialsArchive";
import { PageHeader } from "@/components/page/PageHeader";
import { eras, materials } from "@/lib/data";

export const metadata: Metadata = { title: "物料" };

export default function MaterialsPage() {
  return (
    <>
      <PageHeader index="04" en="MATERIALS" kicker="MATERIALS" title="官宣 · 商务 · 物料 · 杂志" compact meta={`${materials.length} ENTRIES`} />
      <section aria-label="物料列表" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <MaterialsArchive materials={materials} eras={eras} />
      </section>
    </>
  );
}
