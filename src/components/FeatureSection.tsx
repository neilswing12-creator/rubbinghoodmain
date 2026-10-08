"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import type { Feature } from "@/content/site";
import { cn } from "@/lib/cn";
import { VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { ProductVisualization } from "@/components/ProductVisualization";
import { TiltFrame } from "@/components/ui/TiltFrame";
import { RevealLines } from "@/components/ui/RevealLines";

/**
 * A full-width "scene": oversized number, category, headline, copy and an
 * interactive visual. `align` flips the composition for alternating rhythm.
 */
export function FeatureSection({
  feature,
  align = "left",
}: {
  feature: Feature;
  align?: "left" | "right";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Different layers, different speeds.
  const numberY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const visualY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const visualScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.92, 1, 1]);
  const visualOpacity = useTransform(scrollYProgress, [0.02, 0.25], [0, 1]);

  const flip = align === "right";

  return (
    <section
      ref={ref}
      id={feature.id}
      aria-label={feature.title}
      className="relative border-t border-white/10 py-24 md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 md:px-10 lg:grid-cols-12 lg:gap-16">
        {/* copy */}
        <div className={cn("relative lg:col-span-5", flip && "lg:order-2")}>
          <motion.span
            aria-hidden="true"
            style={reduced ? undefined : { y: numberY }}
            className="text-outline pointer-events-none block select-none font-medium leading-none tracking-[-0.06em] text-[clamp(5.5rem,14vw,13rem)]"
          >
            {feature.number}
          </motion.span>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mb-5 mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute"
          >
            <span aria-hidden="true" className="h-px w-8 bg-signal/70" />
            Feature {feature.number} · {feature.category}
          </motion.p>

          <RevealLines
            as="h3"
            lines={[feature.title]}
            className="text-[clamp(2.4rem,5.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fog [text-wrap:balance]"
          />

          <motion.p
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-8 max-w-md text-[17px] leading-[1.75] text-mute"
          >
            {feature.description}
          </motion.p>

          <motion.ul
            variants={stagger(0.08, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-10 space-y-3"
          >
            {feature.specs.map((spec) => (
              <motion.li
                key={spec}
                variants={fadeUp}
                className="flex items-center gap-3 border-t border-white/[0.08] pt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-fog/80"
              >
                <Check className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                {spec}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* visual */}
        <motion.div
          style={reduced ? undefined : { y: visualY, scale: visualScale, opacity: visualOpacity }}
          className={cn("lg:col-span-7", flip && "lg:order-1")}
        >
          <TiltFrame>
            <ProductVisualization kind={feature.visual} />
          </TiltFrame>
        </motion.div>
      </div>
    </section>
  );
}
