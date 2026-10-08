"use client";

import { motion } from "framer-motion";
import { testimonial } from "@/content/site";
import { EASE, VIEWPORT, fadeUp, stagger } from "@/lib/motion";

/** Typographic wordmark — original, abstract company marks (no real brands). */
function Wordmark({ name, i }: { name: string; i: number }) {
  const glyphs = [
    <circle key="a" cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />,
    <path key="b" d="M2 14 8 2l6 12Z" fill="none" stroke="currentColor" strokeWidth="1.4" />,
    <rect key="c" x="2.5" y="2.5" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" />,
    <path key="d" d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.4" />,
    <path key="e" d="M2 12c2-8 4-8 6 0s4 8 6 0" fill="none" stroke="currentColor" strokeWidth="1.4" />,
    <path key="f" d="M2 14 14 2M2 8l6-6M8 14l6-6" stroke="currentColor" strokeWidth="1.4" />,
  ];
  return (
    <span className="inline-flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.02em]">
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
        {glyphs[i % glyphs.length]}
      </svg>
      {name}
    </span>
  );
}

export function Testimonial() {
  const words = testimonial.quote.split(" ");

  return (
    <section
      id="proof"
      aria-label="Customer story"
      className="relative border-t border-white/10 py-28 md:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:mb-14"
        >
          <span aria-hidden="true" className="h-px w-8 bg-signal/70" />
          {testimonial.label}
        </motion.p>

        <figure className="m-0">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 -top-16 select-none text-[12rem] font-medium leading-none text-white/[0.04] md:-left-8 md:-top-28 md:text-[22rem]"
            >
              “
            </span>
            <motion.blockquote
              variants={stagger(0.035)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="relative m-0 max-w-[1100px] text-[clamp(1.9rem,5vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.035em] text-fog"
            >
              <span className="sr-only">{testimonial.quote}</span>
              <span aria-hidden="true">
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.9, ease: EASE },
                      },
                    }}
                    className="inline-block pr-[0.24em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.blockquote>
          </div>

          <motion.figcaption
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-12 flex items-center gap-5 md:mt-16"
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center border border-white/15 font-mono text-[13px] tracking-widest text-fog/80"
            >
              {testimonial.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </span>
            <span>
              <span className="block text-[16px] font-medium tracking-[-0.01em] text-fog">
                {testimonial.name}
              </span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                {testimonial.role} · {testimonial.company}
              </span>
            </span>
          </motion.figcaption>
        </figure>

        <motion.ul
          variants={stagger(0.08, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          aria-label="Customers"
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 text-fog/40 sm:grid-cols-3 md:mt-28 lg:grid-cols-6"
        >
          {testimonial.logos.map((name, i) => (
            <motion.li
              key={name}
              variants={fadeUp}
              className="transition-colors duration-500 hover:text-fog/90"
            >
              <Wordmark name={name} i={i} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
