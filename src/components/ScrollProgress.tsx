"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Extremely subtle page progress line fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-signal/60"
      style={{ scaleX }}
    />
  );
}
