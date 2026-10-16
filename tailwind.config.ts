import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#121212", panel: "#1b1b1b", line: "#2b2b2b", paper: "#efede8", gain: "#22c55e", lilac: "#c084fc", amber: "#f59e0b" },
    fontFamily: { sans: ["var(--font-sans)"], mono: ["var(--font-mono)"] } } },
} satisfies Config;
