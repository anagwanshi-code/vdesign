import ShopCatalogSection from "@/components/blocks/shop-catalog-section";
import { ShopTrustBanner } from "@/components/blocks/shop-trust-banner";
import { SplitPageHero } from "@/components/blocks/split-page-hero";
import { client } from "@/sanity/lib/client";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
  SHOP_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type { PageHeroContent } from "@/types/page-hero";
import type { ShopCategoryItem, ShopProductItem } from "@/types/shop";
import type { Metadata } from "next";
import Link from "next/link";
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop premium print and packaging from V Design—frames, albums, boxes, wedding printing, and corporate kits with secure delivery across India.",
};

type ShopPageProps = {
  searchParams: Promise<{ category?: string }>;
};

function resolveInitialCategory(
  categories: { title: string; slug?: string }[],
  categorySlug?: string,
): string {
  const normalized = categorySlug?.trim().toLowerCase();
  if (!normalized) {
    return "All Products";
  }

  const match = categories.find(
    (item) => item.slug?.trim().toLowerCase() === normalized,
  );

  return match?.title?.trim() || "All Products";
}

const DEFAULT_TITLE = "Premium Products, Printed to Perfection.";
const DEFAULT_DESCRIPTION =
  "Browse our full catalog of luxury packaging, frames, albums, and print essentials—crafted in Surat and shipped across India.";

/** Collapses repeated "Printed to" copy from CMS and normalises to the canonical headline. */
function sanitizeShopTitle(title: string): string {
  const collapsed = title
    .replace(/(Printed to\s+)+/gi, "Printed to ")
    .replace(/\s+/g, " ")
    .trim();

  if (/perfection/i.test(collapsed)) {
    return DEFAULT_TITLE;
  }

  return collapsed || DEFAULT_TITLE;
}

function renderShopTitle(title: string) {
  const normalized = sanitizeShopTitle(title);
  const match = normalized.match(/^(.+?),\s*Printed to\s+(Perfection\.?)$/i);

  if (match) {
    return (
      <>
        {match[1].trim()},
        <br />
        Printed to{" "}
        <span className="font-dancing bg-gradient-to-r from-royal-magenta to-orange-500 bg-clip-text text-transparent">
          {match[2]}
        </span>
      </>
    );
  }

  return normalized;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category: categorySlug } = await searchParams;
  const [products, categories, pageContent] = await Promise.all([
    client.fetch<ShopProductItem[]>(ALL_PRODUCTS_QUERY),
    client.fetch<ShopCategoryItem[]>(ALL_CATEGORIES_QUERY),
    client.fetch<PageHeroContent | null>(SHOP_PAGE_QUERY),
  ]);

  const initialActiveCategory = resolveInitialCategory(
    categories ?? [],
    categorySlug,
  );

  const title = pageContent?.title?.trim() || DEFAULT_TITLE;
  const description =
    pageContent?.shortDescription?.trim() || DEFAULT_DESCRIPTION;
  const heroImageUrl = pageContent?.heroImageUrl?.trim();

  return (
    <div className="bg-white pt-6 lg:pt-8">
      <SplitPageHero
        compact
        eyebrow="SHOP OUR COLLECTION"
        title={renderShopTitle(title)}
        description={description}
        heroImageUrl={heroImageUrl}
        actions={
          <>
            <Link
              href="#shop-catalog"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Shop All Products
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
            >
              Bulk Inquiry
            </Link>
          </>
        }
      />

      <ShopTrustBanner />

      <ShopCatalogSection
        products={products ?? []}
        categories={categories ?? []}
        initialActiveCategory={initialActiveCategory}
      />

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-2xl bg-gradient-to-r from-zinc-900 via-royal-magenta/90 to-peacock-blue px-8 py-10 text-center md:flex md:items-center md:justify-between md:text-left">
          <div className="mb-6 md:mb-0">
            <h2 className="mb-2 font-serif text-2xl text-white md:text-3xl">
              Need Something in Bulk?
            </h2>
            <p className="text-sm text-white/80">
              Volume pricing, custom formats, and dedicated production support for
              your business or event.
            </p>
          </div>
          <Link
            href="/consultation"
            className="inline-flex shrink-0 items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-royal-magenta shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Contact Us for Bulk Orders
          </Link>
        </div>
      </section>
    </div>
  );
}
