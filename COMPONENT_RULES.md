# V Design Luxury — Component Rules

> Atomic, declarative, fully typed component architecture—every UI element is a governed building block, never an improvised AI artifact.

Cross-reference: `DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`, `UI_RULES.md`.

---

## 1. Atomic Design Hierarchy

```
atoms/       → Indivisible UI primitives (Button, Text, Icon, Badge)
molecules/   → Composed atoms (ProductCard, FormField, NavLink)
organisms/   → Functional sections (SiteHeader, HeroCinematic, ProductGrid)
templates/   → Page shells without data fetching
providers/   → Context boundaries (Shopify, Lenis, Motion)
webgpu/      → Client-only canvas hosts
```

**Rule:** Components may only import from their level or below. Organisms never import other organisms laterally—extract shared logic to `hooks/` or `lib/`.

---

## 2. Declarative-Only Mandate

Every component MUST be **purely declarative**:

```typescript
// ✅ CORRECT — props in, JSX out
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'accent';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ variant, size, children, disabled, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }))}
    >
      {children}
    </button>
  );
}
```

```typescript
// ❌ FORBIDDEN — imperative DOM manipulation inside components
export function BadButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current!.style.backgroundColor = 'red'; // NEVER
  }, []);
  return <button ref={ref}>Click</button>;
}
```

Imperative animation belongs in:
- `hooks/` (scroll progress, intersection)
- Dedicated motion wrapper components marked `'use client'`
- GSAP timelines initialized in `useLayoutEffect` with cleanup

---

## 3. TypeScript Standards

### 3.1 Strict Typing Requirements

- `strict: true` in `tsconfig.json`—no exceptions
- All props exported as named types: `export type ButtonProps = { ... }`
- No `any`; use `unknown` + type guards when necessary
- Discriminated unions for variants:

```typescript
type MediaProps =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string };
```

- Sanity/Shopify API responses typed in `src/types/`—never inline

### 3.2 Server vs Client Boundaries

| Component Type | Directive | Data Fetching |
|----------------|-----------|---------------|
| Static UI atom | None (server default) | None |
| Interactive molecule | `'use client'` | Props only |
| Page section (RSC) | None | Server component fetches |
| Cart, motion, WebGPU | `'use client'` | Hooks + context |

**Never** fetch Shopify/Sanity data inside `'use client'` components except via Server Actions or passed props.

---

## 4. Accessibility Requirements (Non-Negotiable)

Every interactive component must satisfy:

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigable | Native elements or `tabIndex={0}` + key handlers |
| Focus visible | `focus-visible:ring-2 ring-peacock ring-offset-2` |
| ARIA labels | Icon-only buttons: `aria-label` required |
| Live regions | Cart updates: `aria-live="polite"` |
| Motion | Respect `prefers-reduced-motion` via MotionConfig |
| Color contrast | 4.5:1 minimum (see DESIGN_SYSTEM) |
| Semantic HTML | `<nav>`, `<main>`, `<article>`, `<section>` with headings |

```typescript
// Accessible icon button pattern
<button type="button" aria-label="Add to cart" className="...">
  <ShoppingBag aria-hidden="true" className="h-5 w-5" />
</button>
```

---

## 5. Motion-Enabled Components

### 5.1 Motion Wrapper Pattern

Atoms stay static. Motion is applied via wrappers:

```
atoms/Button.tsx          → No animation
molecules/AnimatedCard.tsx → Framer motion wrapper
organisms/RevealSection.tsx → GSAP scroll trigger host
```

### 5.2 Required Motion Props

Motion-enabled components expose:

```typescript
type MotionEnabled = {
  /** Disable entrance animation */
  animate?: boolean;
  /** Override stagger delay (ms) */
  delay?: number;
};
```

Default `animate={true}`; set `animate={false}` when inside reduced-motion context.

---

## 6. Styling Rules

1. **Tailwind only** — no CSS modules, no styled-components
2. **Token references only** — `bg-surface text-text-primary`, never `bg-[#FFF7F2]`
3. **`cn()` utility** for conditional classes (`src/lib/utils/cn.ts`)
4. **CVA (class-variance-authority)** recommended for variant atoms:

