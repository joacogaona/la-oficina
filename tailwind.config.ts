import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070605",
        soot: "#11100e",
        ivory: "#f5ead4",
        parchment: "#d9c9a6",
        wax: "#5f1618",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"EB Garamond"', "serif"],
        fell: ['"IM Fell English"', "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
