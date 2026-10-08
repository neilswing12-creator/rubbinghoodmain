type ClassValue = string | false | null | undefined;

/** Tiny className joiner (no dependency needed). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
