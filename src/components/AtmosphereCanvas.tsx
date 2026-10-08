"use client";

import { useMemo, useRef } from "react";
import { useCanvasLoop } from "@/lib/canvas";
import { useMotionProfile, usePointerParallax } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type Variant = "hero" | "cta";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  ph: number;
}

/** Small deterministic PRNG so particle layouts are stable between renders. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const HERO_BLOBS = [
  { x: 0.22, y: 0.3, r: 0.5, c: "124,231,211", a: 0.1, s: 0.18, p: 0, d: 0.05 },
  { x: 0.78, y: 0.62, r: 0.55, c: "96,140,190", a: 0.09, s: 0.14, p: 2, d: 0.08 },
  { x: 0.5, y: 0.95, r: 0.6, c: "255,184,107", a: 0.035, s: 0.1, p: 4, d: 0.03 },
];

const CTA_BLOBS = [
  { x: 0.5, y: 1.02, r: 0.85, c: "124,231,211", a: 0.17, s: 0.12, p: 1, d: 0.04 },
  { x: 0.18, y: 0.55, r: 0.5, c: "96,140,190", a: 0.07, s: 0.1, p: 3, d: 0.06 },
  { x: 0.86, y: 0.4, r: 0.4, c: "255,184,107", a: 0.04, s: 0.08, p: 5, d: 0.05 },
];

/**
 * Living background: drifting light field, depth-layered particles,
 * faint signal lines and pointer parallax — all on one 2D canvas.
 *
 * Mobile / reduced-motion get fewer particles, no pointer response,
 * a lower frame-rate or a single static frame.
 */
export function AtmosphereCanvas({
  variant = "hero",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reduced, lite } = useMotionProfile();
  const pointer = usePointerParallax(!lite);

  const particles = useMemo<Particle[]>(() => {
    const rand = rng(variant === "hero" ? 7 : 21);
    const count = variant === "hero" ? (lite ? 22 : 78) : lite ? 14 : 46;
    return Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      z: 0.25 + rand() * 0.75,
      vx: (rand() - 0.5) * 0.02,
      vy: (rand() - 0.5) * 0.015,
      ph: rand() * Math.PI * 2,
    }));
  }, [variant, lite]);

  useCanvasLoop(
    ref,
    ({ ctx, w, h, t, dt }) => {
      ctx.clearRect(0, 0, w, h);
      const px = pointer.x.get();
      const py = pointer.y.get();
      const isHero = variant === "hero";

      // 1. Light field
      ctx.globalCompositeOperation = "lighter";
      for (const b of isHero ? HERO_BLOBS : CTA_BLOBS) {
        const cx = (b.x + Math.sin(t * b.s + b.p) * 0.06 - px * b.d) * w;
        const cy = (b.y + Math.cos(t * b.s * 0.8 + b.p) * 0.05 - py * b.d) * h;
        const r = b.r * Math.max(w, h * 1.2);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.c},${b.a})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";

      // 2. Depth lines with travelling signals
      if (isHero && !lite) {
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          const y = h * (0.28 + i * 0.2) + py * (10 + i * 10);
          ctx.strokeStyle = "rgba(255,255,255,0.035)";
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();

          const pos = ((t * (0.06 + i * 0.03) + i * 0.37) % 1.4) - 0.2;
          const x = pos * w;
          const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0);
          g.addColorStop(0, "rgba(124,231,211,0)");
          g.addColorStop(0.5, "rgba(124,231,211,0.35)");
          g.addColorStop(1, "rgba(124,231,211,0)");
          ctx.strokeStyle = g;
          ctx.beginPath();
          ctx.moveTo(x - 120, y);
          ctx.lineTo(x + 120, y);
          ctx.stroke();
        }
      }

      // 3. Particles (+ faint links on desktop hero)
      const pts: { x: number; y: number; z: number }[] = [];
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const x = (p.x - px * p.z * 0.06) * w;
        const y = (p.y - py * p.z * 0.06) * h;
        const twinkle = 0.6 + 0.4 * Math.sin(t * 0.8 + p.ph);
        const alpha = (0.15 + 0.5 * p.z) * twinkle;
        ctx.fillStyle =
          p.z > 0.85 ? `rgba(124,231,211,${alpha})` : `rgba(236,235,230,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.6 + p.z * 1.1, 0, Math.PI * 2);
        ctx.fill();
        pts.push({ x, y, z: p.z });
      }

      if (isHero && !lite) {
        ctx.lineWidth = 1;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d = Math.hypot(dx, dy);
            if (d < 110) {
              ctx.strokeStyle = `rgba(236,235,230,${(1 - d / 110) * 0.08})`;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
      }
    },
    { dprCap: lite ? 1 : 1.5, fps: lite ? 30 : 60, once: reduced },
  );

  return <canvas ref={ref} aria-hidden="true" className={cn("h-full w-full", className)} />;
}
