"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { statement } from "@/content/site";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.22em]">
      {children}
    </motion.span>
  );
}

/**
 * Pinned editorial statement. The section is tall, its content is sticky,
 * and each word brightens in sequence as you scroll through it.
 */
export function ValueStatement() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const lines = statement.lines.map((l) => l.split(" "));
  const total = lines.reduce((n, l) => n + l.length, 0);

  const bodyOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.68, 0.88], [24, 0]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  let index = 0;

  return (
    <section
      ref={ref}
      id="why"
      aria-labelledby="why-title"
      className="relative h-[250svh] md:h-[300svh]"
    >
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:mb-12">
            <span aria-hidden="true" className="h-px w-8 bg-signal/70" />
            {statement.label}
          </p>

          <h2
            id="why-title"
            className="text-[clamp(2.2rem,6.6vw,7rem)] font-medium leading-[1.02] tracking-[-0.04em] text-fog"
          >
            {lines.map((words, li) => (
              <Fragment key={li}>
                {words.map((word) => {
                  const i = index++;
                  const start = 0.04 + (i / total) * 0.6;
                  return reduced ? (
                    <span key={`${li}-${i}`} className="inline-block pr-[0.22em]">
                      {word}
                    </span>
                  ) : (
                    <Word key={`${li}-${i}`} progress={scrollYProgress} range={[start, start + 0.1]}>
                      {word}
                    </Word>
                  );
                })}
                {li < lines.length - 1 && <br className="hidden md:block" />}
              </Fragment>
            ))}
          </h2>

          <motion.p
            style={reduced ? undefined : { opacity: bodyOpacity, y: bodyY }}
            className="mt-10 max-w-xl text-[17px] leading-[1.75] text-mute md:mt-14"
          >
            {statement.body}
          </motion.p>
        </div>

        {/* progress rail */}
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-6 right-6 h-px bg-white/10 md:left-10 md:right-10"
        >
          <motion.div className="h-px origin-left bg-signal/70" style={{ scaleX: barScale }} />
        </div>
      </div>
    </section>
  );
}
