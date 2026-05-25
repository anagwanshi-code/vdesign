# V Design Luxury — Content Guide

> Editorial voice, messaging architecture, and Sanity rich text parsing rules—premium international luxury with elegant modern Indian identity.

Cross-reference: `UI_RULES.md` (identity balance), `SEO_SYSTEM.md` (AEO/GEO), `COMPONENT_RULES.md` (Portable Text serializers).

---

## 1. Brand Voice Pillars

| Pillar | Expression | Avoid |
|--------|------------|-------|
| **Refined** | Precise vocabulary, short sentences, confident tone | Superlatives ("best ever"), exclamation marks |
| **Tactile** | Materiality language—texture, weight, finish, grain | Abstract buzzwords ("synergy", "disrupt") |
| **Rooted** | Modern Indian craft references— intentional, not decorative | Clichéd motifs ("incredible India", emoji flags) |
| **Global** | International luxury register (Dior, Aesop cadence) | Regional slang, overly casual tone |
| **Honest** | Specific claims with substance | Greenwashing, unverifiable awards |

### 1.1 Voice Comparison

```
❌ "We make AMAZING packaging that will BLOW YOUR MIND! 🇮🇳✨"
✅ "Hand-finished rigid boxes in saffron-dyed cotton paper—crafted in Jaipur, designed for global unboxing."

❌ "Leverage our synergistic brand solutions."
✅ "We design packaging systems that hold their silence on shelf and speak precisely when opened."

❌ "Traditional Indian designs with a modern twist!"
✅ "Peacock blue foil meets minimal sans-serif typography—a contemporary dialogue with heritage palette."
```

---

## 2. Identity Balance (Content Weight)

Content across the site must reflect the strategic mix defined in `UI_RULES.md`:

| Vertical | Weight | Content Focus |
|----------|--------|---------------|
| **Packaging** | 40% | Materials, process, sustainability, unboxing craft |
| **Ecommerce** | 25% | Product stories, care guides, collection narratives |
| **Creative Agency** | 20% | Case studies, methodology, client outcomes |
| **Indian Artistic Luxury** | 15% | Palette philosophy, artisan partnerships, cultural context |

Every Sanity document should tag its primary vertical for filtering and nav weighting.

---

## 3. Editorial Formats

### 3.1 Headlines (Cormorant Display)

- **Hero:** 4–8 words, emotional + specific
- **Section H2:** Question or statement format (AEO-friendly)
- **Product title:** Product name only; story lives in subtitle/body

```
Hero:        "Silence, Then Revelation"
H2:          "What Makes Rigid Box Packaging Feel Luxury?"
Product:     "The Malabar Candle Archive"
Subtitle:    "Coconut wax, brass lid, hand-poured in Kochi"
```

### 3.2 Body Copy (Satoshi/Inter)

- Paragraph length: 2–4 sentences max
- Line length: respects `max-w-prose` (42rem)
- Use em dashes sparingly—prefer commas or periods
- Numbers: spell out one–nine; numerals for 10+
- Currency: ₹ with Indian grouping (₹1,25,000)

### 3.3 Microcopy

| Context | Tone | Example |
|---------|------|---------|
| CTA primary | Direct, warm | "Explore Collection" |
| CTA secondary | Inviting | "View Packaging Process" |
| Cart empty | Helpful | "Your cart is empty—discover the collection." |
| Error | Calm, actionable | "This piece is currently unavailable. Join the waitlist." |
| Loading | Minimal | "Loading…" (no playful copy) |

---

## 4. Indian Luxury Messaging Guidelines

### 4.1 Do

- Reference specific regions, materials, and artisan techniques by name
- Use heritage palette names (Peacock Blue, Saffron Gold) as brand vocabulary
- Celebrate contemporary Indian design—not nostalgic pastiche
- Partner attribution: "In collaboration with [Artisan Name], [City]"

### 4.2 Don't

- Motif wallpaper language ("elephants", "mandala patterns" as default decoration)
- Spiritual/exotic framing ("mystical East", "ancient secrets")
- Over-explaining Indian culture to Indian audiences
- Tokenistic festival campaigns without product relevance

### 4.3 Cultural Accent Usage

Accent colors in copy map to meaning:

| Color | Copy Context |
|-------|--------------|
| Peacock Blue | Trust, precision, technology |
| Saffron Gold | Warmth, craft, celebration |
| Emerald | Sustainability, natural materials |
| Royal Magenta | Limited editions, bold statements |
| Floral Pink | Seasonal collections, editorial features |
| Luxury Purple | Agency services, creative partnerships |

---

## 5. Sanity CMS Content Architecture

### 5.1 Document Types

```
siteSettings       → Global voice, SEO defaults, social
page               → Flexible page builder
journalPost        → Long-form editorial
packagingProject   → Deep packaging case studies
caseStudy          → Agency portfolio entries
productStory       → Shopify product narrative overlay
author             → Byline, bio, portrait
```

### 5.2 Page Builder Block Types

