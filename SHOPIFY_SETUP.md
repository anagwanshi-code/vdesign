# V Design Luxury — Shopify Setup

> Headless ecommerce architecture via Shopify Storefront API and `@shopify/hydrogen-react`—decoupled catalog, secure cart, and hosted checkout handoff.

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     Next.js 15 (V Design Luxury)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ RSC Pages   │  │ Client       │  │ Route Handlers          │ │
│  │ (catalog)   │  │ Islands      │  │ /api/shopify/webhook    │ │
│  │ Server fetch│  │ useCart()    │  │ (optional inventory)    │ │
│  └──────┬──────┘  └──────┬───────┘  └─────────────────────────┘ │
└─────────┼────────────────┼────────────────────────────────────────┘
          │ GraphQL        │ GraphQL (mutations)
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Shopify Storefront API (2024-10+)                    │
│  Products · Collections · Cart · Checkout URL                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Redirect
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              Shopify Hosted Checkout (PCI-compliant)             │
└─────────────────────────────────────────────────────────────────┘
```

**Sanity overlay:** Product narratives, packaging stories, and editorial blocks live in Sanity; Shopify remains the single source of truth for price, inventory, and checkout.

---

## 2. Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_STOREFRONT_API_VERSION=2024-10

# Optional: private admin API for webhooks (server-only)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_admin_xxxxx
SHOPIFY_WEBHOOK_SECRET=whsec_xxxxx
```

### Validation (`src/lib/utils/env.ts`)

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),
  SHOPIFY_STOREFRONT_API_VERSION: z.string().default('2024-10'),
});

export const shopifyEnv = envSchema.parse({
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_STOREFRONT_API_VERSION: process.env.SHOPIFY_STOREFRONT_API_VERSION,
});
```

---

## 3. Storefront Client Initialization Matrix

| Client | Runtime | Package | Purpose |
|--------|---------|---------|---------|
| `storefrontClient` | Server (RSC) | `graphql-request` | Product/collection queries with Next.js cache tags |
| `ShopifyProvider` | Client | `@shopify/hydrogen-react` | Cart context, mutations |
| `useShopQuery` | Client | `@shopify/hydrogen-react` | Client-side refetch (cart drawer only) |

### 3.1 Server Storefront Client

```typescript
// src/lib/shopify/storefront.ts
import { GraphQLClient } from 'graphql-request';
import { shopifyEnv } from '@/lib/utils/env';

const endpoint = `https://${shopifyEnv.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${shopifyEnv.SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

export function createStorefrontClient() {
  return new GraphQLClient(endpoint, {
    headers: {
      'X-Shopify-Storefront-Access-Token':
        shopifyEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });
}

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { tags?: string[]; revalidate?: number }
): Promise<T> {
  const client = createStorefrontClient();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token':
        shopifyEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: options?.revalidate ?? 3600,
      tags: options?.tags,
    },
  });

  const json = await response.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}
```

### 3.2 Hydrogen React Provider (Client)

```typescript
// src/components/providers/ShopifyProvider.tsx
'use client';

import { ShopifyProvider as HydrogenShopifyProvider, CartProvider } from '@shopify/hydrogen-react';
import { shopifyEnv } from '@/lib/utils/env';

const storeDomain = shopifyEnv.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontToken = shopifyEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storefrontApiVersion = shopifyEnv.SHOPIFY_STOREFRONT_API_VERSION;

export function ShopifyProvider({ children }: { children: React.ReactNode }) {
  return (
    <HydrogenShopifyProvider
      storeDomain={storeDomain}
      storefrontToken={storefrontToken}
      storefrontApiVersion={storefrontApiVersion}
      countryIsoCode="IN"
      languageIsoCode="EN"
    >
      <CartProvider>{children}</CartProvider>
    </HydrogenShopifyProvider>
  );
}
```

Mount in `src/app/(shop)/layout.tsx` only—not on agency routes.

---

## 4. GraphQL Operations Structure

```
src/lib/shopify/
├── fragments/
│   ├── product.ts        # ProductCard, ProductDetail shared fields
│   ├── image.ts
│   └── money.ts
├── queries/
│   ├── get-product.ts
│   ├── get-collection.ts
│   ├── get-products.ts
│   └── get-menu.ts
└── mutations/
    └── cart.ts           # Reference only; prefer useCart hooks
```

### 4.1 Product Fragment (Example)

```graphql
# src/lib/shopify/fragments/product.ts
fragment ProductCard on Product {
  id
  handle
  title
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  availableForSale
}
```

### 4.2 Query with Cache Tags

```typescript
// src/lib/shopify/queries/get-product.ts
import { storefrontFetch } from '../storefront';
import type { ShopifyProduct } from '@/types/shopify';

const GET_PRODUCT = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductDetail
    }
  }
  ${PRODUCT_DETAIL_FRAGMENT}
`;

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontFetch<{ product: ShopifyProduct | null }>(
    GET_PRODUCT,
    { handle },
    { tags: [`shopify:product:${handle}`], revalidate: 3600 }
  );
  return data.product;
}
```

---

## 5. Data-Fetching Policies

| Data | Fetch Location | Cache | Invalidation |
|------|---------------|-------|--------------|
| Product listing | RSC | 3600s + tag | Webhook / manual |
| Product detail | RSC | 3600s + `shopify:product:{handle}` | Inventory webhook |
| Collection | RSC | 3600s + `shopify:collection:{handle}` | Webhook |
| Navigation menu | RSC layout | 86400s | Manual |
| Cart state | Client (`useCart`) | None | Real-time |
| Checkout URL | Client | None | Per session |

### 5.1 Rules

1. **Never** expose Admin API token to client
2. **Never** cache cart mutations
3. Product pages use `generateStaticParams` for top 100 SKUs + ISR fallback
4. Stale price display max: 1 hour (revalidate) or immediate on webhook

---

## 6. Cart Operations

### 6.1 Cart ID Persistence

```typescript
// src/lib/shopify/cart.ts
const CART_ID_KEY = 'vdl_cart_id';

