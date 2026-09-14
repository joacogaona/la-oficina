import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--office-legacy-ink-rgb) / <alpha-value>)",
        soot: "rgb(var(--office-legacy-soot-rgb) / <alpha-value>)",
        ivory: "rgb(var(--office-legacy-ivory-rgb) / <alpha-value>)",
        parchment: "rgb(var(--office-legacy-parchment-rgb) / <alpha-value>)",
        wax: "rgb(var(--office-legacy-wax-rgb) / <alpha-value>)",
        office: {
          surface: "var(--office-surface)",
          text: "var(--office-text)",
          muted: "var(--office-text-muted)",
          action: "var(--office-action)",
          paper: "var(--office-color-paper)",
          red: "var(--office-color-red)",
          olive: "var(--office-color-olive)",
          blue: "var(--office-color-blue)",
        },
      },
      fontFamily: {
        display: ["var(--office-font-display)"],
        body: ["var(--office-font-body)"],
        archive: ["var(--office-font-label)"],
        fell: ["var(--office-font-label)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
