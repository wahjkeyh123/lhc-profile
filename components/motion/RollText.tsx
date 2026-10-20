import { cn } from "@/lib/cn";

type RollTextProps = {
  primary: string;
  secondary: string;
  className?: string;
};

/** 悬停时中文上移、英文补位的文字重排；父元素需带 `group`。 */
export function RollText({ primary, secondary, className }: RollTextProps) {
  return (
    <span className={cn("relative block h-[1.5em] overflow-hidden leading-[1.5em]", className)}>
      <span className="block transition-transform duration-500 ease-editorial group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {primary}
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-full block text-center font-mono text-[10px] tracking-label text-haohan transition-transform duration-500 ease-editorial group-hover:-translate-y-full group-focus-visible:-translate-y-full"
      >
        {secondary}
      </span>
    </span>
  );
}
