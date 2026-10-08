"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";
import { useMotionProfile } from "@/lib/hooks";

/**
 * Wraps a visual in a gently perspective-tilting frame with a pointer-lit border.
 * Tilt is disabled on touch devices and for reduced motion.
 */
export function TiltFrame({
  children,
  className,
  max = 3.5,
}: {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  max?: number;
}) {
  const { reduced, coarse } = useMotionProfile();
  const enabled = !reduced && !coarse;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 140, damping: 20, mass: 0.5 });
  const springY = useSpring(ry, { stiffness: 140, damping: 20, mass: 0.5 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (!enabled) return;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 1400 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        className={cn("glow-border relative transform-gpu")}
      >
        {children}
      </motion.div>
    </div>
  );
}
