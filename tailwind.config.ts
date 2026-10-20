import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a2038",
          900: "#0a2038",
          800: "#0e2a48",
          700: "#133658",
          600: "#1a4470",
        },
        fog: {
          DEFAULT: "#8798ab",
          soft: "#5d6c7d",
          deep: "#2a3644",
        },
        ice: {
          DEFAULT: "#e4ebf1",
          dim: "#c3d1de",
          mute: "#a6bacc",
        },
        haohan: "#bee8f4",
        volt: "#4fb8ff",
        gilt: "#c9b37a",
      },
      fontFamily: {
        display: ["var(--font-bodoni)", "var(--font-serif-sc)", "serif"],
        serifsc: ["var(--font-serif-sc)", "var(--font-bodoni)", "serif"],
        sans: ["var(--font-inter)", "var(--font-sans-sc)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        label: "0.32em",
        wide2: "0.18em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-3%, 2%)" },
          "40%": { transform: "translate(2%, -3%)" },
          "60%": { transform: "translate(-2%, -1%)" },
          "80%": { transform: "translate(3%, 3%)" },
        },
        flow: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        flicker: {
          "0%, 92%, 100%": { opacity: "1" },
          "93%": { opacity: "0.35" },
          "95%": { opacity: "0.9" },
          "96%": { opacity: "0.5" },
        },
      },
      animation: {
        grain: "grain 1.2s steps(5) infinite",
        flow: "flow 6s linear infinite",
        flicker: "flicker 7s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
