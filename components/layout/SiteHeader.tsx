"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { RollText } from "@/components/motion/RollText";
import { cn } from "@/lib/cn";
import { navItems, type NavKey } from "@/lib/data";
import { easeEditorial } from "@/lib/motion";

function activeKeyFor(pathname: string): NavKey | undefined {
  return navItems.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)))?.key;
}

export function SiteHeader() {
  const pathname = usePathname();
  const activeKey = activeKeyFor(pathname);
  const [hovered, setHovered] = useState<NavKey | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const lensKey = hovered ?? activeKey;

  return (
    <header className="fixed left-[var(--sal)] right-[var(--sar)] top-0 z-50 pt-[var(--sat)]">
      <div
        className={cn(
          "absolute inset-0 transition-[background-color,backdrop-filter] duration-700 ease-editorial",
          scrolled || open ? "bg-ink/70 backdrop-blur-xl" : "bg-transparent"
        )}
      />
      <div className="relative mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-baseline gap-3" aria-label="刘浩存的档案 首页">
          <span className="font-serifsc text-[15px] tracking-[0.16em] text-ice transition-colors duration-500 group-hover:text-haohan">
            刘浩存的档案
          </span>
          <span className="micro hidden sm:inline">ARCHIVE</span>
        </Link>

        <nav aria-label="主导航" className="hidden lg:block" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center">
            {navItems.map((item) => {
              const active = item.key === activeKey;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(item.key)}
                    onFocus={() => setHovered(item.key)}
                    onBlur={() => setHovered(null)}
                    className={cn(
                      "group relative block px-4 py-2 text-[13px] tracking-[0.14em] transition-colors duration-500",
                      active ? "text-ice" : "text-ice-dim hover:text-ice"
                    )}
                  >
                    {lensKey === item.key && (
                      <motion.span
                        layoutId="nav-lens"
                        className="glass-thin absolute inset-x-1 inset-y-0"
                        transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.7 }}
                      />
                    )}
                    <RollText primary={item.label} secondary={item.en} className="relative min-w-[2.6em] text-center" />
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-px h-px bg-haohan shadow-[0_0_12px_rgba(190,232,244,0.7)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="micro relative flex h-10 items-center gap-3 text-ice lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "CLOSE" : "菜单"}</span>
          <span className="relative block h-[9px] w-6">
            <motion.span
              className="absolute left-0 top-0 block h-px w-full bg-ice"
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.5, ease: easeEditorial }}
            />
            <motion.span
              className="absolute bottom-0 left-0 block h-px w-full bg-ice"
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.5, ease: easeEditorial }}
            />
          </span>
        </button>
      </div>
      <div className="flow-line relative h-px w-full animate-flow opacity-80" />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="移动端导航"
            className="relative h-[calc(100dvh-var(--header-offset)-1px)] overflow-y-auto bg-ink/95 px-5 pb-[max(2.5rem,var(--sab))] pt-6 backdrop-blur-xl sm:px-8 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: easeEditorial }}
          >
            <ul>
              {navItems.map((item, index) => {
                const active = item.key === activeKey;
                return (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeEditorial, delay: 0.12 + index * 0.05 }}
                    className="border-b border-[var(--rule)]"
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] text-ice-mute">{String(index).padStart(2, "0")}</span>
                        <span className={cn("font-serifsc text-[30px] leading-none", active ? "text-haohan" : "text-ice")}>
                          {item.label}
                        </span>
                      </span>
                      <span className="micro">{item.en}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
