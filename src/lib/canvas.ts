"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface Frame {
  ctx: CanvasRenderingContext2D;
  /** CSS pixel width / height of the canvas */
  w: number;
  h: number;
  /** seconds since the loop started */
  t: number;
  /** seconds since last frame (clamped) */
  dt: number;
  dpr: number;
}

interface Options {
  /** Cap device pixel ratio to keep fill-rate low. */
  dprCap?: number;
  /** Target frame rate. */
  fps?: number;
  /** Paint a single static frame (used for prefers-reduced-motion). */
  once?: boolean;
}

/**
 * requestAnimationFrame loop for a 2D canvas that:
 *  - handles DPR + resize
 *  - pauses when scrolled offscreen or the tab is hidden
 *  - can throttle fps (mobile) or paint just once (reduced motion)
 *
 * `draw` can change every render without restarting the loop.
 */
export function useCanvasLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: (frame: Frame) => void,
  { dprCap = 1.5, fps = 60, once = false }: Options = {},
) {
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    let last = start;
    const minDelta = 1000 / fps;

    const paint = (t: number, dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current({ ctx, w, h, t, dt, dpr });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      if (once) paint(0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (once) {
      return () => ro.disconnect();
    }

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(tick);
      const delta = now - last;
      if (delta < minDelta) return;
      last = now;
      paint((now - start) / 1000, Math.min(delta, 64) / 1000);
    };

    const resume = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) resume();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", resume);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
    };
  }, [ref, dprCap, fps, once]);
}
