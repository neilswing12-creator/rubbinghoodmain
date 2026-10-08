"use client";

import { createElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

interface Props {
  lines: readonly ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  /** seconds */
  delay?: number;
  /** Animate on mount instead of when scrolled into view (use above the fold). */
  immediate?: boolean;
}

/**
 * Line-by-line headline reveal: each line slides up out of a clipped mask.
 * The padding / negative margin pair stops tight leading from cropping descenders.
 */
export function RevealLines({
  lines,
  as = "div",
  className,
  delay = 0,
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();

  const children = lines.map((line, i) => (
    <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span
        className="block will-change-transform"
        initial={reduced ? false : { y: "112%" }}
        {...(immediate
          ? { animate: { y: 0 } }
          : { whileInView: { y: 0 }, viewport: { once: true, margin: "-10% 0px" } })}
        transition={{ duration: 1.15, ease: EASE, delay: delay + i * 0.11 }}
      >
        {line}
      </motion.span>
    </span>
  ));

  return createElement(as, { className }, children);
}
