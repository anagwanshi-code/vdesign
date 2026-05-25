# V Design Luxury — Motion System

> Cinematic motion architecture for luxury digital experiences—GSAP ScrollTrigger for narrative scroll, Framer Motion for layout choreography, Lenis for inertial smoothness, and WebGPU-ready reveal states for hero assets.

Inspired by [higgsfield.ai](https://higgsfield.ai) cinematic transitions, [wondershare.net](https://www.wondershare.net) video pipelines, [draftly.space](https://draftly.space) spatial UI, and WebGPU rendering benchmarks ([cazala/webgpu-skill](https://github.com/cazala/webgpu-skill), [emergent.sh](https://emergent.sh)).

---

## 1. Motion Philosophy

Luxury motion is **felt, not noticed**. Every animation must:

1. Reinforce hierarchy (what enters first matters most)
2. Respect content weight (heavy assets arrive with opacity, not scale bounce)
3. Degrade gracefully under `prefers-reduced-motion`
4. Never block interaction beyond 400ms without explicit loading state

**Forbidden:** Bouncy spring defaults, parallax overload, infinite loops on critical UI, autoplay video without mute + poster.

---

## 2. Global Easing Matrix

All motion uses custom cubic-bezier curves—never CSS `ease` or `linear` for UI transitions.

### 2.1 Primary Easings

| Token | Cubic-Bezier | Character | Use Case |
|-------|--------------|-----------|----------|
| `--ease-luxury` | `cubic-bezier(0.76, 0, 0.24, 1)` | Cinematic deceleration | Page reveals, hero text, section entrances |
| `--ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Soft arrival | Modals, drawers, card hover lift |
| `--ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | Quick departure | Dismissals, route exit |
| `--ease-soft-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Subtle overshoot | Micro-interactions only (badges, toggles) |

### 2.2 Duration Scale

| Token | Value | Application |
|-------|-------|-------------|
| `--duration-instant` | `100ms` | Opacity toggles, focus rings |
| `--duration-fast` | `200ms` | Button states, link underlines |
| `--duration-base` | `400ms` | Standard UI transitions |
| `--duration-slow` | `700ms` | Section reveals, image masks |
| `--duration-cinematic` | `1200ms` | Hero sequences, pinned scroll scenes |
| `--duration-epic` | `1800ms` | Full-bleed video crossfades |

### 2.3 GSAP Custom Ease Registration

```typescript
// src/lib/motion/easings.ts
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const EASE = {
  luxury: CustomEase.create('luxury', 'M0,0 C0.24,0 0.76,1 1,1'),
  enter: CustomEase.create('enter', 'M0,0 C0.16,1 0.3,1 1,1'),
  exit: CustomEase.create('exit', 'M0,0 C0.7,0 0.84,0 1,1'),
} as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  cinematic: 1.2,
  epic: 1.8,
} as const;
```

---

## 3. Lenis Smooth Scrolling

### 3.1 Provider Configuration

```typescript
// src/components/providers/LenisProvider.tsx
'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import type { LenisOptions } from 'lenis';

const lenisOptions: LenisOptions = {
  lerp: 0.08,              // Lower = smoother, heavier feel (luxury default)
  duration: 1.4,           // Scroll-to anchor duration (seconds)
  smoothWheel: true,
  wheelMultiplier: 0.85,   // Reduce wheel sensitivity for weight
  touchMultiplier: 1.5,
  infinite: false,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  autoResize: true,
};

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
```

### 3.2 Lenis ↔ GSAP ScrollTrigger Integration

```typescript
// src/lib/motion/gsap-config.ts
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function bindLenisToScrollTrigger(lenis: { on: Function; raf: Function }) {
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}
```

Call once inside `LenisProvider` after Lenis instance mounts.

### 3.3 Scroll Parameters by Vertical

| Vertical | `lerp` | `wheelMultiplier` | Notes |
|----------|--------|-------------------|-------|
| Shop | `0.08` | `0.85` | Product grids need precise scroll stop |
| Agency | `0.06` | `0.75` | Heavier feel for cinematic case studies |
| Journal | `0.10` | `0.90` | Reading-first, lighter inertia |

---

## 4. GSAP ScrollTrigger Patterns

### 4.1 Global Rules

- **One pinned section per viewport** at a time
- Pin duration ≤ 150vh unless narrative justified
- Always set `anticipatePin: 1` to prevent layout jump
- Use `ScrollTrigger.batch()` for product/card grids (max 12 items per batch)
- Kill all ScrollTriggers on route change:

```typescript
// src/hooks/use-scroll-cleanup.ts
'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useScrollCleanup() {
  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
}
```

### 4.2 Hero Reveal Sequence

```typescript
const heroTl = gsap.timeline({
  defaults: { ease: EASE.luxury, duration: DURATION.cinematic },
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: false,
  },
});

heroTl
  .from('.hero__eyebrow', { y: 40, opacity: 0, duration: DURATION.slow })
  .from('.hero__title', { y: 60, opacity: 0 }, '-=0.6')
  .from('.hero__subtitle', { y: 30, opacity: 0 }, '-=0.4')
  .from('.hero__cta', { y: 20, opacity: 0 }, '-=0.3')
  .from('.hero__media', { scale: 1.04, opacity: 0 }, '-=0.8');
