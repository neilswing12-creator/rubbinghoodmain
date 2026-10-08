"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";
import { useMotionProfile } from "@/lib/hooks";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

const base =
  "group relative inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-[2px] font-medium tracking-[-0.01em] transition-[background-color,border-color,box-shadow,color] duration-500 will-change-transform";

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-12 px-6 text-[15px]",
} as const;

const variants = {
  primary:
    "bg-fog text-ink hover:bg-white hover:shadow-[0_0_48px_-6px_rgba(124,231,211,0.6)]",
  ghost:
    "border border-white/20 text-fog hover:border-white/50 hover:bg-white/[0.04]",
} as const;

/**
 * CTA with a subtle magnetic pull toward the pointer.
 * Renders an <a> when `href` is set, otherwise a <button>.
 * Magnetism is disabled on touch devices and for reduced motion.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  "aria-label": ariaLabel,
}: Props) {
  const { reduced, coarse } = useMotionProfile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.3 });
  const enabled = !reduced && !coarse;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(base, sizes[size], variants[variant], className);
  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-60"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        style={{ x: sx, y: sy }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={classes}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}
