import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#050607", soft: "#0b0d0f" },
        fog: "#ecebe6",
        mute: "#8a9097",
        signal: "#7ce7d3",
        ember: "#ffb86b",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.65" },
          "50%": { transform: "scale(1.12)", opacity: "1" },
        },
        sweep: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(300%)" },
        },
        dash: {
          to: { strokeDashoffset: "-24" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.6)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        scrollcue: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        breathe: "breathe 9s ease-in-out infinite",
        sweep: "sweep 6s linear infinite",
        dash: "dash 1.2s linear infinite",
        "pulse-ring": "pulseRing 2.4s ease-out infinite",
        scrollcue: "scrollcue 2.2s cubic-bezier(.65,0,.35,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
