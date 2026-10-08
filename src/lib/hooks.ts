"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** SSR-safe media query hook. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * One place to decide how much motion to run.
 * - reduced: user prefers reduced motion → static visuals
 * - small:   phone-width viewport
 * - lite:    reduced OR small → fewer particles, no pointer effects, lower fps
 * - coarse:  touch-first device → no hover/magnetic effects
 */
export function useMotionProfile() {
  const reduced = !!useReducedMotion();
  const small = useMediaQuery("(max-width: 767px)");
  const coarse = useMediaQuery("(pointer: coarse)");
  return { reduced, small, coarse, lite: reduced || small };
}

/**
 * Smoothed window pointer position, normalised to -0.5 … 0.5.
 * Returns spring MotionValues (safe to read with .get() inside rAF loops).
 */
export function usePointerParallax(enabled = true) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

/** Increments on an interval — drives the "live" feel of the product UI. */
export function useTicker(intervalMs: number, enabled = true): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled]);

  return tick;
}
