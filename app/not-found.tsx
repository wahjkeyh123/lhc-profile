import Link from "next/link";

import { navItems } from "@/lib/data";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-[1600px] flex-col justify-center px-5 pt-[var(--header-offset)] sm:px-8 lg:px-12">
      <p className="micro flex items-center gap-4 text-haohan">
        <span aria-hidden className="h-px w-10 bg-haohan/60" />
        N°404 — NOT IN ARCHIVE
      </p>
      <h1 className="text-metal mt-6 font-display text-[clamp(96px,18vw,280px)] italic leading-[0.85] tracking-[-0.03em]">404</h1>
      <p className="mt-8 font-serifsc text-[clamp(20px,2.4vw,30px)] tracking-[0.12em] text-ice">这一页不在纪录里。</p>
      <nav aria-label="返回栏目" className="mt-12 border-t border-[var(--rule)] pt-6">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className="group inline-flex items-baseline gap-2 py-1">
                <span className="text-[14px] tracking-[0.16em] text-ice transition-colors duration-500 group-hover:text-haohan">{item.label}</span>
                <span className="font-mono text-[10px] tracking-label text-ice-mute">{item.en}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