```

### 4.3 Parallax (Restrained)

```typescript
gsap.to('.parallax-bg', {
  yPercent: 15,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5, // Low scrub = subtle, luxury-safe
  },
});
```

**Max parallax displacement:** 15% Y. Never combine with Lenis lerp < 0.06 on mobile.

### 4.4 Horizontal Scroll (Agency Work Strip)

```typescript
const sections = gsap.utils.toArray<HTMLElement>('.work-panel');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.work-track',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => `+=${(sections.length - 1) * window.innerWidth}`,
  },
});
```

---

## 5. Framer Motion Layout Transitions

### 5.1 Global MotionConfig

```typescript
// src/components/providers/MotionProvider.tsx
'use client';

import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{
          duration: 0.4,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

### 5.2 Layout Animation Standards

| Pattern | Framer API | Easing |
|---------|-----------|--------|
| Route content swap | `AnimatePresence` + `mode="wait"` | `luxury` |
| Grid reflow (filters) | `layout` prop on items | `layout: { duration: 0.4, ease: [0.76,0,0.24,1] }` |
| Shared element | `layoutId` | Same duration as layout |
| Stagger children | `staggerChildren: 0.06` | Parent controls timing |

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
};
```

### 5.3 Page Transition Template

```typescript
// src/components/templates/PageTransition.tsx
'use client';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

---

## 6. Heavy Asset Loading & Reveal States

### 6.1 Loading State Matrix

| Asset Type | Strategy | Reveal |
|------------|----------|--------|
| Hero image | `priority` + blur placeholder (LQIP) | Opacity 0→1 over 700ms |
| Hero video (Higgsfield) | Poster first; `preload="metadata"` | Crossfade poster→video at `canplay` |
| Product gallery | Intersection Observer lazy load | Stagger fade-up per image |
| WebGPU canvas | Feature detect → idle load | Fade-in shader output over 1200ms |
| Font (Cormorant) | `next/font` swap | No animation on FOIT |

### 6.2 Media Reveal Component Contract

```typescript
type MediaRevealProps = {
  src: string;
  alt: string;
  priority?: boolean;
  revealDelay?: number; // ms, default 0
  revealDuration?: number; // ms, default 700
};
```

**CSS reveal pattern:**

```css
.media-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--duration-slow) var(--ease-luxury),
    transform var(--duration-slow) var(--ease-luxury);
}

.media-reveal[data-loaded='true'] {
  opacity: 1;
  transform: translateY(0);
}
```

### 6.3 Video Background Guidelines (Agency)

Inspired by Higgsfield AI + Wondershare cinematic exports:

- Max duration: **12s loop**, seamless edit point
- Resolution: 1920×1080 max; serve WebM (VP9) + MP4 (H.264) fallback
- Always include static poster (`fetchpriority="high"` on poster only)
- Overlay: `linear-gradient(to bottom, transparent 60%, hsl(var(--color-surface)) 100%)`
- Pause video when off-screen (`IntersectionObserver` threshold 0.1)
- Mute by default; never autoplay with audio

### 6.4 WebGPU Reveal Sequence

```
1. Render static poster (LCP candidate)
2. requestIdleCallback → load WGSL module
3. Initialize GPUDevice (with fallback check)
4. Fade canvas opacity 0 → 1 over 1200ms (ease-luxury)
5. Begin subtle ambient animation (grain, light shift)
```

If WebGPU unavailable: poster remains, no error UI shown to user.

---

## 7. Reduced Motion Policy

```typescript
// src/lib/motion/reduced-motion.ts
export function getMotionConfig(prefersReduced: boolean) {
  if (prefersReduced) {
    return {
      lenisEnabled: false,
      gsapScrub: false,
      durationMultiplier: 0,
      parallax: false,
    };
  }
  return {
    lenisEnabled: true,
    gsapScrub: true,
    durationMultiplier: 1,
    parallax: true,
  };
}
```

When `prefers-reduced-motion: reduce`:

- Disable Lenis (native scroll)
- Replace GSAP timelines with instant state
- Framer `MotionConfig reducedMotion="user"` handles automatically
- Keep opacity-only transitions at 0ms

---

## 8. Performance Budgets

| Metric | Target |
|--------|--------|
| Total animation JS (GSAP + Framer) | < 45KB gzip (LazyMotion + tree-shaken GSAP) |
| ScrollTrigger instances per page | ≤ 8 |
| Concurrent video elements | ≤ 1 playing |
| WebGPU canvases | ≤ 1 active |
| Main thread long tasks during scroll | 0 tasks > 50ms |

---

## 9. Debugging Checklist

- [ ] ScrollTrigger markers off in production
- [ ] All timelines killed on unmount
- [ ] Lenis raf synced with GSAP ticker
- [ ] No `will-change: transform` left permanently on elements
- [ ] Mobile: test with `lerp: 0.10` fallback if jank detected
- [ ] Lighthouse: CLS unchanged after hero animation

---

*Motion System v1.0 — V Design Luxury*
