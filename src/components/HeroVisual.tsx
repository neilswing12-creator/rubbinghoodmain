"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Activity, BarChart3, GitBranch, Layers, Radio, Settings } from "lucide-react";
import { activity, regions, type ActivityItem } from "@/content/site";
import { cn } from "@/lib/cn";
import { useMotionProfile, usePointerParallax, useTicker } from "@/lib/hooks";
import { LiveChart } from "@/components/LiveChart";
import { GlowPanel } from "@/components/ui/GlowPanel";

const levelColor: Record<ActivityItem["level"], string> = {
  ok: "bg-signal",
  warn: "bg-ember",
  info: "bg-white/40",
};

/** The large product interface that emerges from the dark beneath the hero copy. */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, lite } = useMotionProfile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scroll choreography: emerge, settle, then drift past the camera.
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.82, 1, 1.04, 1.1]);
  const tiltScroll = useTransform(scrollYProgress, [0, 0.35, 1], [22, 4, -6]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -140]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.8, 1], [0, 1, 1, 0.15]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.9], [0, 1, 0.2]);

  // Pointer tracking adds a little extra rotation on desktop.
  const { x: px, y: py } = usePointerParallax(!lite);
  const rotateY = useTransform(px, [-0.5, 0.5], [-5, 5]);
  const tiltPointer = useTransform(py, [-0.5, 0.5], [3, -3]);
  const rotateX = useTransform([tiltScroll, tiltPointer], ([a, b]) => (a as number) + (b as number));

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[1240px] px-3 md:px-10"
      style={{ perspective: 1600 }}
    >
      {/* glow behind the interface */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute inset-x-[10%] -top-10 bottom-0 bg-[radial-gradient(ellipse_at_center,rgba(124,231,211,0.18),transparent_65%)] blur-3xl"
      />

      <motion.div
        style={{ scale, rotateX, rotateY, y, opacity, transformStyle: "preserve-3d" }}
        className="relative transform-gpu"
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Dashboard live={!reduced} compact={lite} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Dashboard({ live, compact }: { live: boolean; compact: boolean }) {
  const tick = useTicker(1800, live);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const update = () => setClock(new Date().toISOString().slice(11, 19));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Live-ish stats, derived deterministically from the tick.
  const eps = Math.round(184200 + Math.sin(tick * 1.3) * 3800 + (tick % 5) * 420);
  const p99 = Math.round(112 + Math.sin(tick * 0.9) * 9);
  const err = (0.012 + (tick % 4) * 0.002).toFixed(3);
  const flows = 2184 + (tick % 7);

  const stats = [
    { label: "New pools", value: eps.toLocaleString("en-US"), delta: "+4.2%", good: true },
    { label: "latency", value: `${p99} ms`, delta: "−6.1%", good: true },
    { label: "Error rate", value: `${err}%`, delta: "+0.002", good: false },
    { label: "Active whales", value: flows.toLocaleString("en-US"), delta: "+12", good: true },
  ];

  // Rotating activity stream
  const [feed, setFeed] = useState(() =>
    activity.slice(0, 5).map((item, i) => ({ ...item, id: i })),
  );
  const counter = useRef(5);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      const c = counter.current++;
      const item = activity[c % activity.length];
      setFeed((prev) => [{ ...item, id: c }, ...prev].slice(0, 5));
    }, 2400);
    return () => window.clearInterval(id);
  }, [live]);

  const railIcons = [Layers, Activity, GitBranch, Radio, BarChart3];

  return (
    <div className="relative border border-white/[0.12] bg-ink-soft/90 shadow-[0_60px_160px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm">
      {/* title bar */}
      <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="h-1.5 w-1.5 bg-white/20" />
            <i className="h-1.5 w-1.5 bg-white/20" />
            <i className="h-1.5 w-1.5 bg-white/20" />
          </span>
          <span className="hidden sm:inline">robonhood / production / overview</span>
          <span className="sm:hidden">production</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline tabular-nums">{clock} UTC</span>
          <span className="flex items-center gap-2 text-signal">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-signal/70" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-signal" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[52px_1fr]">
        {/* navigation rail */}
        <div className="hidden flex-col items-center justify-between border-r border-white/10 py-5 md:flex" aria-hidden="true">
          <div className="flex flex-col gap-5">
            {railIcons.map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center text-mute",
                  i === 0 && "text-fog",
                )}
              >
                {i === 0 && <span className="absolute -left-[13px] h-5 w-px bg-signal" />}
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </span>
            ))}
          </div>
          <Settings className="h-4 w-4 text-mute" strokeWidth={1.5} />
        </div>

        {/* main */}
        <div className="grid gap-3 p-3 md:gap-4 md:p-5 lg:grid-cols-[1.7fr_1fr]">
          <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            {/* stats */}
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-ink-soft p-3 md:p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-mute md:text-[10px]">
                    {s.label}
                  </p>
                  <p className="mt-2 text-[18px] font-medium tabular-nums tracking-[-0.03em] text-fog md:text-[24px]">
                    {s.value}
                  </p>
                  <p className={cn("mt-1 font-mono text-[10px]", s.good ? "text-signal" : "text-ember")}>
                    {s.delta}
                  </p>
                </div>
              ))}
            </div>

            {/* chart */}
            <GlowPanel className="border border-white/10 bg-ink-soft p-3 md:p-4">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                <span>Throughput · last 60s</span>
                <span className="text-fog/70">new tokens</span>
              </div>
              <div className={compact ? "h-[130px]" : "h-[190px]"}>
                <LiveChart live={live} />
              </div>
            </GlowPanel>
          </div>

          <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            {/* activity */}
            <GlowPanel className="border border-white/10 bg-ink-soft p-3 md:p-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                Activity stream
              </p>
              <ul className="relative space-y-0" aria-label="Recent activity">
                <AnimatePresence initial={false} mode="popLayout">
                  {feed.slice(0, compact ? 3 : 5).map((item, i) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -14 }}
                      animate={{ opacity: 1 - i * 0.14, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 border-t border-white/[0.06] py-2.5 first:border-t-0"
                    >
                      <span className={cn("mt-[5px] h-1.5 w-1.5 shrink-0", levelColor[item.level])} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-mute">
                          {item.tag}
                        </span>
                        <span className="block truncate text-[12px] text-fog/90">{item.text}</span>
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </GlowPanel>

            {/* regions */}
            <div className="hidden border border-white/10 bg-ink-soft p-4 md:block">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                Regional load
              </p>
              <ul className="space-y-2.5">
                {regions.map((r, i) => {
                  const load = Math.min(96, r.load + Math.round(Math.sin(tick * 0.8 + i * 1.7) * 6));
                  return (
                    <li key={r.name} className="grid grid-cols-[64px_1fr_28px] items-center gap-3 font-mono text-[10px] text-mute">
                      <span>{r.name}</span>
                      <span className="h-px bg-white/10">
                        <motion.span
                          className="block h-px bg-signal/80"
                          animate={{ width: `${load}%` }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                      </span>
                      <span className="text-right tabular-nums text-fog/80">{load}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
