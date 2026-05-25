# V Design Luxury — UI Rules

> Comprehensive luxury layout standards, structural restrictions, and identity balance strategy—governing every pixel of the V Design Luxury experience.

Cross-reference: `DESIGN_SYSTEM.md`, `COMPONENT_RULES.md`, `MOTION_SYSTEM.md`, `CONTENT_GUIDE.md`.

---

## 1. Identity Balance Strategy

The V Design Luxury brand is a **deliberate composition**—not a single vertical. Every page, section, and navigation moment must respect this weight distribution:

```
┌────────────────────────────────────────────────────────────┐
│                    V DESIGN LUXURY IDENTITY                 │
├──────────────────┬─────────────────────────────────────────┤
│  Packaging   40% │  Primary hero vertical—material craft,  │
│                  │  unboxing, structural design excellence  │
├──────────────────┼─────────────────────────────────────────┤
│  Ecommerce   25% │  Product commerce, collections, cart    │
├──────────────────┼─────────────────────────────────────────┤
│  Agency      20% │  Case studies, services, creative reel   │
├──────────────────┼─────────────────────────────────────────┤
│  Indian      15% │  Palette philosophy, artisan context,    │
│  Artistic        │  contemporary cultural luxury—not décor  │
│  Luxury          │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

### 1.1 Application Rules

- **Homepage:** Lead with packaging (40%), surface ecommerce collection (25%), agency reel strip (20%), Indian identity in palette/typography accents (15%)
- **Shop routes:** Ecommerce primary; packaging stories as product enrichment
- **Agency routes:** Case studies primary; packaging craft as proof of capability
- **Never:** Single-vertical pages that ignore the balance (e.g., generic agency template with no packaging/ecommerce presence)

---

## 2. Luxury Layout Principles

Inspired by [draftly.space](https://draftly.space), [impeccable.style](https://impeccable.style), [21st.dev](https://21st.dev), [ui-skills.com](https://ui-skills.com), and cinematic systems ([higgsfield.ai](https://higgsfield.ai), [emergent.sh](https://emergent.sh)).

### 2.1 Spatial Hierarchy

| Level | Treatment |
|-------|-----------|
| **Hero** | Full viewport (`100svh`), single focal point, max 2 text elements + 1 CTA |
| **Section** | Clear vertical rhythm: 80px mobile / 128px desktop padding |
| **Content** | Constrained to `max-w-content` (1152px) unless full-bleed media |
| **Prose** | `max-w-prose` (672px) for reading content |
| **Micro** | 8px minimum gap between related elements |

### 2.2 Whitespace Doctrine

- Whitespace is **active design**—never fill space because it's empty
- Minimum 40% of any desktop viewport should be negative space
- Hero sections: content occupies ≤ 50% of viewport width
- Product grids: generous gap (24px+) between cards

### 2.3 Grid Discipline

- 12-column grid on desktop, 8 on tablet, 4 on mobile
- Content never spans all 12 columns for text—max 8 columns for body, 6 for prose
- Asymmetric layouts preferred: 7+5, 8+4 splits over symmetric 6+6
- See `FIGMA_GUIDE.md` for exact specifications

---

## 3. Explicitly Outlawed Patterns

### 3.1 Clunky Startup Templates

**BANNED:**

- Generic SaaS hero with floating UI mockup + gradient blob
- "Trusted by" logo bar with grayscale startup logos
- Three-column feature grid with circle icons
- Pricing table comparison layouts (not applicable)
- Testimonial carousel with stock headshots
- "Get Started Free" / "Sign Up" startup CTAs
- Dashboard screenshot heroes
- Chat bubble widgets with default styling

### 3.2 Overdone Glassmorphism

**BANNED:**

- `backdrop-blur-xl` + `bg-white/10` card stacks
- Frosted glass navigation over busy backgrounds
- Multi-layer glass panels with border glow
- Glassmorphism as primary surface treatment

**Rare exception:** Single subtle blur on navigation scroll state (`backdrop-blur-sm bg-surface/90`)—requires design sign-off.

### 3.3 Messy Spacing

**BANNED:**

- Arbitrary pixel values outside 4px scale (23px, 37px, 55px)
- Inconsistent section padding (one section 60px, next 100px)
- Text touching viewport edges on mobile (< 20px margin)
- Orphan headings (H2 at bottom of section with no following content)
- More than 3 levels of nested padding

### 3.4 Excessive Traditional Ethnic Decoration

**BANNED:**

- Mandala/paisley background patterns
- Decorative border frames with "Indian" motifs
- Elephant, lotus, or om symbols as default branding
- Saffron-green-white tricolor layouts
- "Ethnic" font choices (script Devanagari as decoration on English pages)
- Festival-themed UI chrome unrelated to content
- Henna-pattern overlays on UI elements
- Taj Mahal / monument stock photography as hero backgrounds

**PERMITTED (15% identity weight):**

- Heritage palette used as precise color accents
- Named artisan/regional references in copy
- Contemporary Indian photography (products, materials, studios)
- Subtle grain/texture suggesting handmade paper or fabric

### 3.5 Additional Banned UI Patterns

| Pattern | Reason |
|---------|--------|
| Neon gradients / mesh backgrounds | Breaks luxury restraint |
| Bounce/spring animations on layout | See MOTION_SYSTEM |
| Autoplay audio/video with sound | User hostility |
| Infinite scroll without pagination option | Performance + a11y |
| Hamburger menu on desktop | Navigation should be visible |
| Sticky elements stacking (nav + banner + cookie) | Viewport theft |
| Pop-ups / interstitials on first visit | Luxury never interrupts |
| Stock "luxury" photography (gold bars, diamonds) | Inauthentic |
| Comic Sans, Papyrus, or decorative script fonts | Brand violation |
| More than 2 font families per page | Typography discipline |
| Pure black `#000` or pure white `#FFF` backgrounds | Token violation |
| Drop shadows on text | Legibility + taste |
| Rounded-full pill buttons for primary CTAs | Use `radius-md` max |

