"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";
import { easeEditorial } from "@/lib/motion";

export type FilterOption<T extends string> = { value: T; label: string };

type SegmentedProps<T extends string> = {
  /** 同页多个分段器时用于区分滑块的 layoutId。 */
  id: string;
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** 分段筛选：极细描边，选中项以共享滑块平移过去。 */
export function Segmented<T extends string>({ id, label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap border border-[var(--rule)]">
      {options.map((option) => {
        const on = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative min-h-[44px] flex-1 whitespace-nowrap px-2.5 text-[12px] tracking-[0.04em] transition-colors duration-500 sm:flex-none sm:px-5 sm:text-[13px] sm:tracking-[0.14em]",
              on ? "text-ink" : "text-ice-dim hover:text-ice"
            )}
          >
            {on && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 bg-ice"
                transition={{ duration: 0.6, ease: easeEditorial }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const fieldClass =
  "min-h-[44px] w-full border border-[var(--rule)] bg-ink/40 px-4 text-base tracking-[0.08em] text-ice outline-none backdrop-blur-sm transition-colors duration-500 placeholder:text-ice-mute hover:border-[var(--rule-strong)] focus:border-haohan/70 md:text-[13px]";

type SelectFieldProps<T extends string> = {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SelectField<T extends string>({ label, options, value, onChange, className }: SelectFieldProps<T>) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(fieldClass, "cursor-pointer appearance-none pr-10")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-800 text-ice">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 10 6"
        className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2 stroke-ice-mute"
        fill="none"
        strokeWidth="1.2"
      >
        <path d="M1 1l4 4 4-4" />
      </svg>
    </label>
  );
}

type SearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchField({ label, placeholder, value, onChange, className }: SearchFieldProps) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">{label}</span>
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldClass, "pl-10")}
      />
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 stroke-ice-mute"
        fill="none"
        strokeWidth="1.2"
      >
        <circle cx="7" cy="7" r="4.6" />
        <path d="M10.4 10.4 14 14" />
      </svg>
    </label>
  );
}

/** 筛选结果为空时的提示，沿用原站文案。 */
export function EmptyState() {
  return <p className="border-y border-[var(--rule)] py-16 text-center text-[14px] tracking-[0.1em] text-ice-dim">这个筛选下暂无条目。</p>;
}
