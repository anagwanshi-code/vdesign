"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import { normalizeMoq } from "@/lib/commerce/moq";
import { normalizeSaleType } from "@/lib/commerce/sale-type";
import {
  resolveProductCardAlt,
  resolveShowcaseItemImage,
} from "@/lib/product/image-resolver";
import type { ProductShowcaseItem } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

type ProductGridProps = {
  products: ProductShowcaseItem[];
  dataSource?: "sanity" | "mock";
  /** Compact cards for home, search, and related products. */
  variant?: "default" | "compact";
  showAddToBag?: boolean;
  maxColumns?: 3 | 4;
};

export function ProductGrid({
  products,
  dataSource = "sanity",
  variant = "default",
  showAddToBag = true,
  maxColumns = 3,
}: ProductGridProps) {
  const { addItem } = useCart();
  const isCompact = variant === "compact";

  if (products.length === 0) {
    return (
      <p className="text-body text-text-muted">
        No products published yet. Add active products in Sanity Studio.
      </p>
    );
  }

  return (
    <ul
      className={cn(
        "grid gap-8",
        maxColumns === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {products.map((product) => {
        const primaryImage = resolveShowcaseItemImage(product);
        const hoverImageUrl = product.hoverImage?.src
          ? resolveShowcaseItemImage({
              title: product.title,
              image: product.hoverImage,
            })
          : null;

        return (
        <li key={product.id}>
          <article className="group flex h-full flex-col">
            {primaryImage ? (
            <Link
              href={`/products/${product.handle}`}
              className={cn(
                "relative overflow-hidden rounded-sm border border-border",
                isCompact ? "aspect-[3/4]" : "aspect-[4/5]",
              )}
            >
              <Image
                src={primaryImage}
                alt={resolveProductCardAlt(product)}
                fill
                className={cn(
                  "object-cover",
                  hoverImageUrl
                    ? "transition-opacity duration-slow ease-cinematic group-hover:opacity-0"
                    : "transition-transform duration-slow ease-cinematic group-hover:scale-[1.02]",
                )}
                sizes={
                  maxColumns === 4
                    ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                }
              />
              {hoverImageUrl && hoverImageUrl !== primaryImage ? (
                <Image
                  src={hoverImageUrl}
                  alt={product.hoverImage?.alt ?? product.title}
                  fill
                  className="object-cover opacity-0 transition-all duration-slow ease-cinematic group-hover:scale-[1.02] group-hover:opacity-100"
                  sizes={
                    maxColumns === 4
                      ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  }
                />
              ) : null}
            </Link>
            ) : (
              <Link
                href={`/products/${product.handle}`}
                className={cn(
                  "flex items-center justify-center rounded-sm border border-border bg-border/20 font-sans text-xs uppercase tracking-widest text-muted",
                  isCompact ? "aspect-[3/4]" : "aspect-[4/5]",
                )}
              >
                View product
              </Link>
            )}

            <div
              className={cn(
                "flex flex-1 flex-col",
                isCompact ? "mt-4 gap-1.5" : "mt-6 gap-2",
              )}
            >
              <Link
                href={`/products/${product.handle}`}
                className={cn(
                  "font-serif text-text-primary transition-colors duration-base ease-luxury hover:text-peacock",
                  isCompact ? "text-body line-clamp-2" : "text-body-lg",
                )}
              >
                {product.title}
              </Link>

              {!isCompact ? (
                <p className="line-clamp-2 text-caption text-text-muted">
                  {product.subtitle}
                </p>
              ) : null}

              <p
                className={cn(
                  "font-sans tabular-nums text-text-primary",
                  isCompact ? "text-caption" : "text-body",
                )}
              >
                {product.priceLabel}
              </p>

              {product.finishingTags.length > 0 && !isCompact ? (
                <ul
                  className="mt-2 flex flex-wrap gap-2"
                  aria-label="Finishing options"
                >
                  {product.finishingTags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border/60 bg-surface/50 px-3 py-1 font-sans text-[9px] uppercase tracking-widest text-text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              {!isCompact && product.collectionHandle ? (
                <Link
                  href={`/collections/${product.collectionHandle}`}
                  className="text-caption uppercase tracking-widest text-text-muted transition-colors duration-base ease-luxury hover:text-peacock"
                >
                  View collection
                </Link>
              ) : null}

              {showAddToBag && !isCompact ? (
                <Button
                  variant="secondary"
                  className="mt-auto mt-4 w-full"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      title: product.title,
                      subtitle: product.subtitle,
                      priceLabel: product.priceLabel,
                      priceInInr: product.priceInInr,
                      saleType: normalizeSaleType(product.saleType),
                      minOrderQuantity: normalizeMoq(product.minOrderQuantity),
                      quantity: normalizeMoq(product.minOrderQuantity),
                      image: {
                        src: product.image.src,
                        alt: product.image.alt,
                      },
                    })
                  }
                >
                  Add to Bag
                </Button>
              ) : null}
            </div>
          </article>
        </li>
        );
      })}
    </ul>
  );
}
