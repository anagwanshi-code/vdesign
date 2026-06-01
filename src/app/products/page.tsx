import { ProductCategories } from "@/components/blocks/product-categories";
import { ProductsCta } from "@/components/blocks/products-cta";
import { SplitPageHero } from "@/components/blocks/split-page-hero";
import { TrustBadges } from "@/components/blocks/trust-badges";
import { client } from "@/sanity/lib/client";
import { ALL_CATEGORIES_QUERY, SHOP_PAGE_QUERY } from "@/sanity/lib/queries";
import type { PageHeroContent } from "@/types/page-hero";
import type { ProductCategoryDocument } from "@/types/product-category";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Premium print and packaging by V Design—photo frames, albums, invitation boxes, wedding printing, corporate kits, and custom orders.",
};

const DEFAULT_TITLE = "Premium Products, Made to Impress.";
const DEFAULT_DESCRIPTION =
  "From wedding keepsakes to corporate brand kits—every piece is crafted with premium materials, precision printing, and the care your brand deserves.";

function renderProductsTitle(title: string) {
  const match = title.match(/^(.+?)\s+(Impress\.?)$/i);
  if (match) {
    return (
      <>
        {match[1]}
        <br />
        Made to{" "}
        <span className="font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent">
          {match[2]}
        </span>
      </>
    );
  }
  return title;
}

export default async function ProductsPage() {
  const [categories, pageContent] = await Promise.all([
    client.fetch<ProductCategoryDocument[]>(ALL_CATEGORIES_QUERY),
    client.fetch<PageHeroContent | null>(SHOP_PAGE_QUERY),
  ]);

  const title = pageContent?.title?.trim() || DEFAULT_TITLE;
  const description =
    pageContent?.shortDescription?.trim() || DEFAULT_DESCRIPTION;
  const heroImageUrl = pageContent?.heroImageUrl?.trim();

  return (
    <div className="bg-white pt-10 lg:pt-16">
      <SplitPageHero
        eyebrow="OUR PRODUCTS"
        title={renderProductsTitle(title)}
        description={description}
        heroImageUrl={heroImageUrl}
        actions={
          <>
            <Link
              href="#categories"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View All Products
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
            >
              Get a Custom Quote
            </Link>
          </>
        }
      />

      <TrustBadges />
      <ProductCategories categories={categories} />
      <ProductsCta />
    </div>
  );
}
