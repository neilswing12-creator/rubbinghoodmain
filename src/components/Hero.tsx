"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { hero } from "@/content/site";
import { EASE } from "@/lib/motion";
import { useAccess } from "@/components/AccessProvider";
import { AtmosphereCanvas } from "@/components/AtmosphereCanvas";
import { HeroVisual } from "@/components/HeroVisual";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealLines } from "@/components/ui/RevealLines";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useAccess();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Hero copy recedes as the product visual takes over.
  const copyY = useTransform(scrollYProgress, [0, 0.4], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const copyScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.94]);
  const blur = useTransform(scrollYProgress, [0, 0.3], [0, 14]);
  const copyFilter = useMotionTemplate`blur(${blur}px)`;

  // Background lighting dims and drifts upward as you leave the hero.
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.55, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative">
      {/* Atmosphere: sticky so the lighting stays put while content scrolls over it */}
      <div className="absolute inset-0">
        <div className="sticky top-0 h-[100svh] w-full">
          {/* outer: page-load fade-in · inner: scroll-linked dimming (kept separate so they don't fight) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
            className="absolute inset-0"
          >
            <motion.div style={{ opacity: bgOpacity, y: bgY }} className="absolute inset-0">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_30%,rgba(124,231,211,0.07),transparent_70%),radial-gradient(ellipse_60%_50%_at_75%_65%,rgba(96,140,190,0.07),transparent_70%)]"
              />
              <div className="absolute inset-0 mask-fade-y">
                <AtmosphereCanvas variant="hero" />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60 mask-fade-radial" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Copy */}
      <motion.div
        style={{ y: copyY, opacity: copyOpacity, scale: copyScale, filter: copyFilter }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1400px] origin-top flex-col justify-center px-6 pb-24 pt-32 md:px-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:mb-10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-signal/70" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-signal" />
          </span>
          {hero.eyebrow}
        </motion.p>

        <RevealLines
          as="h1"
          immediate
          delay={0.65}
          lines={[
            hero.headline[0],
            <span key="b" className="text-fog/40">
              {hero.headline[1]}
            </span>,
          ]}
          className="text-[clamp(2.9rem,10.4vw,11.5rem)] font-medium leading-[0.88] tracking-[-0.05em] text-fog"
        />

        <div className="mt-10 grid items-end gap-10 md:mt-14 md:grid-cols-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1.2 }}
            className="max-w-[34rem] text-[17px] leading-[1.7] text-mute md:col-span-6 md:text-[19px]"
          >
            {hero.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1.4 }}
            className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end"
          >
            <MagneticButton
  onClick={() => {
    window.open("https://app.robonhood.fun", "_blank", "noopener,noreferrer");
  }}
>
  {hero.primary}
</MagneticButton>

<MagneticButton variant="ghost" href="/#product">
  {hero.secondary}
  <ArrowUpRight
    className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    aria-hidden="true"
  />
</MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="mt-16 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-mute md:mt-24"
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {hero.meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <span className="hidden items-center gap-3 md:flex" aria-hidden="true">
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-0 animate-scrollcue bg-signal" />
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Product visual overlaps the bottom of the hero */}
      <div className="relative z-10 -mt-[12svh] pb-[10svh] md:-mt-[18svh]">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 1.0 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
