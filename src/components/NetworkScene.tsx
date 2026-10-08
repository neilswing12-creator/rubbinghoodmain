"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { networkNodes, system } from "@/content/site";
import { useCanvasLoop } from "@/lib/canvas";
import { useMotionProfile } from "@/lib/hooks";
import { VIEWPORT, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/SectionHeading";

interface SceneNode {
  idx: number;
  ang: number;
  ring: number;
  depth: number;
  dx: number;
  dy: number;
  x: number;
  y: number;
}

interface Decor {
  ang: number;
  ring: number;
  depth: number;
  r: number;
}

interface Packet {
  edge: number;
  t: number;
  speed: number;
  reverse: boolean;
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SIGNAL = "124,231,211";
const EMBER = "255,184,107";

/** Quadratic Bézier point. */
function quad(
  p0x: number,
  p0y: number,
  cx: number,
  cy: number,
  p1x: number,
  p1y: number,
  t: number,
) {
  const u = 1 - t;
  return {
    x: u * u * p0x + 2 * u * t * cx + t * t * p1x,
    y: u * u * p0y + 2 * u * t * cy + t * t * p1y,
  };
}

/**
 * Interactive topology. A central core with services orbiting it,
 * curved connections and data packets travelling along them.
 *
 * Pointer: nodes drift away from the cursor, connections bow, and the whole
 * scene shifts like a camera. Click / tap a node to fire a burst of packets.
 * Mobile and reduced-motion get a lighter (or static) version.
 */
export function NetworkScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reduced, lite } = useMotionProfile();
  const [hover, setHover] = useState<number | null>(null);

  const hoverRef = useRef<number | null>(null);
  const pointer = useRef({ x: -999, y: -999, nx: 0.5, ny: 0.5, sx: 0.5, sy: 0.5, inside: false });
  const packets = useRef<Packet[]>([]);

  const nodes = useMemo<SceneNode[]>(
    () =>
      networkNodes.map((_, i) => ({
        idx: i,
        ang: -Math.PI / 2 + (i / networkNodes.length) * Math.PI * 2,
        ring: i % 2 === 0 ? 1 : 0.8,
        depth: 0.8 + ((i * 37) % 5) / 10,
        dx: 0,
        dy: 0,
        x: 0,
        y: 0,
      })),
    [],
  );

  const decor = useMemo<Decor[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        ang: i * 2.399963,
        ring: 0.35 + ((i * 53) % 70) / 100,
        depth: 0.5 + ((i * 29) % 11) / 7,
        r: 1 + ((i * 7) % 3) * 0.4,
      })),
    [],
  );

  useCanvasLoop(
    ref,
    ({ ctx, w, h, t, dt }) => {
      ctx.clearRect(0, 0, w, h);
      const P = pointer.current;
      const narrow = w < 640;

      // smooth camera
      const follow = Math.min(1, dt * 3);
      P.sx += ((P.inside && !lite ? P.nx : 0.5) - P.sx) * follow;
      P.sy += ((P.inside && !lite ? P.ny : 0.5) - P.sy) * follow;
      const camX = (P.sx - 0.5) * -30;
      const camY = (P.sy - 0.5) * -20;

      const cx = w / 2 + camX;
      const cy = h / 2 + camY;
      const rx = Math.min(w * (narrow ? 0.3 : 0.36), 520);
      const ry = Math.min(h * (narrow ? 0.32 : 0.35), 300);
      const hoverId = hoverRef.current;

      // orbits
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      for (const k of [0.45, 0.8, 1.12]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * k, ry * k, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 1.1);
      glow.addColorStop(0, `rgba(${SIGNAL},0.14)`);
      glow.addColorStop(1, `rgba(${SIGNAL},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // positions
      for (const n of nodes) {
        const a = n.ang + t * 0.035 * (n.ring > 0.9 ? 1 : -1);
        const bx = cx + Math.cos(a) * rx * n.ring + camX * (n.depth - 1) * 1.6;
        const by = cy + Math.sin(a) * ry * n.ring + camY * (n.depth - 1) * 1.6;

        let tx = 0;
        let ty = 0;
        if (P.inside && !lite) {
          const ddx = bx - P.x;
          const ddy = by - P.y;
          const d = Math.hypot(ddx, ddy);
          if (d < 170) {
            const f = 1 - d / 170;
            tx = (ddx / (d || 1)) * f * 22;
            ty = (ddy / (d || 1)) * f * 22;
          }
        }
        const ease = Math.min(1, dt * 6);
        n.dx += (tx - n.dx) * ease;
        n.dy += (ty - n.dy) * ease;
        n.x = bx + n.dx;
        n.y = by + n.dy;
      }

      // control point for each core↔node edge (bows with pointer)
      const bowBase = 30 + (P.sx - 0.5) * 40;
      const ctrl = (n: SceneNode) => {
        const mx = (n.x + cx) / 2;
        const my = (n.y + cy) / 2;
        const ex = cx - n.x;
        const ey = cy - n.y;
        const len = Math.hypot(ex, ey) || 1;
        const sign = n.idx % 2 === 0 ? 1 : -1;
        const bow = bowBase * sign + Math.sin(t * 0.4 + n.idx) * 6;
        return { x: mx + (-ey / len) * bow, y: my + (ex / len) * bow };
      };

      // neighbour links
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const b = nodes[(i + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // core edges
      for (const n of nodes) {
        const c = ctrl(n);
        const active = hoverId === n.idx;
        ctx.strokeStyle = active ? `rgba(${SIGNAL},0.65)` : "rgba(255,255,255,0.14)";
        ctx.lineWidth = active ? 1.3 : 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.quadraticCurveTo(c.x, c.y, cx, cy);
        ctx.stroke();
      }
      ctx.lineWidth = 1;

      // packets
      const list = packets.current;
      const maxPackets = lite ? 5 : 14;
      if (list.length < maxPackets && Math.random() < dt * (lite ? 1.6 : 3.2)) {
        list.push({
          edge: Math.floor(Math.random() * nodes.length),
          t: 0,
          speed: 0.22 + Math.random() * 0.22,
          reverse: Math.random() > 0.5,
        });
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.t += p.speed * dt;
        if (p.t >= 1) {
          list.splice(i, 1);
          continue;
        }
        if (p.t < 0) continue; // staggered burst packets wait their turn

        const n = nodes[p.edge];
        const c = ctrl(n);
        const color = networkNodes[n.idx].status === "degraded" ? EMBER : SIGNAL;
        for (let k = 6; k >= 0; k--) {
          const tt = clamp01(p.t - k * 0.018);
          const u = p.reverse ? 1 - tt : tt;
          const pt = quad(n.x, n.y, c.x, c.y, cx, cy, u);
          const a = (1 - k / 7) * 0.7;
          ctx.fillStyle = `rgba(${color},${a})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, k === 0 ? 2.4 : 1.6 * (1 - k / 9), 0, Math.PI * 2);
          ctx.fill();
        }
        const head = quad(n.x, n.y, c.x, c.y, cx, cy, p.reverse ? 1 - p.t : p.t);
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 12);
        g.addColorStop(0, `rgba(${color},0.45)`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(head.x - 12, head.y - 12, 24, 24);
      }

      // decorative points
      for (const d of decor) {
        const a = d.ang + t * 0.02;
        const x = cx + Math.cos(a) * rx * 1.1 * d.ring + camX * (d.depth - 1) * 1.6;
        const y = cy + Math.sin(a) * ry * 1.1 * d.ring + camY * (d.depth - 1) * 1.6;
        ctx.fillStyle = `rgba(236,235,230,${0.12 + d.depth * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // core
      for (let k = 0; k < 3; k++) {
        const phase = (t * 0.35 + k / 3) % 1;
        ctx.strokeStyle = `rgba(${SIGNAL},${(1 - phase) * 0.2})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 16 + phase * 52, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#050607";
      ctx.strokeStyle = `rgba(${SIGNAL},0.8)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `500 ${narrow ? 9 : 10}px ${MONO}`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(236,235,230,0.75)";
      ctx.fillText("ROBONHOOD CORE", cx, cy + 34);

      // nodes + labels
      ctx.font = `500 ${narrow ? 9 : 10.5}px ${MONO}`;
      for (const n of nodes) {
        const meta = networkNodes[n.idx];
        const active = hoverId === n.idx;
        const degraded = meta.status === "degraded";

        if (active) {
          const hg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 34);
          hg.addColorStop(0, `rgba(${SIGNAL},0.28)`);
          hg.addColorStop(1, `rgba(${SIGNAL},0)`);
          ctx.fillStyle = hg;
          ctx.fillRect(n.x - 34, n.y - 34, 68, 68);
        }

        ctx.fillStyle = "#050607";
        ctx.strokeStyle = active ? `rgb(${SIGNAL})` : "rgba(236,235,230,0.55)";
        ctx.fillRect(n.x - 4.5, n.y - 4.5, 9, 9);
        ctx.strokeRect(n.x - 4.5, n.y - 4.5, 9, 9);

        // status pip
        ctx.fillStyle = degraded ? `rgb(${EMBER})` : `rgb(${SIGNAL})`;
        ctx.fillRect(n.x + 6, n.y - 9, 3, 3);

        // label placed outward from the core
        const ox = n.x - cx;
        const oy = n.y - cy;
        const len = Math.hypot(ox, oy) || 1;
        const ux = ox / len;
        const uy = oy / len;
        ctx.textAlign = ux > 0.3 ? "left" : ux < -0.3 ? "right" : "center";
        ctx.fillStyle = active ? "rgba(236,235,230,1)" : "rgba(138,144,151,0.95)";
        ctx.fillText(meta.label, n.x + ux * 20, n.y + uy * 20 + (Math.abs(ux) <= 0.3 ? (uy > 0 ? 6 : -6) : 0));
      }
    },
    { dprCap: lite ? 1.25 : 1.75, fps: lite ? 30 : 60, once: reduced },
  );

  // ---- pointer handling (HTML-side, low frequency) ----
  const local = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  };

  const nearest = (x: number, y: number) => {
    let best: number | null = null;
    let bestD = 30;
    for (const n of nodes) {
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < bestD) {
        bestD = d;
        best = n.idx;
      }
    }
    return best;
  };

  const setHoverBoth = (v: number | null) => {
    if (hoverRef.current !== v) {
      hoverRef.current = v;
      setHover(v);
    }
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y, w, h } = local(e);
    const P = pointer.current;
    P.x = x;
    P.y = y;
    P.nx = x / w;
    P.ny = y / h;
    P.inside = true;
    setHoverBoth(nearest(x, y));
  };

  const onLeave = () => {
    pointer.current.inside = false;
    setHoverBoth(null);
  };

  const fire = (idx: number) => {
    for (let k = 0; k < 5; k++) {
      packets.current.push({
        edge: idx,
        t: -k * 0.12,
        speed: 0.5,
        reverse: false,
      });
    }
  };

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = local(e);
    const hit = nearest(x, y);
    setHoverBoth(hit);
    if (hit !== null) fire(hit);
  };

  const active = hover !== null ? networkNodes[hover] : null;
  const degradedCount = networkNodes.filter((n) => n.status === "degraded").length;

  return (
    <section id="system" aria-label={system.label} className="relative border-t border-white/10 py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          label={system.label}
          lines={system.lines}
          description={system.body}
        />
      </div>

      <motion.div
        variants={fadeUp}
        custom={0.1}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="relative mt-16 h-[540px] border-y border-white/10 md:mt-24 md:h-[760px]"
      >
        <canvas
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          role="img"
          aria-label={`Interactive network: a central RobOnHood core connected to ${networkNodes.length} services (${networkNodes
            .map((n) => n.label.toLowerCase())
            .join(", ")}). ${degradedCount} currently degraded.`}
          className="absolute inset-0 h-full w-full touch-pan-y"
        />

        {/* overlays */}
        <div className="pointer-events-none absolute inset-x-5 top-4 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-mute md:inset-x-8 md:top-6">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse bg-signal" />
            Live chain
          </span>
          <span>
            {networkNodes.length} services · {degradedCount} degraded
          </span>
        </div>

        <div
          aria-live="polite"
          className="pointer-events-none absolute bottom-4 left-5 max-w-[17rem] font-mono text-[10px] uppercase tracking-[0.16em] md:bottom-6 md:left-8"
        >
          {active ? (
            <div className="border border-white/15 bg-ink/80 p-3 backdrop-blur">
              <div className="flex items-center gap-2 text-fog">
                <span
                  className={cn(
                    "h-1.5 w-1.5",
                    active.status === "degraded" ? "bg-ember" : "bg-signal",
                  )}
                />
                {active.label} · {active.latency}
              </div>
              <p className="mt-2 text-[10px] normal-case leading-relaxed tracking-normal text-mute">
                {active.detail}
              </p>
            </div>
          ) : (
            <span className="text-mute">
              {lite ? "Tap a node" : "Hover a node · click to send a signal"}
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-4 right-5 hidden items-center gap-5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute sm:flex md:bottom-6 md:right-8">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-signal" /> Nominal
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-ember" /> Degraded
          </span>
        </div>
      </motion.div>

      {/* Screen-reader / no-canvas equivalent */}
      <ul className="sr-only">
        {networkNodes.map((n) => (
          <li key={n.id}>
            {n.label}: {n.status}, {n.latency}. {n.detail}
          </li>
        ))}
      </ul>
    </section>
  );
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
