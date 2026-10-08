import type { Variants } from "framer-motion";

/** Shared easing curves — one family keeps the whole page feeling cohesive. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Default viewport config for scroll-reveals. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/** Fade + rise + de-blur. Pass `custom={delaySeconds}` to stagger. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE, delay },
  }),
};

/** Clip-path wipe from top to bottom. */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  show: (delay: number = 0) => ({
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 1.1, ease: EASE, delay },
  }),
};

/** Container variant that staggers its children. */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const SPRING_SOFT = { stiffness: 120, damping: 20, mass: 0.4 } as const;
