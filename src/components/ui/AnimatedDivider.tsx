"use client";

import { motion } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";

/** Hairline that draws itself in, with a slow travelling highlight. */
export function AnimatedDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden bg-white/[0.07]" aria-hidden="true">
      <motion.div
        className="absolute inset-0 origin-left bg-white/25"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE_IN_OUT }}
      />
      <div className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
    </div>
  );
}
