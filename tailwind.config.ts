import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        "text-primary": "hsl(var(--color-text-primary) / <alpha-value>)",
        "text-muted": "hsl(var(--color-text-muted) / <alpha-value>)",
        peacock: "hsl(var(--color-peacock) / <alpha-value>)",
        magenta: "hsl(var(--color-magenta) / <alpha-value>)",
        saffron: "hsl(var(--color-saffron) / <alpha-value>)",
        emerald: "hsl(var(--color-emerald) / <alpha-value>)",
        floral: "hsl(var(--color-floral) / <alpha-value>)",
        purple: "hsl(var(--color-purple) / <alpha-value>)",
        background: "hsl(var(--color-surface) / <alpha-value>)",
        foreground: "hsl(var(--color-text-primary) / <alpha-value>)",
        muted: "hsl(var(--color-text-muted) / <alpha-value>)",
        ring: "hsl(var(--color-ring) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "Satoshi", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.5rem, 5vw, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 4vw, 3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em" },
        ],
        heading: [
          "clamp(1.5rem, 2.5vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        "body-lg": [
          "clamp(1.125rem, 1.5vw, 1.25rem)",
          { lineHeight: "1.6" },
        ],
        caption: [
          "0.8125rem",
          { lineHeight: "1.4", letterSpacing: "0.04em" },
        ],
        overline: [
          "0.6875rem",
          { lineHeight: "1.3", letterSpacing: "0.12em" },
        ],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        content: "72rem",
        prose: "42rem",
        narrow: "32rem",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.76, 0, 0.24, 1)",
        cinematic: "cubic-bezier(0.76, 0, 0.24, 1)",
        enter: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.7, 0, 0.84, 0)",
        "soft-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        cinematic: "var(--duration-cinematic)",
      },
      animation: {
        "fade-up":
          "fadeUp var(--duration-base) var(--ease-luxury) forwards",
        "fade-in":
          "fadeIn var(--duration-base) var(--ease-luxury) forwards",
        "reveal-line":
          "revealLine var(--duration-slow) var(--ease-luxury) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        revealLine: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
