"use client";

import { useEffect, useId, useState } from "react";
import { clamp } from "@/lib/cn";

const N = 64;
const W = 640;
const H = 200;

const seed = () =>
  Array.from({ length: N }, (_, i) => 52 + 16 * Math.sin(i / 6) + 7 * Math.sin(i / 2.3));

function toPath(values: number[]) {
  const pts = values.map((v, i) => [(i / (N - 1)) * W, H - (clamp(v, 5, 95) / 100) * H] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

/**
 * Streaming line chart. Starts from deterministic data (no hydration mismatch),
 * then pushes a new random-walk sample on an interval when `live` is true.
 */
export function LiveChart({ live = true }: { live?: boolean }) {
  const [data, setData] = useState<number[]>(seed);
  const gradId = useId();

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = clamp(last + (Math.random() - 0.48) * 12, 22, 88);
        return [...prev.slice(1), next];
      });
    }, 1100);
    return () => window.clearInterval(id);
  }, [live]);

  const line = toPath(data);
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const last = clamp(data[data.length - 1], 5, 95);

  return (
    <div className="relative h-full min-h-[150px] w-full">
      {/* grid */}
      <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-px w-full bg-white/[0.06]" />
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Live throughput chart"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ce7d3" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7ce7d3" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path
          d={line}
          fill="none"
          stroke="#7ce7d3"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>

      {/* latest-point marker (HTML so it isn't distorted by preserveAspectRatio="none") */}
      <span
        aria-hidden="true"
        className="absolute right-0 h-2 w-2 -translate-y-1/2 translate-x-1/2 bg-signal shadow-[0_0_16px_3px_rgba(124,231,211,0.7)] transition-[top] duration-1000 ease-linear"
        style={{ top: `${100 - last}%` }}
      />
    </div>
  );
}
