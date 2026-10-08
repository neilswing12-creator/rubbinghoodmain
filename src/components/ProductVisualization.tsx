"use client";

import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GitBranch, Radio, ShieldCheck, Zap } from "lucide-react";
import { networkNodes, type FeatureVisual } from "@/content/site";
import { clamp, cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/*  Shared frame                                                              */
/* -------------------------------------------------------------------------- */

function Frame({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <figure className="relative m-0 border border-white/[0.12] bg-ink-soft/90 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95)] backdrop-blur-sm">
      <figcaption className="flex h-10 items-center justify-between border-b border-white/10 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
        <span>{title}</span>
        <span className="text-fog/60">{meta}</span>
      </figcaption>
      {children}
    </figure>
  );
}

/** Picks the right visualization for a feature. */
export function ProductVisualization({ kind }: { kind: FeatureVisual }) {
  switch (kind) {
    case "connected":
      return <ConnectedVisual />;
    case "intelligence":
      return <IntelligenceVisual />;
    case "workflow":
      return <WorkflowVisual />;
  }
}

/* -------------------------------------------------------------------------- */
/*  01 — Connected graph                                                      */
/* -------------------------------------------------------------------------- */

const C = { x: 320, y: 220 };

const sats = [
  { x: 96, y: 96, anchor: "start" },
  { x: 330, y: 52, anchor: "middle" },
  { x: 560, y: 108, anchor: "end" },
  { x: 588, y: 304, anchor: "end" },
  { x: 392, y: 396, anchor: "middle" },
  { x: 128, y: 352, anchor: "start" },
  { x: 48, y: 226, anchor: "start" },
] as const;

function curve(i: number) {
  const s = sats[i];
  const mx = (s.x + C.x) / 2;
  const my = (s.y + C.y) / 2;
  const dx = C.x - s.x;
  const dy = C.y - s.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = (i % 2 === 0 ? 1 : -1) * 28;
  const qx = mx + (-dy / len) * bend;
  const qy = my + (dx / len) * bend;
  return `M ${s.x} ${s.y} Q ${qx} ${qy} ${C.x} ${C.y}`;
}

function ConnectedVisual() {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <Frame title="Onchain Method" meta="212 sources">
      <svg
        viewBox="0 0 640 440"
        className="block h-auto w-full"
        role="img"
        aria-label="Network graph: seven services connected to the RobOnHood core, with data packets travelling between them."
      >
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7ce7d3" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7ce7d3" stopOpacity="0" />
          </radialGradient>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#fff" fillOpacity="0.07" />
          </pattern>
        </defs>

        <rect width="640" height="440" fill="url(#dots)" />
        <circle cx={C.x} cy={C.y} r="190" fill="url(#core-glow)" />
        {[70, 130, 190].map((r) => (
          <circle key={r} cx={C.x} cy={C.y} r={r} fill="none" stroke="#fff" strokeOpacity="0.05" />
        ))}

        {/* edges */}
        {sats.map((_, i) => {
          const active = hover === i;
          return (
            <g key={i}>
              <path
                d={curve(i)}
                fill="none"
                stroke={active ? "#7ce7d3" : "#fff"}
                strokeOpacity={active ? 0.7 : 0.16}
                style={{ transition: "stroke-opacity .4s, stroke .4s" }}
              />
              {active && !reduced && (
                <path
                  d={curve(i)}
                  fill="none"
                  stroke="#7ce7d3"
                  strokeWidth="1.5"
                  strokeDasharray="3 9"
                  className="animate-dash"
                />
              )}
            </g>
          );
        })}

        {/* packets */}
        {!reduced &&
          sats.map((_, i) => (
            <circle key={`p${i}`} r="2.4" fill="#7ce7d3">
              <animateMotion
                dur={`${2.6 + (i % 3) * 0.5}s`}
                begin={`${i * 0.45}s`}
                repeatCount="indefinite"
                path={curve(i)}
                keyPoints={i % 2 === 0 ? "0;1" : "1;0"}
                keyTimes="0;1"
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.85;1"
                dur={`${2.6 + (i % 3) * 0.5}s`}
                begin={`${i * 0.45}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

        {/* satellites */}
        {sats.map((s, i) => {
          const node = networkNodes[i];
          const active = hover === i;
          const lx = s.anchor === "start" ? s.x + 14 : s.anchor === "end" ? s.x - 14 : s.x;
          const ly = s.anchor === "middle" ? (s.y > C.y ? s.y + 26 : s.y - 14) : s.y + 4;
          return (
            <g
              key={node.id}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              style={{ cursor: "default" }}
            >
              <rect x={s.x - 22} y={s.y - 22} width="44" height="44" fill="transparent" />
              <rect
                x={s.x - 5}
                y={s.y - 5}
                width="10"
                height="10"
                fill="#050607"
                stroke={active ? "#7ce7d3" : "#ecebe6"}
                strokeOpacity={active ? 1 : 0.55}
                style={{ transition: "stroke .3s" }}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={s.anchor}
                fontSize="10.5"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                letterSpacing="1.4"
                fill={active ? "#ecebe6" : "#8a9097"}
              >
                {node.label}
              </text>
              {active && (
                <text
                  x={lx}
                  y={ly + 14}
                  textAnchor={s.anchor}
                  fontSize="9.5"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill={node.status === "degraded" ? "#ffb86b" : "#7ce7d3"}
                >
                  {node.latency}
                </text>
              )}
            </g>
          );
        })}

        {/* core */}
        {!reduced && (
          <circle
            cx={C.x}
            cy={C.y}
            r="26"
            fill="none"
            stroke="#7ce7d3"
            strokeOpacity="0.5"
            className="animate-pulse-ring"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        )}
        <circle cx={C.x} cy={C.y} r="26" fill="#050607" stroke="#7ce7d3" strokeOpacity="0.7" />
        <circle cx={C.x} cy={C.y} r="14" fill="none" stroke="#fff" strokeOpacity="0.18" />
        <circle cx={C.x} cy={C.y} r="5" fill="#7ce7d3" />
        <text
          x={C.x}
          y={C.y + 48}
          textAnchor="middle"
          fontSize="9.5"
          letterSpacing="2"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fill="#ecebe6"
          fillOpacity="0.8"
        >
          ROBONHOOD CORE
        </text>
      </svg>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  02 — Signal intelligence                                                  */
/* -------------------------------------------------------------------------- */

const N = 80;
const W = 640;
const H = 240;
const PAD = 26;
const SPIKE = 62;

const base = (i: number) => 118 + 14 * Math.sin(i / 7) + 8 * Math.sin(i / 2.9);
const value = (i: number) => base(i) + 262 * Math.exp(-(((i - SPIKE) / 2.6) ** 2));
const X = (i: number) => (i / (N - 1)) * W;
const Y = (v: number) => H - PAD - (v / 460) * (H - PAD * 2);

function smooth(points: readonly (readonly [number, number])[]) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const idxs = Array.from({ length: N }, (_, i) => i);
const LINE = smooth(idxs.map((i) => [X(i), Y(value(i))] as const));
const UPPER = idxs.map((i) => [X(i), Y(base(i) + 32)] as const);
const LOWER = idxs.map((i) => [X(i), Y(base(i) - 32)] as const).reverse();
const BAND = `${smooth(UPPER)} L ${LOWER[0][0]} ${LOWER[0][1]} ${smooth(LOWER).replace(/^M [\d.-]+ [\d.-]+/, "")} Z`;

const ranked = [
  {
    name: "$ROB",
    metric: "Momentum +87%",
    cause: "Strong buy pressure",
    impact: 92,
  },
  {
    name: "$PEPE",
    metric: "Volume +64%",
    cause: "Liquidity inflow",
    impact: 76,
  },
  {
    name: "$DOGE",
    metric: "Activity +41%",
    cause: "Wallet accumulation",
    impact: 58,
  },
] as const;

function IntelligenceVisual() {
  const [idx, setIdx] = useState<number | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setIdx(clamp(Math.round(((e.clientX - r.left) / r.width) * (N - 1)), 0, N - 1));
  };

  const mx = X(SPIKE);
  const my = Y(value(SPIKE));

  return (
    <Frame title="Signal / api" meta="adaptive baseline">
      <div className="p-4 md:p-5">
        <div
          className="relative touch-pan-y"
          onPointerMove={onMove}
          onPointerLeave={() => setIdx(null)}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full overflow-visible"
            role="img"
            aria-label="Latency chart with an anomaly spike detected near the right side, well above the learned baseline band."
          >
            {[0, 1, 2, 3].map((g) => (
              <line
                key={g}
                x1="0"
                x2={W}
                y1={PAD + (g * (H - PAD * 2)) / 3}
                y2={PAD + (g * (H - PAD * 2)) / 3}
                stroke="#fff"
                strokeOpacity="0.06"
              />
            ))}

            {/* learned baseline */}
            <motion.path
              d={BAND}
              fill="#fff"
              fillOpacity="0.045"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            />

            {/* signal */}
            <motion.path
              d={LINE}
              fill="none"
              stroke="#ecebe6"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: EASE }}
            />

            {/* anomaly */}
            <circle
              cx={mx}
              cy={my}
              r="12"
              fill="none"
              stroke="#ffb86b"
              strokeOpacity="0.6"
              className="animate-pulse-ring"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <circle cx={mx} cy={my} r="4" fill="#ffb86b" />
            <text
              x={mx - 14}
              y={my - 2}
              textAnchor="end"
              fontSize="10"
              letterSpacing="1.4"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fill="#ffb86b"
            >
              PRESSURE · +312%
            </text>

            {/* crosshair */}
            {idx !== null && (
              <g>
                <line x1={X(idx)} x2={X(idx)} y1="0" y2={H} stroke="#7ce7d3" strokeOpacity="0.5" />
                <circle cx={X(idx)} cy={Y(value(idx))} r="3.5" fill="#7ce7d3" />
              </g>
            )}
          </svg>

          {idx !== null && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap border border-white/15 bg-ink/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fog backdrop-blur"
              style={{
                left: `${clamp((idx / (N - 1)) * 100, 12, 88)}%`,
                top: `calc(${(Y(value(idx)) / H) * 100}% - 12px)`,
              }}
            >
              −{N - 1 - idx}m · {Math.round(value(idx))} ms
            </div>
          )}
        </div>

        <ul className="mt-5 border-t border-white/10" aria-label="Ranked by impact">
          {ranked.map((r, i) => (
            <li
              key={r.name}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-white/[0.06] py-3 sm:grid-cols-[1fr_auto_96px]"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13px] text-fog">{r.name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                  {r.cause}
                </span>
              </span>
              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  i === 0 ? "text-ember" : "text-fog/70",
                )}
              >
                {r.metric}
              </span>
              <span className="col-span-2 h-px bg-white/10 sm:col-span-1" aria-hidden="true">
                <motion.span
                  className={cn("block h-px", i === 0 ? "bg-ember" : "bg-signal/70")}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.impact}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.3 + i * 0.12 }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  03 — Workflow                                                             */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    title: "Scan",
    caption: "Token enters the radar",
    icon: Radio,
    code: [
      "trigger: token.detected",
      "source: on-chain.market",
      "scan: liquidity + volume",
      "status: analyzing",
    ],
  },
  {
    title: "Analyze",
    caption: "AI evaluates the token",
    icon: GitBranch,
    code: [
      "model: robonhood.ai",
      "check: liquidity + holders",
      "check: volume + momentum",
      "risk: contract + market",
    ],
  },
  {
    title: "Signal",
    caption: "AI generates an assessment",
    icon: Zap,
    code: [
      "signal: bullish",
      "confidence: 87%",
      "risk: moderate",
      "action: trade-ready",
    ],
  },
  {
    title: "Trade",
    caption: "Execute directly on-chain",
    icon: ShieldCheck,
    code: [
      "asset: $ROB",
      "route: best available liquidity",
      "execution: on-chain",
      "status: confirmed",
    ],
  },
] as const;

function WorkflowVisual() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % steps.length), 2800);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const step = steps[active];

  return (
    <Frame title="Workflow / onchain" meta={`run 8f21 · step ${active + 1}/4`}>
      <div
        className="grid md:grid-cols-[250px_1fr]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <ol className="relative border-b border-white/10 p-4 md:border-b-0 md:border-r md:p-5">
          {/* progress line */}
          <span aria-hidden="true" className="absolute bottom-9 left-[31px] top-9 w-px bg-white/10 md:left-[35px]">
            <motion.span
              className="absolute left-0 top-0 block w-px bg-signal"
              animate={{ height: `${(active / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </span>

          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active;
            const done = i < active;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "relative flex w-full items-center gap-4 px-2 py-3 text-left transition-colors duration-500",
                    isActive ? "text-fog" : "text-mute hover:text-fog/80",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border bg-ink transition-[border-color,box-shadow] duration-500",
                      isActive
                        ? "border-signal shadow-[0_0_24px_-2px_rgba(124,231,211,0.55)]"
                        : done
                          ? "border-signal/40"
                          : "border-white/15",
                    )}
                  >
                    <Icon
                      className={cn("h-3.5 w-3.5", isActive || done ? "text-signal" : "text-mute")}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium tracking-[-0.02em]">{s.title}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                      {s.caption}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative min-h-[240px] p-5 md:p-7">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
            playbook.yaml
          </p>
          <AnimatePresence mode="wait">
            <motion.pre
              key={step.title}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="m-0 whitespace-pre-wrap font-mono text-[12.5px] leading-[2] text-fog/90 md:text-[13px]"
            >
              {step.code.map((line) => {
                const [key, ...rest] = line.split(": ");
                const hasValue = rest.length > 0;
                return (
                  <span key={line} className="block">
                    <span className={hasValue ? "text-mute" : "text-fog"}>
                      {hasValue ? `${key}: ` : line}
                    </span>
                    {hasValue && <span className="text-signal">{rest.join(": ")}</span>}
                  </span>
                );
              })}
            </motion.pre>
          </AnimatePresence>

          <div
            aria-hidden="true"
            className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute md:left-7 md:right-7"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-signal" />
              {active === steps.length - 1 ? "Resolved" : "Running"}
            </span>
            <span className="tabular-nums">{(1.2 + active * 1.0).toFixed(1)}s elapsed</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
