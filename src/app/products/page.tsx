import { ProductCategories } from "@/components/blocks/product-categories";
import { ProductsCta } from "@/components/blocks/products-cta";
import { TrustBadges } from "@/components/blocks/trust-badges";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Premium print and packaging by V Design—photo frames, albums, invitation boxes, wedding printing, corporate kits, and custom orders.",
};

export default function ProductsPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-luxury-bg pb-12 pt-32 md:pb-16 md:pt-40">
        <div
          className="pointer-events-none absolute -right-20 top-16 h-96 w-96 rounded-full bg-peacock-blue/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-royal-magenta/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              OUR PRODUCTS
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-6xl lg:text-7xl">
              Premium Products,
              <br />
              Made to{" "}
              <span className="font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent">
                Impress.
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              From wedding keepsakes to corporate brand kits—every piece is
              crafted with premium materials, precision printing, and the care
              your brand deserves.
            </p>
            <div className="flex flex-wrap items-center gap-4">
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
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-peacock-blue/20 via-transparent to-royal-magenta/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-peacock-blue/30 via-zinc-50 to-royal-magenta/25 p-8 text-center">
                <span className="mb-2 font-serif text-3xl text-peacock-blue/90 md:text-4xl">
                  Peacock &amp; Boxes
                </span>
                <span className="max-w-xs text-sm text-luxury-muted">
                  Hero visual placeholder — luxury packaging composition
                </span>
              </div>
              <Image
                src="/logo.png"
                alt=""
                width={72}
                height={72}
                className="absolute bottom-6 right-6 h-14 w-auto opacity-25"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />
      <ProductCategories />
      <ProductsCta />
    </div>
  );
}
