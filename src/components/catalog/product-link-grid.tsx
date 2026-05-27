import { buildFinishingTagsForShowcase } from "@/lib/product/finishing-tags";
import {
  resolveProductCardAlt,
  resolveShowcaseItemImage,
} from "@/lib/product/image-resolver";
import { cn } from "@/lib/utils/cn";
import type { ProductShowcaseItem } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

type ProductLinkGridProps = {
  products: ProductShowcaseItem[];
  maxColumns?: 3 | 4;
};

function resolveProductHandle(
  product: ProductShowcaseItem & {
    slug?: string | { current?: string };
    _id?: string;
  },
): string {
  if (product.handle) {
    return product.handle;
  }

  if (typeof product.slug === "object" && product.slug?.current) {
    return product.slug.current;
  }

  if (typeof product.slug === "string") {
    return product.slug;
  }

  return "";
}

function resolveProductPriceLabel(
  product: ProductShowcaseItem & { price?: number | string },
): string {
  if (product.priceLabel) {
    return product.priceLabel;
  }

  if (typeof product.price === "number") {
    return `₹${product.price.toLocaleString("en-IN")}`;
  }

  if (typeof product.price === "string") {
    return product.price;
  }

  return "";
}

function getFinishingTags(product: ProductShowcaseItem): string[] {
  if (product.finishingTags?.length) {
    return product.finishingTags;
  }

  return buildFinishingTagsForShowcase(product);
}

export function ProductLinkGrid({
  products,
  maxColumns = 4,
}: ProductLinkGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "mx-auto grid max-w-[1440px] gap-8",
        maxColumns === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {products.map((product) => {
        const resolvedImage = resolveShowcaseItemImage(product);
        const hoverImageUrl = product.hoverImage?.src
          ? resolveShowcaseItemImage({
              title: product.title,
              image: product.hoverImage,
            })
          : null;
        const tags = getFinishingTags(product);
        const handle = resolveProductHandle(product);
        const priceLabel = resolveProductPriceLabel(product);

        return (
          <li key={product.id}>
            <Link
              href={`/products/${handle}`}
              className="group flex cursor-pointer flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span
                className={
                  resolvedImage
                    ? "relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-sm border border-border"
                    : "mb-6 block w-full"
                }
              >
                {resolvedImage ? (
                  <Image
                    src={resolvedImage}
                    alt={resolveProductCardAlt(product)}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                  />
                ) : null}
                {hoverImageUrl && hoverImageUrl !== resolvedImage ? (
                  <Image
                    src={hoverImageUrl}
                    alt={product.hoverImage?.alt ?? product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-0 transition-all duration-700 ease-cinematic group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : null}
              </span>

              <h4 className="mb-2 line-clamp-1 font-serif text-lg text-foreground md:text-xl">
                {product.title}
              </h4>

              <span className="mb-4 font-sans text-sm text-muted">{priceLabel}</span>

              {tags.length > 0 ? (
                <span className="mt-auto flex flex-wrap justify-center gap-2">
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/60 bg-background/50 px-3 py-1 font-sans text-[9px] uppercase tracking-widest text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 2 ? (
                    <span className="rounded-full border border-border/60 bg-background/50 px-2 py-1 font-sans text-[9px] uppercase tracking-widest text-muted">
                      +{tags.length - 2}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
