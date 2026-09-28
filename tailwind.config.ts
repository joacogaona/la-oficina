import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        office: {
          surface: "var(--office-surface)",
          text: "var(--office-text)",
          muted: "var(--office-text-muted)",
          action: "var(--office-action)",
          paper: "var(--office-color-paper)",
          ink: "var(--office-color-ink)",
          red: "var(--office-color-red)",
        },
      },
      fontFamily: {
        display: ["var(--office-font-display)"],
        body: ["var(--office-font-body)"],
        reading: ["var(--office-font-reading)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
