"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

/**
 * Fixed full-page lighting that drifts and shifts hue as you scroll,
 * so the whole page reads as one continuous environment rather than
 * a stack of independent sections.
 */
export function AmbientLight() {
  const { scrollYProgress } = useScroll();

  const stops = [0, 0.25, 0.5, 0.75, 1];
  const x1 = useTransform(scrollYProgress, stops, [28, 70, 30, 65, 45]);
  const y1 = useTransform(scrollYProgress, stops, [-5, 18, 45, 72, 100]);
  const a1 = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], [0.15, 0.09, 0.11, 0.18]);

  const x2 = useTransform(scrollYProgress, stops, [80, 25, 75, 30, 60]);
  const y2 = useTransform(scrollYProgress, stops, [60, 30, 70, 40, 85]);
  const a2 = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [0.07, 0.06, 0.05, 0.05]);

  // A touch of warmth appears around the metrics, then fades.
  const a3 = useTransform(scrollYProgress, [0.55, 0.75, 0.9], [0, 0.05, 0]);

  const background = useMotionTemplate`
    radial-gradient(60vw 50vh at ${x1}% ${y1}%, rgba(124,231,211,${a1}), transparent 70%),
    radial-gradient(55vw 45vh at ${x2}% ${y2}%, rgba(96,140,190,${a2}), transparent 70%),
    radial-gradient(40vw 30vh at 50% 60%, rgba(255,184,107,${a3}), transparent 70%)
  `;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}
