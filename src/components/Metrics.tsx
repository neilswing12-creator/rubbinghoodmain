"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { metrics, type Metric } from "@/content/site";
import { EASE } from "@/lib/motion";

function CountUp({ to, decimals, suffix }: { to: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 2.4,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      <span className="text-fog/35">{suffix}</span>
    </span>
  );
}

function MetricItem({ metric, index }: { metric: Metric; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 2) * 0.12 }}
      className="relative border-t border-white/10 py-10 md:py-14"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
        <span className="mr-3 text-signal">0{index + 1}</span>
        {metric.label}
      </p>
      <p className="mt-6 text-[clamp(4.5rem,13vw,12rem)] font-medium leading-[0.85] tracking-[-0.06em] text-fog">
        <span className="sr-only">
          {metric.kind === "count"
            ? `${metric.to.toFixed(metric.decimals)}${metric.suffix}`
            : metric.text}
        </span>
        <span aria-hidden="true">
          {metric.kind === "count" ? (
            <CountUp to={metric.to} decimals={metric.decimals} suffix={metric.suffix} />
          ) : (
            metric.text
          )}
        </span>
      </p>
    </motion.div>
  );
}

export function Metrics() {
  return (
    <section id="metrics" aria-label="Platform metrics" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-x-16 md:grid-cols-2">
          {metrics.map((m, i) => (
            <MetricItem key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
