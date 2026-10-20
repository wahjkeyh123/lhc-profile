"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { resolveMedia } from "@/lib/data/media";
import { easeEditorial } from "@/lib/motion";

type ArchiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** 进入视口时轻微 zoom-in。 */
  zoom?: boolean;
  /** 父元素带 `group` 时，悬停轻微放大裁切。 */
  hoverZoom?: boolean;
  scanlines?: boolean;
  objectPosition?: string;
};

/** 统一的冷调档案图片：调色、胶片颗粒、暗角，按需扫描线。 */
export function ArchiveImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  zoom = true,
  hoverZoom = false,
  scanlines = false,
  objectPosition = "50% 30%",
}: ArchiveImageProps) {
  const media = resolveMedia(src);
  const hasBlur = typeof media !== "string";

  return (
    <div className={cn("relative overflow-hidden bg-ink-700", className)}>
      <motion.div
        className="absolute inset-0"
        initial={zoom ? { scale: 1.14 } : false}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 2.2, ease: easeEditorial }}
      >
        <div
          className={cn(
            "absolute inset-0",
            hoverZoom && "transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.05]"
          )}
        >
          <Image
            src={media}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={hasBlur ? "blur" : "empty"}
            className="grade-cold object-cover"
            style={{ objectPosition }}
          />
        </div>
      </motion.div>

      <div aria-hidden className="grade-tint pointer-events-none absolute inset-0" />
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />
      {scanlines && <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />}
      <motion.div
        aria-hidden
        className="grain-layer pointer-events-none absolute inset-0 mix-blend-overlay"
        initial={{ opacity: 0.5 }}
        whileInView={{ opacity: 0.14 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: easeEditorial }}
      />
    </div>
  );
}
