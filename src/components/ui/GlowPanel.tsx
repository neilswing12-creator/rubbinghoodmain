"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Panel whose border lights up around the pointer (see .glow-border in globals.css). */
export function GlowPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={cn("glow-border relative", className)}>
      {children}
    </div>
  );
}
