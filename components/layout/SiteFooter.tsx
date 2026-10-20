import { site } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-[var(--rule)]">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-5 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-8 lg:grid-cols-12 lg:px-12">
        <p className="micro lg:col-span-3">HAOHAN BLUE — FAN ARCHIVE</p>
        <p className="text-[12px] leading-6 tracking-[0.04em] text-ice-mute lg:col-span-6">{site.disclaimer}</p>
        <p className="micro lg:col-span-3 lg:text-right">{site.tagline}</p>
      </div>
    </footer>
  );
}
