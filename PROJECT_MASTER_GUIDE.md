# V Design Luxury — Project Master Guide

> Enterprise architecture blueprint for a premium Next.js 15 App Router monolith with dual verticals: **Packaging & Ecommerce (Shop)** and **Creative Agency**, unified under a single luxury design language with modern Indian artistic identity.

---

## 1. Design Philosophy & North Star

This project synthesizes restraint-first luxury (Apple, Dior, Aesop) with contemporary Indian craft sensibility—never ornamental clutter, always editorial precision. Production standards draw from cinematic WebGPU rendering benchmarks ([cazala/webgpu-skill](https://github.com/cazala/webgpu-skill), [emergent.sh](https://emergent.sh), [tasteskill.dev](https://tasteskill.dev)), immersive UI spatial systems ([draftly.space](https://draftly.space), [impeccable.style](https://impeccable.style), [21st.dev](https://21st.dev), [ui-skills.com](https://ui-skills.com)), and AI-native asset pipelines ([higgsfield.ai](https://higgsfield.ai), [wondershare.net](https://www.wondershare.net)).

**Core principle:** Every route, component, and data boundary must feel intentional—no template residue, no generic AI UI.

---

## 2. Technology Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | Next.js 15 (App Router, `src/` layout) | SSR, RSC, ISR, Route Handlers |
| Language | TypeScript 5 (strict) | End-to-end type safety |
| Styling | Tailwind CSS 4 + CSS custom properties | Token-driven design system |
| CMS | Sanity v3 + `@sanity/client`, `next-sanity` | Editorial, agency, marketing content |
| Commerce | Shopify Storefront API + `@shopify/hydrogen-react` | Headless product catalog & checkout |
| Motion | GSAP + ScrollTrigger, Framer Motion, Lenis | Cinematic scroll & layout transitions |
| Rendering (future) | WebGPU compute shaders | Hero scenes, product configurators, ambient backgrounds |

---

## 3. Enterprise Folder Structure (`src/` Layout)

```
v-design-luxury/
├── public/
│   ├── fonts/                    # Self-hosted Satoshi (if licensed)
│   ├── media/                    # Static fallbacks, OG images
│   └── webgpu/                   # WASM/shader assets (lazy-loaded)
├── src/
│   ├── app/
│   │   ├── (shop)/               # Route group — Ecommerce vertical
│   │   │   ├── layout.tsx        # Shop shell: cart provider, nav, footer
│   │   │   ├── page.tsx          # Shop home / featured collections
│   │   │   ├── collections/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx
│   │   │   ├── products/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   └── packaging/        # Packaging showcase (40% identity weight)
│   │   │       ├── page.tsx
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (agency)/             # Route group — Creative agency vertical
│   │   │   ├── layout.tsx        # Agency shell: case-study nav, reel CTA
│   │   │   ├── page.tsx          # Agency home
│   │   │   ├── work/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (marketing)/          # Shared marketing pages
│   │   │   ├── journal/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── legal/
│   │   │       ├── privacy/
│   │   │       └── terms/
│   │   │
│   │   ├── api/
│   │   │   ├── revalidate/
│   │   │   │   └── route.ts      # Sanity webhook → on-demand ISR
│   │   │   ├── shopify/
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts  # Inventory/price sync (optional)
│   │   │   └── draft/
│   │   │       └── route.ts      # Sanity draft mode enable
│   │   │
│   │   ├── layout.tsx            # Root layout: fonts, providers, JSON-LD shell
│   │   ├── globals.css           # Design tokens, base resets
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │   ├── atoms/                # Buttons, badges, icons, typography primitives
│   │   ├── molecules/            # Cards, form fields, media frames
│   │   ├── organisms/            # Nav, hero, product grid, case-study header
│   │   ├── templates/            # Page-level layouts (no business logic)
│   │   ├── providers/            # Lenis, Shopify, Sanity, Motion
│   │   └── webgpu/               # Canvas hosts, shader loaders (client-only)
│   │
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts         # Read client (CDN)
│   │   │   ├── write-client.ts   # Preview/draft only (server)
│   │   │   ├── queries/          # GROQ query modules
│   │   │   ├── schemas/          # Portable Text serializers
│   │   │   └── image.ts          # `@sanity/image-url` builder
│   │   ├── shopify/
│   │   │   ├── storefront.ts     # GraphQL client init
│   │   │   ├── queries/          # Storefront API operations
│   │   │   ├── fragments/        # Reusable GraphQL fragments
│   │   │   └── cart.ts           # Cart ID persistence helpers
│   │   ├── motion/
│   │   │   ├── gsap-config.ts
│   │   │   ├── easings.ts
│   │   │   └── reduced-motion.ts
│   │   ├── seo/
│   │   │   ├── metadata.ts
│   │   │   └── json-ld/
│   │   └── utils/
│   │       ├── cn.ts             # clsx + tailwind-merge
│   │       └── env.ts            # Validated environment variables
│   │
│   ├── hooks/
│   │   ├── use-lenis.ts
│   │   ├── use-scroll-progress.ts
│   │   └── use-prefers-reduced-motion.ts
│   │
│   ├── types/
│   │   ├── sanity.ts
│   │   ├── shopify.ts
│   │   └── global.d.ts
│   │
│   └── config/
│       ├── site.ts               # Site name, URLs, social
│       ├── navigation.ts
│       └── revalidate-tags.ts
│
├── sanity/                       # Sanity Studio (optional co-located)
│   ├── schemaTypes/
│   └── sanity.config.ts
│
├── .env.local                    # Never committed
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## 4. Route Group Architecture

### `(shop)` — Ecommerce & Packaging (65% surface area)

- **Purpose:** Product discovery, packaging portfolio, cart, checkout handoff.
- **Layout concerns:** `ShopifyProvider`, cart drawer, collection breadcrumbs, product schema injection.
- **Data sources:** Shopify Storefront API (products, collections, cart); Sanity (packaging case studies, editorial blocks).
- **Caching:** `revalidate: 3600` default; tag-based invalidation via `shopify-product-{handle}`.

### `(agency)` — Creative Agency (20% surface area)

- **Purpose:** Case studies, services, team, contact.
- **Layout concerns:** Cinematic scroll sections, video reel backgrounds (Higgsfield/Wondershare pipeline), GSAP pin scenes.
- **Data sources:** Sanity exclusively (work, services, testimonials).
- **Caching:** `revalidate: 86400`; webhook invalidates `agency-{slug}` tags.

### Shared Root `layout.tsx`

- Font loading (Cormorant Garamond + Satoshi/Inter)
- `LenisProvider`, `MotionConfig` (Framer), optional `WebGPUProvider`
- Global JSON-LD `Organization` + `WebSite`
- Analytics boundary (server-safe)

---

## 5. Sanity CMS Integration Architecture

### 5.1 Client Matrix

| Client | Environment | Use Case |
|--------|-------------|----------|
| `sanityClient` | `SANITY_API_READ_TOKEN` (optional) + CDN | Public RSC fetches |
| `previewClient` | `SANITY_API_READ_TOKEN` + `perspective: 'previewDrafts'` | Draft mode |
| `writeClient` | `SANITY_API_WRITE_TOKEN` | Webhook verification scripts only |

### 5.2 Content Types (Schema Overview)

```
siteSettings      → Global SEO, nav, footer
page              → Flexible page builder (marketing)
journalPost       → Blog / editorial
packagingProject  → Shop vertical deep pages
caseStudy         → Agency work entries
productStory      → Sanity-enriched Shopify product narratives
```

### 5.3 Webhook → On-Demand Revalidation Flow

```
Sanity Studio (publish)
        │
        ▼
POST /api/revalidate
  Headers: Authorization: Bearer {SANITY_REVALIDATE_SECRET}
  Body: { _type, slug, _id }
        │
        ▼
Route Handler validates signature + maps _type → revalidateTag()
        │
        ├── revalidateTag('sanity:page:{slug}')
        ├── revalidateTag('sanity:journal:{slug}')
        ├── revalidateTag('sanity:case-study:{slug}')
        └── revalidatePath('/') if siteSettings changed
        │
        ▼
Next.js ISR cache purge → next request serves fresh RSC payload
```

**Implementation contract (`src/app/api/revalidate/route.ts`):**

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

const TYPE_TAG_MAP: Record<string, (slug: string) => string> = {
  page: (s) => `sanity:page:${s}`,
  journalPost: (s) => `sanity:journal:${s}`,
  caseStudy: (s) => `sanity:case-study:${s}`,
  packagingProject: (s) => `sanity:packaging:${s}`,
};

export async function POST(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.slug?.current ?? body.slug;
  const tagFn = TYPE_TAG_MAP[body._type];

  if (tagFn && slug) revalidateTag(tagFn(slug));
  if (body._type === 'siteSettings') revalidatePath('/', 'layout');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

### 5.4 Portable Text → React

All rich text flows through typed serializers in `src/lib/sanity/schemas/`. Deep components (pull quotes, video loops, product embeds) are registered explicitly—never raw HTML injection.

---

## 6. Shopify Storefront API Integration Architecture

### 6.1 Decoupled Headless Model

```
┌─────────────────┐     GraphQL      ┌──────────────────────┐
│  Next.js RSC    │ ◄──────────────► │ Shopify Storefront   │
│  (shop routes)  │   Server-side    │ API (2024-10+)       │
└────────┬────────┘                  └──────────────────────┘
         │
         │  Checkout URL handoff (client)
         ▼
┌─────────────────┐
│ Shopify Hosted  │
│ Checkout        │
└─────────────────┘
```

- **Catalog & cart:** Storefront API via server components + `@shopify/hydrogen-react` on client islands.
- **Checkout:** Always redirect to Shopify-hosted checkout URL—never embed payment UI.
- **Inventory:** Trust Shopify as source of truth; optional webhook for cache bust.

### 6.2 Data-Fetching Policy

| Operation | Where | Cache Strategy |
|-----------|-------|----------------|
| Product list | RSC `page.tsx` | `fetch(..., { next: { tags: ['shopify:collection:{handle}'] } })` |
| Product detail | RSC | Tag: `shopify:product:{handle}`, revalidate 3600 |
| Cart mutations | Client (`useCart`) | No cache; optimistic UI |
| Menu/navigation | RSC layout | Tag: `shopify:menu:main`, revalidate 86400 |

See `SHOPIFY_SETUP.md` for client initialization matrices and checkout security.

---

## 7. WebGPU & Cinematic Rendering Layer

Reserved for hero experiences and product configurators—not sitewide overhead.

```
src/components/webgpu/
├── WebGPUCanvas.tsx       # Suspense boundary + feature detect
├── shaders/
│   ├── ambient-grain.wgsl
│   └── product-spin.wgsl
└── hooks/
    └── use-webgpu-support.ts
```

**Loading policy:**

1. Feature-detect via `navigator.gpu` (client-only).
2. Lazy import shader modules after LCP (`requestIdleCallback`).
3. Provide static poster image + CSS fallback for unsupported devices.
4. Cap GPU memory: max 1 active canvas per viewport.

Inspired by WebGPU skill patterns and emergent cinematic benchmarks— shaders enhance, never block content.

---

## 8. Environment Variables

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_STOREFRONT_API_VERSION=2024-10

# Site
NEXT_PUBLIC_SITE_URL=https://vdesignluxury.com
```

Validate in `src/lib/utils/env.ts` at build time using Zod.

---

## 9. Deployment & CI

- **Host:** Vercel (recommended) with Edge-compatible Route Handlers.
- **Preview:** Sanity draft mode + Vercel preview URLs.
- **Build gates:** `tsc --noEmit`, ESLint, Lighthouse CI (LCP < 2.5s, CLS < 0.05).
- **Asset pipeline:** Higgsfield AI exports → Sanity media library → CDN; video backgrounds use `poster` + `preload="metadata"`.

---

## 10. Cross-Reference Index

| Document | Scope |
|----------|-------|
| `DESIGN_SYSTEM.md` | Tokens, typography, Tailwind config |
| `MOTION_SYSTEM.md` | GSAP, Framer, Lenis parameters |
| `COMPONENT_RULES.md` | Atomic component standards |
| `SEO_SYSTEM.md` | SEO / AEO / GEO architecture |
| `SHOPIFY_SETUP.md` | Storefront API deep dive |
| `FIGMA_GUIDE.md` | Design-to-code handoff |
| `CONTENT_GUIDE.md` | Editorial voice + Sanity parsers |
| `UI_RULES.md` | Layout restrictions & identity balance |

---

*V Design Luxury — Production architecture v1.0*