```
heroBlock          → Full-bleed media + headline + CTA
richTextBlock      → Portable Text body
splitBlock         → 50/50 image + text
galleryBlock       → 2–4 column image grid
videoLoopBlock     → Higgsfield/Wondershare cinematic loop
productEmbedBlock  → Shopify product card embed
pullQuoteBlock     → Serif pull quote with attribution
factBlock          → GEO-optimized fact (see SEO_SYSTEM.md)
processBlock       → Numbered steps
ctaBlock           → Call to action band
spacerBlock        → Controlled vertical rhythm (token-based)
```

---

## 6. Portable Text Parsing Rules

### 6.1 Serializer Registry

All blocks render through typed components in `src/lib/sanity/schemas/portable-text.tsx`:

```typescript
import { PortableText, type PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-heading text-text-primary mt-12 mb-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-body-lg font-medium text-text-primary mt-8 mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-body text-text-muted leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-saffron pl-6 my-8 font-display text-body-lg italic text-text-primary">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href} className="text-peacock underline underline-offset-4 hover:opacity-80">
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-medium text-text-primary">{children}</strong>
    ),
  },
  types: {
    videoLoop: VideoLoopBlock,
    productEmbed: ProductEmbedBlock,
    pullQuote: PullQuoteBlock,
    factBlock: FactBlock,
    processBlock: ProcessBlock,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-body text-text-muted">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-body text-text-muted">{children}</ol>
    ),
  },
};
```

### 6.2 Deep Component Layout Rules

When rich text contains deep components (video, product embed, gallery), the **layout grid reacts** as follows:

| Block Type | Grid Behavior | Spacing |
|------------|---------------|---------|
| `richTextBlock` | Constrained to `max-w-prose`, centered | `py-8` |
| `splitBlock` | 12-col: 6+6 desktop, stack mobile | `py-16 md:py-24` |
| `videoLoopBlock` | Full-bleed breakout (`w-screen`) | `py-0` (edge-to-edge) |
| `galleryBlock` | 12-col grid, 3-col desktop | `py-12 gap-4` |
| `productEmbedBlock` | Inline within prose width OR full card break-out | `my-12` |
| `pullQuoteBlock` | Break out to `max-w-content`, center | `py-12` |
| `factBlock` | Inset card within prose column | `my-8 p-6 bg-surface border border-border` |
| `processBlock` | Full `max-w-content` width | `py-16` |
| `spacerBlock` | Token height only: `sm/md/lg/xl` → 32/64/96/128px | — |

### 6.3 Page Builder Renderer

```typescript
// src/components/organisms/PageBuilder.tsx
import type { PageBlock } from '@/types/sanity';

const blockComponents: Record<string, React.ComponentType<{ block: PageBlock }>> = {
  heroBlock: HeroBlock,
  richTextBlock: RichTextBlock,
  splitBlock: SplitBlock,
  videoLoopBlock: VideoLoopBlock,
  productEmbedBlock: ProductEmbedBlock,
  pullQuoteBlock: PullQuoteBlock,
  factBlock: FactBlock,
  processBlock: ProcessBlock,
  ctaBlock: CtaBlock,
  spacerBlock: SpacerBlock,
};

export function PageBuilder({ blocks }: { blocks: PageBlock[] }) {
  return (
    <article>
      {blocks.map((block) => {
        const Component = blockComponents[block._type];
        if (!Component) return null;
        return <Component key={block._key} block={block} />;
      })}
    </article>
  );
}
```

**Unknown block types:** Render `null` in production; log warning in development.

---

## 7. AI Asset Pipeline Content (Higgsfield / Wondershare)

Video and cinematic assets follow content metadata requirements:

```typescript
// Sanity videoLoopBlock schema fields
{
  title: string;           // Accessibility + SEO
  description: string;     // AEO direct answer context
  poster: image;             // Required LCP fallback
  videoWebm: file;
  videoMp4: file;
  duration: number;          // Seconds (max 12)
  autoplay: boolean;         // Default true, always muted
  overlayOpacity: number;    // 0–0.3 max
}
```

Alt text and descriptions are **required**—never publish video without textual equivalent.

---

## 8. SEO & GEO Content Requirements

Every published document must include:

| Field | Required | Purpose |
|-------|----------|---------|
| `title` | Yes | Page H1 + meta title |
| `seoDescription` | Yes | Meta + AEO extract (150–160 chars) |
| `seoDirectAnswer` | Recommended | 40–60 word factual paragraph |
| `primaryVertical` | Yes | packaging / shop / agency / identity |
| `publishedAt` | Yes | Freshness signal |
| `updatedAt` | Auto | GEO dateModified |

---

## 9. Content Review Checklist

- [ ] Voice matches brand pillars (refined, tactile, rooted, global, honest)
- [ ] No forbidden ethnic decoration language
- [ ] Headlines within word count guidelines
- [ ] CTAs use approved microcopy patterns
- [ ] All media has alt text / descriptions
- [ ] Deep components have layout spacing per grid rules
- [ ] SEO/AEO fields populated
- [ ] Vertical tag assigned (40/25/20/15 balance over site, not per page)
- [ ] Currency and measurements localized (INR, metric)
- [ ] Facts in `factBlock` are verifiable

---

*Content Guide v1.0 — V Design Luxury*
