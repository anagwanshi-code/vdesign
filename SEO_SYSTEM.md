# V Design Luxury — SEO, AEO & GEO System

> Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) architecture for luxury ecommerce and agency discovery—optimized for Google, Bing, ChatGPT, Claude, Perplexity, and Gemini.

---

## 1. Three-Layer Optimization Model

```
┌─────────────────────────────────────────────────────────┐
│  GEO — Generative Engine Optimization                   │
│  Structured facts, entity clarity, citation-worthy prose  │
├─────────────────────────────────────────────────────────┤
│  AEO — Answer Engine Optimization                       │
│  FAQ schemas, direct answers, conversational headings     │
├─────────────────────────────────────────────────────────┤
│  SEO — Search Engine Optimization                       │
│  Metadata, sitemaps, Core Web Vitals, canonical URLs    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Technical SEO Architecture

### 2.1 Metadata Factory (`src/lib/seo/metadata.ts`)

```typescript
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'product';
};

export function buildMetadata(input: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${input.path}`;
  const title = input.title.includes(siteConfig.name)
    ? input.title
    : `${input.title} | ${siteConfig.name}`;

  return {
    title,
    description: input.description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: input.description,
      url,
      siteName: siteConfig.name,
      type: input.type ?? 'website',
      locale: 'en_IN',
      images: [{ url: input.image ?? siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: input.description,
      images: [input.image ?? siteConfig.ogImage],
    },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
```

### 2.2 Route Metadata Matrix

| Route | `generateMetadata` Source | Priority |
|-------|--------------------------|----------|
| `/` | `siteSettings` (Sanity) | 1.0 |
| `(shop)/products/[handle]` | Shopify + Sanity overlay | 0.9 |
| `(shop)/collections/[handle]` | Shopify | 0.8 |
| `(agency)/work/[slug]` | Sanity case study | 0.8 |
| `(marketing)/journal/[slug]` | Sanity journal | 0.7 |
| Legal pages | Static | 0.3 |

### 2.3 Sitemap (`src/app/sitemap.ts`)

```typescript
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllProductHandles } from '@/lib/shopify/queries';
import { getAllSlugs } from '@/lib/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, journal, caseStudies] = await Promise.all([
    getAllProductHandles(),
    getAllSlugs('journalPost'),
    getAllSlugs('caseStudy'),
  ]);

  const staticRoutes = ['/', '/about', '/contact', '/services'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.8,
  }));

  const productRoutes = products.map((handle) => ({
    url: `${siteConfig.url}/products/${handle}`,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes /* + journal + case studies */];
}
```

### 2.4 `robots.ts`

```typescript
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/cart'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

---

## 3. JSON-LD Schema Architecture

All schemas injected via server components in `src/lib/seo/json-ld/`. Use `<script type="application/ld+json">` with `dangerouslySetInnerHTML` from serialized JSON—never client-side injection.

### 3.1 Organization (Global — Root Layout)

```typescript
// src/lib/seo/json-ld/organization.ts
import { siteConfig } from '@/config/site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.svg`,
      width: 512,
      height: 512,
    },
    description:
      'Premium packaging design, luxury ecommerce, and creative agency services rooted in modern Indian artistic excellence.',
    foundingDate: '2020',
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
      siteConfig.social.pinterest,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: siteConfig.email,
      availableLanguage: ['English', 'Hindi'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    knowsAbout: [
      'Luxury packaging design',
      'Premium ecommerce',
      'Creative agency services',
      'Brand identity',
      'Indian luxury aesthetics',
    ],
  };
}
```

### 3.2 LocalBusiness (Contact / About)

```typescript
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/og-image.jpg`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: '₹₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.postalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.address.lat,
      longitude: siteConfig.address.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'V Design Luxury Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Luxury Packaging Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Creative Agency Services' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Premium Ecommerce Products' } },
      ],
    },
  };
}
```

### 3.3 Product (Shop Pages)

```typescript
import type { ShopifyProduct } from '@/types/shopify';
import { siteConfig } from '@/config/site';

export function productSchema(product: ShopifyProduct) {
  const variant = product.variants.edges[0]?.node;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteConfig.url}/products/${product.handle}/#product`,
    name: product.title,
    description: product.description,
    image: product.images.edges.map((e) => e.node.url),
    sku: variant?.sku ?? product.handle,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/products/${product.handle}`,
      priceCurrency: variant?.price.currencyCode ?? 'INR',
      price: variant?.price.amount,
      availability: variant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@id': `${siteConfig.url}/#organization` },
    },
    ...(product.metafields?.material && {
      material: product.metafields.material,
    }),
  };
}
```

### 3.4 Additional Schemas

| Page Type | Schema | File |
|-----------|--------|------|
| Journal article | `Article` + `BreadcrumbList` | `article.ts` |
| Case study | `CreativeWork` | `creative-work.ts` |
| FAQ sections | `FAQPage` | `faq.ts` |
| Product listing | `ItemList` | `item-list.ts` |
| Breadcrumbs (all) | `BreadcrumbList` | `breadcrumb.ts` |

### 3.5 JSON-LD Renderer

```typescript
// src/components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

