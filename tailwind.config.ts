import type { Config } from "tailwindcss"
import { theme } from "./lib/theme-config"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: theme.colors.primary,
          foreground: theme.colors.text,
        },
        secondary: {
          DEFAULT: theme.colors.secondary,
          foreground: theme.colors.textMuted,
        },
        accent: {
          DEFAULT: theme.colors.accent,
          teal: theme.colors.accentTeal,
          cyan: theme.colors.accentCyan,
        },
        green: {
          DEFAULT: theme.colors.green,
          foreground: theme.colors.greenForeground,
        },
        purple: {
          DEFAULT: theme.colors.purple,
          foreground: theme.colors.purpleForeground,
        },
        muted: {
          DEFAULT: theme.colors.border,
          foreground: theme.colors.textMuted,
        },
        card: {
          DEFAULT: theme.glassmorphism.background,
          foreground: theme.colors.text,
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      button: {
        "background": "blue",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: `0 0 20px ${theme.colors.accent}30` },
          "100%": { boxShadow: `0 0 30px ${theme.colors.accent}60` },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
