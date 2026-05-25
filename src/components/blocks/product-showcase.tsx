"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/use-cart";
import type { ProductShowcaseItem } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

type ProductShowcaseProps = {
  products: ProductShowcaseItem[];
  dataSource?: "sanity" | "mock";
};

export function ProductShowcase({
  products,
  dataSource = "mock",
}: ProductShowcaseProps) {
  const { addItem } = useCart();

  return (
    <section
      className="border-t border-border bg-surface"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 lg:px-20 lg:py-32">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-prose">
            <p className="text-overline uppercase text-saffron">Signature Edit</p>
            <h2
              id="products-heading"
              className="mt-4 font-serif text-display-lg text-text-primary"
            >
              Curated for the collection
            </h2>
            <p className="mt-4 text-body text-text-muted">
              {dataSource === "sanity"
                ? "Live catalog from Sanity CMS—settled natively in INR via Razorpay UPI."
                : "Editorial catalog matrix—mock data displayed while Sanity environment variables are configured."}
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-md border border-border px-6 text-body font-sans text-text-primary transition-colors duration-base ease-luxury hover:border-peacock hover:text-peacock"
          >
            View All
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <article className="group flex flex-col">
                <Link
                  href={`/collections/${product.handle}`}
                  className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-border"
                >
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    width={product.image.width}
                    height={product.image.height}
                    className="h-full w-full object-cover transition-transform duration-slow ease-luxury group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={`/collections/${product.handle}`}
                    className="font-serif text-body-lg text-text-primary transition-colors duration-base ease-luxury hover:text-peacock"
                  >
                    {product.title}
                  </Link>
                  <p className="text-caption text-text-muted">{product.subtitle}</p>
                  <p className="text-body font-sans tabular-nums text-text-primary">
                    {product.priceLabel}
                  </p>
                  <p className="text-caption uppercase tracking-widest text-text-muted">
                    {product.source === "sanity" ? "Sanity" : "Preview"} ·{" "}
                    {product.handle}
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4 w-full"
                    onClick={() =>
                      addItem({
                        productId: product.id,
                        title: product.title,
                        subtitle: product.subtitle,
                        priceLabel: product.priceLabel,
                        priceInInr: product.priceInInr,
                        image: {
                          src: product.image.src,
                          alt: product.image.alt,
                        },
                      })
                    }
                  >
                    Add to Bag
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