```typescript
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans transition-colors duration-base ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peacock',
  {
    variants: {
      variant: {
        primary: 'bg-text-primary text-surface hover:bg-peacock',
        secondary: 'border border-border bg-transparent hover:border-peacock',
        accent: 'bg-magenta text-surface hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-4 text-caption',
        md: 'h-11 px-6 text-body',
        lg: 'h-13 px-8 text-body-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
```

5. **No inline styles** except dynamic values (scroll progress, WebGPU canvas dimensions)

---

## 7. Component File Structure

```
src/components/atoms/Button/
├── Button.tsx          # Component
├── Button.types.ts     # Props type (optional split)
└── index.ts            # Re-export
```

Each file exports one primary component. Co-locate tests as `Button.test.tsx` when added.

---

## 8. Forbidden: Loose AI-Generated UI

The following are **explicitly banned** from production:

| Violation | Why |
|-----------|-----|
| One-off components with hardcoded colors/spacing | Breaks token system |
| Copy-pasted shadcn/ui without token adaptation | Visual inconsistency |
| Generic "Card" with random shadow/blur | Not in design system |
| Inline SVG icons from unknown sources | Use `lucide-react` only |
| Components with 500+ lines mixing fetch + UI + animation | Split responsibilities |
| `div` soup without semantic structure | SEO + a11y failure |
| Placeholder lorem in committed components | Use realistic luxury copy or `[PLACEHOLDER]` type |
| Third-party chat widgets styled independently | Must match design tokens |
| Glassmorphism cards (`backdrop-blur-xl bg-white/10`) | See UI_RULES |
| Gradient buttons not in token palette | Accent colors only |

### 8.1 AI Component Review Gate

Before merging any AI-assisted component:

1. Does it use design tokens exclusively?
2. Is it typed with exported props?
3. Is it accessible (keyboard + screen reader)?
4. Does it respect server/client boundaries?
5. Is motion delegated to wrappers with reduced-motion support?
6. Does it match an existing atom/molecule pattern?

**If any answer is "no"—reject and refactor.**

---

## 9. Data Component Patterns

### 9.1 Server Component (Fetch + Pass)

```typescript
// src/app/(shop)/products/[handle]/page.tsx
import { ProductDetail } from '@/components/organisms/ProductDetail';
import { getProduct } from '@/lib/shopify/queries';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
```

### 9.2 Client Island (Interaction Only)

```typescript
'use client';

import { AddToCartButton } from '@/components/molecules/AddToCartButton';
import type { Product } from '@/types/shopify';

export function ProductActions({ variantId }: { variantId: string }) {
  return <AddToCartButton variantId={variantId} />;
}
```

---

## 10. Sanity Portable Text Components

Register typed serializers—never render unknown block types:

```typescript
// src/lib/sanity/schemas/portable-text.tsx
import { PortableText, type PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-heading text-text-primary">{children}</h2>
    ),
    normal: ({ children }) => (
      <p className="text-body text-text-muted leading-relaxed">{children}</p>
    ),
  },
  types: {
    videoLoop: VideoLoopBlock,      // molecule
    productEmbed: ProductEmbedBlock, // organism
    pullQuote: PullQuoteBlock,       // molecule
  },
};
```

Unknown types render `null` + dev warning—never crash.

---

## 11. WebGPU Component Rules

```typescript
// src/components/webgpu/WebGPUCanvas.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ShaderScene = dynamic(() => import('./ShaderScene'), { ssr: false });

export function WebGPUCanvas({ poster }: { poster: string }) {
  return (
    <Suspense fallback={<img src={poster} alt="" className="absolute inset-0 object-cover" />}>
      <ShaderScene poster={poster} />
    </Suspense>
  );
}
```

- Always SSR-disabled
- Always provide poster fallback
- Never block LCP element

---

## 12. Export & Import Conventions

```typescript
// Named exports only — no default exports in components/
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Import alias
import { Button } from '@/components/atoms/Button';
```

---

## 13. Checklist (PR Template)

- [ ] Component level correct (atom/molecule/organism)
- [ ] Props fully typed and exported
- [ ] Design tokens only (no raw hex/px outside scale)
- [ ] Accessible (focus, ARIA, semantic HTML)
- [ ] Server/client boundary correct
- [ ] Motion via wrapper with reduced-motion support
- [ ] No forbidden AI patterns
- [ ] Co-located in correct folder with index re-export

---

*Component Rules v1.0 — V Design Luxury*
