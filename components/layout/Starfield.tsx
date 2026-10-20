"use client";

import { useEffect, useRef } from "react";

type StarKind = "sky" | "gold" | "silver";

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  twinkle: number;
  vx: number;
  vy: number;
  a0: number;
  a1: number;
  kind: StarKind;
  glint: boolean;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
};

const layers = [
  { count: [80, 150], r: [0.35, 0.78], speed: 0.006, alpha: [0.14, 0.34], sky: 0.25, gold: 0.03 },
  { count: [34, 64], r: [0.55, 1.08], speed: 0.013, alpha: [0.24, 0.58], sky: 0.38, gold: 0.08 },
  { count: [12, 26], r: [0.8, 1.45], speed: 0.022, alpha: [0.36, 0.78], sky: 0.44, gold: 0.14 },
] as const;

function color(kind: StarKind, alpha: number) {
  if (kind === "sky") return `rgba(190, 232, 244, ${alpha})`;
  if (kind === "gold") return `rgba(243, 230, 192, ${alpha})`;
  return `rgba(232, 238, 247, ${alpha})`;
}

/** 浩瀚星空画布：三层视差星点、缓慢漂移的星云与偶发流星，沿用原站 sky.js。 */
export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let lastMeteor = 0;
    let running = true;
    let frame = 0;
    let lastDraw = 0;
    /** 小屏 / 触屏降到约 30fps，星点步长加倍以保持同样的漂移速度。 */
    let step = 1;

    function resize() {
      const mobile = window.innerWidth <= 640;
      step = mobile || window.matchMedia("(pointer: coarse)").matches ? 2 : 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = [];
      layers.forEach((layer) => {
        const count = mobile ? layer.count[0] : layer.count[1];
        for (let i = 0; i < count; i += 1) {
          const tone = Math.random();
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: layer.r[0] + Math.random() * (layer.r[1] - layer.r[0]),
            phase: Math.random() * Math.PI * 2,
            twinkle: 0.00035 + Math.random() * 0.00085,
            vx: layer.speed * (0.65 + Math.random() * 0.7),
            vy: layer.speed * 0.28 * (0.5 + Math.random()),
            a0: layer.alpha[0],
            a1: layer.alpha[1],
            kind: tone < layer.gold ? "gold" : tone < layer.gold + layer.sky ? "sky" : "silver",
            glint: Math.random() < layer.speed * 8,
          });
        }
      });
    }

    function drawNebula(now: number) {
      const time = reduced ? 0 : now;
      const driftX = Math.sin(time * 0.00007) * width * 0.018;
      const driftY = Math.cos(time * 0.00005) * height * 0.012;
      const reach = Math.max(width, height);
      const blobs: [number, number, number, string, number, number, number][] = [
        [0.2, 0.34, 0.5, "61, 124, 201", 0.34, driftX, driftY],
        [0.5, 0.16, 0.4, "190, 232, 244", 0.18, -driftX * 0.5, driftY * 0.3],
        [0.76, 0.48, 0.34, "122, 167, 220", 0.16, driftX * 0.3, -driftY],
      ];

      blobs.forEach(([nx, ny, nr, rgb, alpha, ox, oy]) => {
        const x = width * nx + ox;
        const y = height * ny + oy;
        const radius = reach * nr;
        const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${rgb}, ${alpha})`);
        gradient.addColorStop(0.48, `rgba(${rgb}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, width, height);
      });
    }

    function spawnMeteor() {
      const fromRight = Math.random() > 0.35;
      meteors.push({
        x: fromRight ? width * (0.4 + Math.random() * 0.6) : Math.random() * width * 0.35,
        y: Math.random() * height * 0.36,
        vx: fromRight ? -(2.5 + Math.random() * 1.5) : 2.2 + Math.random() * 1.3,
        vy: 1.1 + Math.random() * 0.85,
        life: 1,
        decay: 0.006 + Math.random() * 0.004,
      });
    }

    function drawMeteors(now: number) {
      if (reduced) return;
      const gap = width <= 640 ? 14000 : 9000;
      if (now - lastMeteor > gap && meteors.length === 0) {
        spawnMeteor();
        lastMeteor = now;
      }

      meteors = meteors.filter((meteor) => meteor.life > 0);
      meteors.forEach((meteor) => {
        meteor.x += meteor.vx * step;
        meteor.y += meteor.vy * step;
        meteor.life -= meteor.decay * step;
        const distance = Math.hypot(meteor.vx, meteor.vy) || 1;
        const nx = meteor.vx / distance;
        const ny = meteor.vy / distance;
        const gradient = ctx!.createLinearGradient(meteor.x, meteor.y, meteor.x - nx * 72, meteor.y - ny * 72);
        gradient.addColorStop(0, `rgba(190, 232, 244, ${0.82 * meteor.life})`);
        gradient.addColorStop(0.42, `rgba(243, 230, 192, ${0.32 * meteor.life})`);
        gradient.addColorStop(1, "rgba(190, 232, 244, 0)");
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.1;
        ctx!.beginPath();
        ctx!.moveTo(meteor.x, meteor.y);
        ctx!.lineTo(meteor.x - nx * 72, meteor.y - ny * 72);
        ctx!.stroke();
      });
    }

    function draw(now = 0) {
      if (!reduced && step > 1 && now - lastDraw < 30) {
        if (running) frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      ctx!.clearRect(0, 0, width, height);
      drawNebula(now);
      stars.forEach((star) => {
        if (!reduced) {
          star.x = (star.x + star.vx * step + width) % width;
          star.y = (star.y + star.vy * step + height) % height;
        }
        const alpha = reduced
          ? (star.a0 + star.a1) / 2
          : star.a0 + (star.a1 - star.a0) * (0.5 + 0.5 * Math.sin(now * star.twinkle + star.phase));
        ctx!.fillStyle = color(star.kind, alpha);
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fill();

        if (star.glint) {
          const arm = star.r * 3;
          ctx!.strokeStyle = color(star.kind, alpha * 0.36);
          ctx!.lineWidth = 0.5;
          ctx!.beginPath();
          ctx!.moveTo(star.x - arm, star.y);
          ctx!.lineTo(star.x + arm, star.y);
          ctx!.moveTo(star.x, star.y - arm);
          ctx!.lineTo(star.x, star.y + arm);
          ctx!.stroke();
        }
      });
      drawMeteors(now);
      if (!reduced && running) frame = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (reduced) return;
      running = !document.hidden;
      cancelAnimationFrame(frame);
      if (running) frame = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduced) frame = requestAnimationFrame(draw);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
