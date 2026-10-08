"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { brand, finalCta } from "@/content/site";
import { VIEWPORT, fadeUp } from "@/lib/motion";
import { useAccess } from "@/components/AccessProvider";
import { AtmosphereCanvas } from "@/components/AtmosphereCanvas";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealLines } from "@/components/ui/RevealLines";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useAccess();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["25%", "0%"]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section
      ref={ref}
      id="get-started"
      aria-label="Get started"
      className="relative flex min-h-[100svh] items-end overflow-hidden border-t border-white/10"
    >
      {/* Slowly breathing horizon + particle field */}
      <motion.div
        aria-hidden="true"
        style={{ y: glowY, scale: glowScale, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%]"
      >
        <div className="absolute inset-x-[-10%] bottom-[-30%] h-full animate-breathe bg-[radial-gradient(ellipse_50%_55%_at_50%_100%,rgba(124,231,211,0.38),rgba(124,231,211,0.08)_45%,transparent_70%)] blur-2xl" />
      </motion.div>
      <div className="absolute inset-0 mask-fade-y">
        <AtmosphereCanvas variant="cta" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-40 mask-fade-radial" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 pt-40 md:px-10 md:pb-28">
        <RevealLines
          as="h2"
          lines={[
            finalCta.headline[0],
            <span key="b" className="text-fog/40">
              {finalCta.headline[1]}
            </span>,
          ]}
          className="text-[clamp(3.2rem,12vw,13rem)] font-medium leading-[0.86] tracking-[-0.055em] text-fog"
        />

        <div className="mt-14 grid items-end gap-10 md:mt-20 md:grid-cols-12">
          <motion.p
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="max-w-sm text-[19px] leading-[1.6] text-mute md:col-span-6"
          >
            {finalCta.body}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.35}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end"
          >
                        <MagneticButton
  onClick={() => {
    window.open("https://app.robonhood.fun", "_blank", "noopener,noreferrer");
  }}
>
  Launch App
</MagneticButton>
            <MagneticButton
              variant="ghost"
              href={`mailto:${brand.salesEmail}?subject=Talk%20to%20Sales`}
            >
              {finalCta.secondary}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
