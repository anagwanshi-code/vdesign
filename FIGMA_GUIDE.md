# V Design Luxury — Figma Developer Handoff Guide

> Translating Figma spatial systems into production Next.js code—grid, typography, spacing, and responsive behavior with luxury precision.

Inspired by spatial UI frameworks: [draftly.space](https://draftly.space), [impeccable.style](https://impeccable.style), [21st.dev](https://21st.dev), [ui-skills.com](https://ui-skills.com).

---

## 1. Figma File Structure (Expected)

```
V Design Luxury — Master
├── 🎨 Design Tokens          # Colors, type, spacing (variables)
├── 📐 Grid & Layout          # Breakpoint frames, column specs
├── 🔤 Typography             # Type scale specimens
├── 🧩 Components             # Atoms → Organisms (match code hierarchy)
├── 📱 Responsive             # Mobile / Tablet / Desktop key screens
├── 🛍️ Shop                   # Ecommerce flows
├── 🏛️ Agency                 # Case study templates
└── 🎬 Motion Specs           # Duration, easing annotations
```

**Naming convention:** `Category/Component/Variant/State` (e.g., `Atoms/Button/Primary/Hover`).

---

## 2. Canvas Layout Scales

### 2.1 Frame Widths

| Breakpoint | Figma Frame | CSS Target | Columns |
|------------|-------------|------------|---------|
| Mobile | 390px | `< 768px` | 4 |
| Tablet | 768px | `768px – 1023px` | 8 |
| Desktop | 1440px | `≥ 1024px` | 12 |
| Wide | 1920px | `≥ 1536px` | 12 (max-width capped) |

### 2.2 Content Max-Width

- **Primary content:** 1152px (`max-w-content` = 72rem)
- **Prose/editorial:** 672px (`max-w-prose` = 42rem)
- **Narrow CTAs:** 512px (`max-w-narrow` = 32rem)
- **Full-bleed media:** 100vw (break out of container with negative margin technique)

```tsx
// Full-bleed breakout pattern
<section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
  {/* cinematic media */}
</section>
```

---

## 3. Grid System

### 3.1 Column Specifications

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (390) | 4 | 16px | 20px |
| Tablet (768) | 8 | 24px | 32px |
| Desktop (1440) | 12 | 24px | 80px |
| Wide (1920) | 12 | 32px | 120px |

### 3.2 Tailwind Grid Translation

```tsx
<div className="mx-auto grid max-w-content grid-cols-4 gap-4 px-5 md:grid-cols-8 md:gap-6 md:px-8 lg:grid-cols-12 lg:px-20">
  <div className="col-span-4 md:col-span-4 lg:col-span-6">Left</div>
  <div className="col-span-4 md:col-span-4 lg:col-span-6">Right</div>
</div>
```

### 3.3 Spatial Rhythm Rules

- Section vertical padding: **80px mobile** → **128px desktop**
- Component internal padding: **24px** (cards), **32px** (hero content blocks)
- Stack gap between elements: **8 / 16 / 24 / 32 / 48 / 64** (4px base scale)
- Never use arbitrary values (e.g., 23px, 37px)—round to token scale

---

## 4. Responsive Typography — Fluid Calculation

### 4.1 Formula

Figma static sizes convert to CSS `clamp()`:

```
clamp(MIN, PREFERRED, MAX)

PREFERRED = MIN + (MAX - MIN) × ((100vw - MIN_VW) / (MAX_VW - MIN_VW))
```

Simplified implementation:

```css
font-size: clamp(2rem, 1.5rem + 2.5vw, 4.5rem);
```

### 4.2 Figma → Code Translation Table

| Figma Style Name | Mobile | Desktop | Tailwind Token |
|------------------|--------|---------|----------------|
| Display/XL | 40px / 105% | 72px / 105% | `text-display-xl font-display` |
| Display/LG | 32px / 110% | 56px / 110% | `text-display-lg font-display` |
| Heading/H2 | 24px / 120% | 36px / 120% | `text-heading font-display` |
| Body/LG | 18px / 160% | 20px / 160% | `text-body-lg font-sans` |
| Body/Default | 16px / 160% | 16px / 160% | `text-body font-sans` |
| Caption | 13px / 140% | 14px / 140% | `text-caption font-sans` |
| Overline | 11px / 130% | 12px / 130% | `text-overline font-sans uppercase` |

### 4.3 Line Height & Tracking

| Figma Tracking | CSS |
|----------------|-----|
| -2% | `letter-spacing: -0.02em` |
| 0% | `letter-spacing: 0` |
| +4% | `letter-spacing: 0.04em` |
| +12% | `letter-spacing: 0.12em` |

**Rule:** Display serif (Cormorant) uses negative tracking; UI sans (Satoshi/Inter) uses neutral or positive for captions/overlines.

---

## 5. Color Token Handoff

Figma variables MUST map 1:1 to CSS custom properties (see `DESIGN_SYSTEM.md`):

| Figma Variable | CSS Token | Tailwind Class |
|----------------|-----------|----------------|
| `color/surface` | `--color-surface` | `bg-surface` |
| `color/border` | `--color-border` | `border-border` |
| `color/text-primary` | `--color-text-primary` | `text-text-primary` |
| `color/peacock` | `--color-peacock` | `text-peacock` / `bg-peacock` |
| ... | ... | ... |

**Dev rule:** If a Figma color doesn't exist in the token file, flag design—do not hardcode.

---

## 6. Spacing Token Handoff

| Figma Variable | Value | Tailwind |
|----------------|-------|----------|
| `space/1` | 4px | `p-1`, `gap-1` |
| `space/2` | 8px | `p-2`, `gap-2` |
| `space/4` | 16px | `p-4`, `gap-4` |
| `space/6` | 24px | `p-6`, `gap-6` |
| `space/8` | 32px | `p-8`, `gap-8` |
| `space/12` | 48px | `p-12`, `gap-12` |
| `space/16` | 64px | `p-16`, `gap-16` |
| `space/24` | 96px | `py-24` |
| `space/32` | 128px | `py-32` |

---

## 7. Component Spec Annotations

Designers must annotate these properties on every component:

| Property | Required | Example |
|----------|----------|---------|
| Auto-layout direction + gap | Yes | Horizontal, gap 16 |
| Padding | Yes | 24px all sides |
| Border radius | Yes | `radius/md` (8px) |
| Fill / stroke tokens | Yes | `surface`, `border` |
| Typography style | Yes | `Body/Default` |
| Hover state | Interactive only | Border → `peacock` |
| Focus state | Interactive only | 2px ring `peacock` |
| Motion duration + easing | Animated only | 400ms, luxury ease |

---

## 8. Image & Media Export Specs

| Asset Type | Format | Max Size | Notes |
|------------|--------|----------|-------|
| Hero image | WebP | 2400px wide | Provide 2x for retina |
| Product image | WebP | 1600px wide | Square or 4:5 ratio |
| Thumbnail | WebP | 800px wide | |
| OG image | JPG | 1200×630 | Text safe zone center |
| Logo | SVG | Vector | Single color + full color |
| Icon | SVG | 24×24 viewBox | Stroke 1.5px, lucide-compatible |
| Video loop | WebM + MP4 | 1920×1080, ≤5MB | 12s max, poster required |

### 8.1 Figma Export → Next.js Image

```tsx
import Image from 'next/image';

<Image
  src="/media/hero-packaging.webp"
  alt="Luxury packaging collection"
  width={2400}
  height={1600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1152px"
  priority
  className="object-cover"
/>
```

`sizes` attribute MUST match Figma breakpoint intent.

---

## 9. Motion Spec Translation

| Figma Annotation | Code Implementation |
|------------------|---------------------|
| `400ms luxury` | `duration-base ease-luxury` or Framer `ease: [0.76,0,0.24,1]` |
| `700ms reveal` | `duration-slow ease-luxury` |
| `1200ms cinematic` | GSAP `DURATION.cinematic` + `EASE.luxury` |
| Stagger 60ms | Framer `staggerChildren: 0.06` |
| Scroll pin | GSAP ScrollTrigger spec sheet |
| Parallax 15% | GSAP `yPercent: 15, scrub: 0.5` |

Reference: `MOTION_SYSTEM.md`

---

## 10. WebGPU / Cinematic Layer Specs

For hero scenes specified in Figma with "GPU" badge:

| Spec | Figma | Code |
|------|-------|------|
| Canvas size | Full viewport | `100vw × 100svh` |
| Poster fallback | Static frame export | `<img>` with `fetchpriority="high"` |
| Grain overlay | 4% opacity warm noise | `--gpu-grain-opacity: 0.04` |
| Ambient tint | Peacock 6% | `--gpu-ambient-peacock` |
| Safe zone | Content grid overlay | Text stays within 12-col grid |

Inspired by [cazala/webgpu-skill](https://github.com/cazala/webgpu-skill), [emergent.sh](https://emergent.sh).

---

## 11. Dev Handoff Workflow

```
1. Designer publishes Figma → Dev Mode link
2. Dev verifies tokens match DESIGN_SYSTEM.md
3. Dev inspects spacing (auto-layout → Tailwind gap/padding)
4. Dev exports assets to /public/media/ with naming convention:
   {section}-{name}-{breakpoint}.webp
5. Dev builds component in matching atomic folder
6. Design QA on Vercel preview
7. Sign-off checklist completed
```

### 11.1 Asset Naming Convention

```
public/media/
├── hero-agency-reel-poster.webp
├── product-kashmiri-box-01.webp
├── case-study-diorinspired-cover.webp
└── og-default.jpg
```

---

## 12. QA Checklist (Design ↔ Code)

- [ ] Typography matches within 1px at all breakpoints
- [ ] Colors use tokens (no hex in component code)
- [ ] Spacing aligns to 4px grid
- [ ] Hover/focus states implemented
- [ ] Images have correct aspect ratios (no CLS)
- [ ] Mobile frame matches 390px design intent
- [ ] Motion durations match Figma specs
- [ ] No glassmorphism unless explicitly specced (rare)
- [ ] Indian accent colors used as specced—never expanded

---

*Figma Handoff Guide v1.0 — V Design Luxury*
