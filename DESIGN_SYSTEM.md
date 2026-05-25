# V Design Luxury — Design System

> A token-driven luxury design language fusing Apple restraint, Dior editorial typography, Aesop tactile warmth, and modern Indian chromatic confidence—engineered for Tailwind CSS 4 and cinematic WebGPU-ready surfaces.

---

## 1. Design Language Principles

| Influence | Extract |
|-----------|---------|
| **Apple** | Generous whitespace, system-level clarity, invisible UI chrome |
| **Dior** | High-contrast serif display, fashion-editorial hierarchy |
| **Aesop** | Warm neutrals, tactile surfaces, muted botanical accents |
| **Modern India** | Peacock, saffron, emerald, floral pink—used as precise accents, never wallpaper |
| **WebGPU / Cinematic** | Depth via light, grain, and motion—not glassmorphism stacks |

Spatial and micro-interaction patterns reference [draftly.space](https://draftly.space), [impeccable.style](https://impeccable.style), [21st.dev](https://21st.dev), and [ui-skills.com](https://ui-skills.com).

---

## 2. Typography Strategy

### 2.1 Font Pairing

| Role | Primary | Fallback | Usage |
|------|---------|----------|-------|
| **Display / Editorial** | Cormorant Garamond | Georgia, serif | H1–H3, hero statements, pull quotes |
| **UI / Body** | Satoshi | Inter, system-ui | Navigation, body copy, buttons, labels |
| **Mono / Data** | Inter (tabular nums) | ui-monospace | SKUs, prices, timestamps |

### 2.2 Loading (Next.js `next/font`)

```typescript
// src/app/layout.tsx
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Satoshi: self-host from /public/fonts if licensed
// @font-face in globals.css → --font-ui
```

### 2.3 Type Scale (Fluid)

| Token | Mobile | Desktop | Weight | Tracking |
|-------|--------|---------|--------|----------|
| `--text-display-xl` | clamp(2.5rem, 5vw, 4.5rem) | — | 500 | -0.02em |
| `--text-display-lg` | clamp(2rem, 4vw, 3.5rem) | — | 500 | -0.015em |
| `--text-heading` | clamp(1.5rem, 2.5vw, 2.25rem) | — | 600 | -0.01em |
| `--text-body-lg` | 1.125rem | 1.25rem | 400 | 0 |
| `--text-body` | 1rem | 1rem | 400 | 0 |
| `--text-caption` | 0.8125rem | 0.875rem | 500 | 0.04em |
| `--text-overline` | 0.6875rem | 0.75rem | 600 | 0.12em |

**Rule:** Display serif for emotion; sans for function. Never use serif below 14px.

---

## 3. Color Palette — HSL Token Translations

All tokens use **HSL without wrapper** for Tailwind 4 `@theme` compatibility: `hsl(var(--token) / <alpha-value>)`.

### 3.1 Core Neutrals

| Name | Hex | HSL | CSS Variable |
|------|-----|-----|--------------|
| Surface | `#FFF7F2` | `24 100% 97%` | `--color-surface` |
| Border | `#E9E1D8` | `32 29% 88%` | `--color-border` |
| Primary Text | `#1A1A1A` | `0 0% 10%` | `--color-text-primary` |
| Muted Text | `#666666` | `0 0% 40%` | `--color-text-muted` |

### 3.2 Accent Chromatics (Indian Luxury)

| Name | Hex | HSL | CSS Variable | Semantic Use |
|------|-----|-----|--------------|--------------|
| Peacock Blue | `#0088A9` | `192 100% 33%` | `--color-peacock` | Links, trust, packaging tech |
| Royal Magenta | `#D91E63` | `340 76% 48%` | `--color-magenta` | CTAs, limited editions |
| Saffron Gold | `#E2A03F` | `37 74% 57%` | `--color-saffron` | Highlights, awards, warmth |
| Emerald | `#3FA36A` | `146 44% 44%` | `--color-emerald` | Sustainability, craft |
| Floral Pink | `#F35D8C` | `341 86% 66%` | `--color-floral` | Seasonal, editorial accents |
| Luxury Purple | `#7D5FFF` | `252 100% 69%` | `--color-purple` | Agency, creative services |

### 3.3 Derived Semantic Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-background` | `var(--color-surface)` | Page canvas |
| `--color-foreground` | `var(--color-text-primary)` | Default text |
| `--color-muted` | `var(--color-text-muted)` | Secondary text |
| `--color-ring` | `192 100% 33%` | Focus rings (Peacock) |
| `--color-destructive` | `340 76% 48%` | Errors (Magenta, sparingly) |

---

## 4. CSS Custom Properties (`globals.css`)

```css
@import "tailwindcss";

:root {
  /* ── Surfaces & Text ── */
  --color-surface: 24 100% 97%;
  --color-border: 32 29% 88%;
  --color-text-primary: 0 0% 10%;
  --color-text-muted: 0 0% 40%;

  /* ── Accents ── */
  --color-peacock: 192 100% 33%;
  --color-magenta: 340 76% 48%;
  --color-saffron: 37 74% 57%;
  --color-emerald: 146 44% 44%;
  --color-floral: 341 86% 66%;
  --color-purple: 252 100% 69%;

  /* ── Semantic Aliases ── */
  --color-background: var(--color-surface);
  --color-foreground: var(--color-text-primary);
  --color-muted: var(--color-text-muted);
  --color-ring: var(--color-peacock);

  /* ── Typography ── */
  --font-display: var(--font-cormorant), Georgia, serif;
  --font-sans: var(--font-inter), "Satoshi", system-ui, sans-serif;

  /* ── Spacing Scale (4px base) ── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* ── Radius ── */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* ── Shadows (warm, low elevation) ── */
  --shadow-soft: 0 2px 24px -4px hsl(32 29% 50% / 0.08);
  --shadow-lift: 0 8px 40px -8px hsl(32 29% 30% / 0.12);

  /* ── Motion Tokens ── */
  --ease-luxury: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 700ms;
  --duration-cinematic: 1200ms;
}

@theme inline {
  --color-surface: hsl(var(--color-surface));
  --color-border: hsl(var(--color-border));
  --color-text-primary: hsl(var(--color-text-primary));
  --color-text-muted: hsl(var(--color-text-muted));
  --color-peacock: hsl(var(--color-peacock));
  --color-magenta: hsl(var(--color-magenta));
  --color-saffron: hsl(var(--color-saffron));
  --color-emerald: hsl(var(--color-emerald));
  --color-floral: hsl(var(--color-floral));
  --color-purple: hsl(var(--color-purple));
  --color-background: hsl(var(--color-background));
  --color-foreground: hsl(var(--color-foreground));
  --color-muted: hsl(var(--color-muted));
  --color-ring: hsl(var(--color-ring));
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
}

body {
  background-color: hsl(var(--color-surface));
  color: hsl(var(--color-text-primary));
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 5. `tailwind.config.ts` Blueprint

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        'text-primary': 'hsl(var(--color-text-primary) / <alpha-value>)',
        'text-muted': 'hsl(var(--color-text-muted) / <alpha-value>)',
        peacock: 'hsl(var(--color-peacock) / <alpha-value>)',
        magenta: 'hsl(var(--color-magenta) / <alpha-value>)',
        saffron: 'hsl(var(--color-saffron) / <alpha-value>)',
        emerald: 'hsl(var(--color-emerald) / <alpha-value>)',
        floral: 'hsl(var(--color-floral) / <alpha-value>)',
        purple: 'hsl(var(--color-purple) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        heading: ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1.125rem, 1.5vw, 1.25rem)', { lineHeight: '1.6' }],
        caption: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        overline: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.12em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': '72rem',
        'prose': '42rem',
        'narrow': '32rem',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.76, 0, 0.24, 1)',
        enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
        exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
        'soft-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        cinematic: 'var(--duration-cinematic)',
      },
      animation: {
        'fade-up': 'fadeUp var(--duration-base) var(--ease-luxury) forwards',
        'fade-in': 'fadeIn var(--duration-base) var(--ease-luxury) forwards',
        'reveal-line': 'revealLine var(--duration-slow) var(--ease-luxury) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        revealLine: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 6. Component Token Usage

| Element | Background | Text | Border | Accent |
|---------|-----------|------|--------|--------|
| Primary button | `text-primary` | `surface` | — | hover: `peacock` |
| Secondary button | transparent | `text-primary` | `border` | hover border: `peacock` |
| Accent CTA | `magenta` | `surface` | — | — |
| Card | `surface` | `text-primary` | `border` | shadow: `soft` |
| Link | — | `peacock` | — | underline offset 4px |
| Badge (craft) | `saffron/10` | `saffron` | — | — |
| Badge (sustainable) | `emerald/10` | `emerald` | — | — |

---

## 7. WebGPU Surface Tokens

For shader uniforms and canvas overlays—kept separate from UI tokens:

```css
:root {
  --gpu-grain-opacity: 0.04;
  --gpu-vignette: hsl(0 0% 10% / 0.15);
  --gpu-ambient-peacock: hsl(192 100% 33% / 0.06);
  --gpu-ambient-saffron: hsl(37 74% 57% / 0.04);
}
```

Reference: [cazala/webgpu-skill](https://github.com/cazala/webgpu-skill), [emergent.sh](https://emergent.sh), [tasteskill.dev](https://tasteskill.dev).

---

## 8. Accessibility

- Minimum contrast: **4.5:1** body text; **3:1** large display (Cormorant ≥ 24px).
- Focus: `ring-2 ring-peacock ring-offset-2 ring-offset-surface`.
- Never convey meaning by color alone—pair with icon or label.
- Respect `prefers-reduced-motion` (see `MOTION_SYSTEM.md`).

---

## 9. Forbidden Patterns

- Pure `#000` / `#FFF` outside token system
- Neon gradients, rainbow mesh backgrounds
- Default Tailwind palette (`blue-500`, `gray-200`) in production components
- Glassmorphism stacks (`backdrop-blur` + low opacity) as primary surfaces
- More than **one** accent color per viewport section

---

*Design System v1.0 — V Design Luxury*