---

## 4. Approved Layout Patterns

### 4.1 Homepage Architecture

```
┌─────────────────────────────────────────────┐
│  Navigation (minimal, transparent → solid)  │
├─────────────────────────────────────────────┤
│  HERO: Packaging showcase (40%)           │
│  Full-bleed media + serif headline          │
├─────────────────────────────────────────────┤
│  FEATURED COLLECTION (25%)                  │
│  3–4 product cards, horizontal scroll mob.  │
├─────────────────────────────────────────────┤
│  AGENCY REEL STRIP (20%)                    │
│  Cinematic video + case study link          │
├─────────────────────────────────────────────┤
│  CRAFT / IDENTITY (15%)                     │
│  Split: palette story + artisan quote       │
├─────────────────────────────────────────────┤
│  JOURNAL TEASER                             │
├─────────────────────────────────────────────┤
│  FOOTER (minimal, editorial)                │
└─────────────────────────────────────────────┘
```

### 4.2 Product Page

```
Breadcrumb → Product name (serif) → Price
Split layout: Gallery (60%) | Details + Add to Cart (40%)
───
Product story (Sanity prose)
───
Materials & care (AEO structured)
───
Related products (3-col grid)
```

### 4.3 Agency Case Study

```
Full-bleed hero video/image (pinned scroll optional)
Title + client + year
───
Challenge / Approach / Outcome (structured)
───
Image gallery (asymmetric grid)
───
Next case study link
```

### 4.4 Packaging Project

```
Hero: unboxing sequence or structural diagram
Material specifications (fact blocks)
Process steps (processBlock)
Artisan attribution
CTA to shop related products
```

---

## 5. Navigation Architecture

### 5.1 Primary Navigation

| Item | Destination | Weight |
|------|-------------|--------|
| Packaging | `/packaging` | High |
| Shop | `/collections` | High |
| Work | `/work` | Medium |
| Journal | `/journal` | Low |
| About | `/about` | Low |

- Max 5 items in primary nav
- No dropdown mega-menus—use page-level discovery
- Cart icon only in `(shop)` layout
- Mobile: full-screen overlay menu with large serif links

### 5.2 Footer

- Single row: Logo + 3 link columns + social
- No newsletter pop-up in footer—inline form only if needed
- Legal links: Privacy, Terms
- Copyright with current year

---

## 6. Component-Level UI Rules

### 6.1 Buttons

- Primary: solid `text-primary` bg, `surface` text
- One primary CTA per viewport section
- Min height: 44px (touch target)
- No gradient buttons

### 6.2 Cards

- Border: `border-border`, not shadow-first
- Shadow: `shadow-soft` on hover only
- Radius: `radius-md` (8px)—never pill-shaped product cards
- Image aspect: 4:5 (product) or 16:9 (editorial)

### 6.3 Forms

- Minimal fields—only what's necessary
- Labels above inputs, never placeholder-only
- Border inputs on `surface`, focus ring `peacock`
- No rounded-full inputs

### 6.4 Images

- Always `next/image` with explicit dimensions
- Art direction via `object-cover` + `object-position`
- No image carousels with dot navigation on hero—use scroll or static grid

---

## 7. Cinematic & WebGPU UI Integration

For hero experiences using WebGPU or cinematic video ([cazala/webgpu-skill](https://github.com/cazala/webgpu-skill), [higgsfield.ai](https://higgsfield.ai)):

| Rule | Specification |
|------|---------------|
| Text over media | Always include gradient scrim for legibility |
| GPU canvas | Max 1 per page, never behind interactive UI |
| Video backgrounds | Poster required; pause off-screen |
| Loading | Static first, animate second (see MOTION_SYSTEM) |
| Fallback | Every GPU/video hero has identical static layout |

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<768) | Single column, stack all splits, horizontal scroll for product strips |
| Tablet (768–1023) | 8-col grid, partial splits (8+4 becomes stack) |
| Desktop (≥1024) | Full 12-col asymmetric layouts |
| Wide (≥1536) | Content capped at `max-w-content`, margins grow |

**Never:** Hide critical content on mobile—reflow, don't remove.

---

## 9. Dark Mode Policy

**Not supported at launch.** Single warm surface palette (`#FFF7F2`). Do not implement `prefers-color-scheme: dark` overrides unless design system v2 explicitly adds dark tokens.

---

## 10. Page-Level QA Checklist

- [ ] Identity balance respected for page type
- [ ] No outlawed patterns present
- [ ] Whitespace ≥ 40% on desktop hero
- [ ] Single primary CTA per section
- [ ] Grid alignment verified against FIGMA_GUIDE
- [ ] Indian identity via palette/copy—not decoration
- [ ] Motion respects reduced-motion policy
- [ ] No glassmorphism stacks
- [ ] Spacing on 4px token scale only
- [ ] Typography uses Cormorant + Satoshi/Inter only

---

*UI Rules v1.0 — V Design Luxury*