export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

export function setCartId(id: string): void {
  localStorage.setItem(CART_ID_KEY, id);
}

export function clearCartId(): void {
  localStorage.removeItem(CART_ID_KEY);
}
```

### 6.2 Add to Cart (Client Island)

```typescript
'use client';

import { useCart } from '@shopify/hydrogen-react';
import { Button } from '@/components/atoms/Button';

type AddToCartButtonProps = {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
};

export function AddToCartButton({
  variantId,
  quantity = 1,
  disabled,
}: AddToCartButtonProps) {
  const { linesAdd, status } = useCart();

  const handleAdd = () => {
    linesAdd([{ merchandiseId: variantId, quantity }]);
  };

  return (
    <Button
      variant="primary"
      onClick={handleAdd}
      disabled={disabled || status === 'creating' || status === 'updating'}
    >
      {status === 'updating' ? 'Adding…' : 'Add to Cart'}
    </Button>
  );
}
```

---

## 7. Secure Checkout Handoff

### 7.1 Checkout Flow

```
User clicks "Checkout"
        │
        ▼
useCart() → cart.checkoutUrl
        │
        ▼
window.location.href = checkoutUrl  (full redirect)
        │
        ▼
Shopify Hosted Checkout (SSL, PCI)
        │
        ▼
Order confirmation → Shopify thank-you page
        │
        ▼
(Optional) redirect back to /order-confirmation?order=xxx
```

### 7.2 Checkout Button Implementation

```typescript
'use client';

import { useCart } from '@shopify/hydrogen-react';
import { Button } from '@/components/atoms/Button';

export function CheckoutButton() {
  const { checkoutUrl, totalQuantity } = useCart();

  if (!totalQuantity || !checkoutUrl) return null;

  const handleCheckout = () => {
    // Full redirect — never iframe checkout
    window.location.href = checkoutUrl;
  };

  return (
    <Button variant="accent" onClick={handleCheckout}>
      Proceed to Checkout
    </Button>
  );
}
```

### 7.3 Security Requirements

| Rule | Rationale |
|------|-----------|
| Never embed checkout in iframe | PCI, XSS, cookie isolation |
| Never store payment data | Shopify handles all PCI |
| Storefront token is public read-only | Safe for client; scoped permissions only |
| Validate cart server-side before custom flows | Prevent price tampering |
| Use HTTPS everywhere | Required for Secure cookies |
| Clear cart ID after successful order | Prevent stale cart reuse |
| Rate-limit cart API routes if custom | Prevent abuse |

### 7.4 Storefront Access Token Scopes

Required scopes (Shopify Admin → Apps → Storefront API):

- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_collection_listings`
- `unauthenticated_write_checkouts` (cart/checkout)
- `unauthenticated_read_customers` (optional, if account features)

**Never grant:** Admin write scopes to Storefront token.

---

## 8. Webhook Integration (Optional)

For inventory/price sync when products change outside Next.js:

```typescript
// src/app/api/shopify/webhook/route.ts
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const hmac = req.headers.get('x-shopify-hmac-sha256') ?? '';
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET!;

  const hash = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64');
  if (hash !== hmac) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (payload.handle) {
    revalidateTag(`shopify:product:${payload.handle}`);
  }

  return NextResponse.json({ ok: true });
}
```

Subscribe to: `products/update`, `products/delete`, `inventory_levels/update`.

---

## 9. Sanity + Shopify Product Enrichment

```
Shopify (source of truth)          Sanity (narrative layer)
─────────────────────────          ─────────────────────────
title, price, variants      +      packagingStory, craftNotes
images, inventory                  editorialBlocks, videoLoops
handle (join key)          ←→      shopifyHandle (reference)
```

Fetch pattern:

```typescript
const [shopifyProduct, sanityOverlay] = await Promise.all([
  getProduct(handle),
  getProductStory(handle),
]);
return { ...shopifyProduct, story: sanityOverlay };
```

---

## 10. Error Handling

| Error | User Experience | Dev Action |
|-------|-----------------|------------|
| Product not found | `notFound()` | Log + 404 |
| API rate limit | Retry with backoff | Monitor Storefront limits |
| Cart creation fail | Toast + retry button | Log mutation error |
| Sold out variant | Disable add button | Real-time from `availableForSale` |
| Checkout URL missing | "Refresh cart" CTA | Debug cart state |

---

## 11. Testing Checklist

- [ ] Product page renders with ISR
- [ ] Add to cart persists across refresh (cart ID in localStorage)
- [ ] Checkout redirect lands on Shopify hosted page
- [ ] Prices display in INR
- [ ] Out-of-stock variants disabled
- [ ] Cache tags invalidate on webhook
- [ ] No Admin API token in client bundle (`next build` analyze)
- [ ] Cart drawer accessible (keyboard + screen reader)

---

*Shopify Setup v1.0 — V Design Luxury*
