"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { VIEWPORT, fadeUp } from "@/lib/motion";
import { RevealLines } from "@/components/ui/RevealLines";

interface Props {
  label: string;
  lines: readonly string[];
  description?: string;
  /** Heading level to render (keep the document outline sensible). */
  as?: "h2" | "h3";
  className?: string;
  titleClassName?: string;
}

/** Eyebrow label + large line-revealed headline + optional paragraph. */
export function SectionHeading({
  label,
  lines,
  description,
  as = "h2",
  className,
  titleClassName,
}: Props) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute"
      >
        <span aria-hidden="true" className="h-px w-8 bg-signal/70" />
        {label}
      </motion.p>

      <RevealLines
        as={as}
        lines={lines}
        className={cn(
          "text-[clamp(2.5rem,7vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-fog",
          titleClassName,
        )}
      />

      {description && (
        <motion.p
          variants={fadeUp}
          custom={0.25}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-8 max-w-xl text-[17px] leading-[1.7] text-mute"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
