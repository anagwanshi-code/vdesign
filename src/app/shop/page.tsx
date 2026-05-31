import ShopCatalogSection from "@/components/blocks/shop-catalog-section";
import { ShopTrustBanner } from "@/components/blocks/shop-trust-banner";
import { client } from "@/sanity/lib/client";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
} from "@/sanity/lib/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop premium print and packaging from V Design—frames, albums, boxes, wedding printing, and corporate kits with secure delivery across India.",
};

export default async function ShopPage() {
  const products = await client.fetch(ALL_PRODUCTS_QUERY);
  const categories = await client.fetch(ALL_CATEGORIES_QUERY);

  return (
    <div className="bg-white pt-32">
      <section className="relative overflow-hidden bg-luxury-bg pb-10 pt-4 md:pb-12">
        <div
          className="pointer-events-none absolute -right-16 top-8 h-80 w-80 rounded-full bg-peacock-blue/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 rounded-full bg-royal-magenta/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              SHOP OUR COLLECTION
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-6xl">
              Premium Products,
              <br />
              Printed to{" "}
              <span className="font-dancing bg-gradient-to-r from-royal-magenta to-orange-500 bg-clip-text text-transparent">
                Perfection.
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              Browse our full catalog of luxury packaging, frames, albums, and
              print essentials—crafted in Surat and shipped across India.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#shop-catalog"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Shop All Products
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
              >
                Bulk Inquiry
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-royal-magenta/15 via-transparent to-peacock-blue/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
              <div className="grid h-full grid-cols-2 gap-2 p-3">
                <div className="rounded-xl bg-gradient-to-br from-peacock-blue/30 to-zinc-100" />
                <div className="mt-6 rounded-xl bg-gradient-to-br from-royal-magenta/25 to-amber-50" />
                <div className="rounded-xl bg-gradient-to-br from-saffron-gold/30 to-rose-50" />
                <div className="rounded-xl bg-gradient-to-br from-zinc-100 to-peacock-blue/20" />
              </div>
              <Image
                src="/logo.png"
                alt=""
                width={64}
                height={64}
                className="absolute left-1/2 top-1/2 h-14 w-auto -translate-x-1/2 -translate-y-1/2 opacity-30"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <ShopTrustBanner />

      <ShopCatalogSection
        products={products ?? []}
        categories={categories ?? []}
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