---

## 4. AEO — Answer Engine Optimization

### 4.1 Content Structure for LLM Extraction

Every key page must include:

1. **Direct answer paragraph** (40–60 words) immediately after H1
2. **Structured H2 questions** matching natural language queries
3. **FAQ block** with `FAQPage` schema where applicable
4. **Entity-first sentences**: *"V Design Luxury is a [entity type] that [primary function]..."*

### 4.2 AEO Heading Templates

| Page | H2 Examples |
|------|-------------|
| Packaging | "What is luxury packaging design?" / "How does V Design approach sustainable packaging?" |
| Product | "What materials is [Product] made from?" / "How should I care for [Product]?" |
| Agency | "What services does V Design Luxury offer?" / "How does the creative process work?" |

### 4.3 FAQ Schema Example

```typescript
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
```

---

## 5. GEO — Generative Engine Optimization

### 5.1 Principles for LLM Citation

Generative engines (ChatGPT, Claude, Perplexity, Gemini) favor:

| Signal | Implementation |
|--------|----------------|
| **Entity clarity** | Consistent brand name, `@id` in JSON-LD, `sameAs` links |
| **Factual density** | Specific materials, dimensions, dates—not vague marketing |
| **Structured data overlap** | JSON-LD matches visible page content exactly |
| **Authoritative tone** | Third-person factual statements in meta descriptions |
| **Freshness signals** | `dateModified` in Article schema, visible "Last updated" |
| **Citation blocks** | Pull quotes with attribution in journal/case studies |

### 5.2 Semantic HTML for LLM Parsing

```html
<article itemScope itemType="https://schema.org/Article">
  <header>
    <h1 itemProp="headline">Title</h1>
    <time itemProp="datePublished" dateTime="2025-03-15">March 15, 2025</time>
  </header>
  <div itemProp="articleBody">
    <!-- Portable Text content -->
  </div>
  <footer>
    <span itemProp="author" itemScope itemType="https://schema.org/Person">
      <span itemProp="name">Author Name</span>
    </span>
  </footer>
</article>
```

### 5.3 LLM-Optimized Content Blocks (Sanity)

Define block types in Sanity for GEO:

```
factBlock        → { claim: string, source?: string, date: date }
definitionBlock  → { term: string, definition: string }
comparisonBlock  → { items: [{ name, pros[], cons[] }] }
processBlock     → { steps: [{ title, description, duration? }] }
```

Render as visually clean, semantically rich HTML—not hidden text.

### 5.4 robots.txt for AI Crawlers

```
User-agent: GPTBot
Allow: /
Allow: /journal/
Allow: /products/
Disallow: /api/
Disallow: /cart

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /
```

Configure in `src/app/robots.ts` when Next.js supports per-bot rules, or via `public/robots.txt`.

---

## 6. Performance SEO (Core Web Vitals)

| Metric | Target | Implementation |
|--------|--------|----------------|
| LCP | < 2.5s | Priority hero image, `next/image` sizes |
| INP | < 200ms | Minimal client JS on product pages |
| CLS | < 0.05 | Explicit image dimensions, no layout-shifting fonts |
| TTFB | < 600ms | RSC caching, CDN, edge revalidation |

---

## 7. International & Local Signals

- `lang="en"` on `<html>`; Hindi content pages use `lang="hi"` if localized
- `hreflang` tags when multi-language launches
- `locale: 'en_IN'` in OpenGraph
- INR pricing in Product schema
- Indian address in LocalBusiness schema

---

## 8. Monitoring & Validation

- Google Search Console + Bing Webmaster Tools
- Rich Results Test for JSON-LD validation
- Schema.org validator for new types
- Monthly audit: canonical conflicts, orphan pages, duplicate titles
- Track AI referral traffic via UTM patterns (`?utm_source=perplexity`)

---

## 9. Page-Level SEO Checklist

- [ ] Unique `<title>` and meta description (150–160 chars)
- [ ] Canonical URL set
- [ ] OpenGraph + Twitter cards
- [ ] Appropriate JSON-LD schema(s)
- [ ] BreadcrumbList on nested pages
- [ ] H1 unique per page; logical H2–H4 hierarchy
- [ ] Alt text on all meaningful images
- [ ] Internal links to related products/case studies
- [ ] AEO direct-answer paragraph present
- [ ] No duplicate content across shop/agency verticals

---

*SEO / AEO / GEO System v1.0 — V Design Luxury*
