import { resolveShowcaseItemImage } from "@/lib/product/image-resolver";
import type { ProductShowcaseItem } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

type SignaturePiecesGridProps = {
  products: ProductShowcaseItem[];
};

function resolveTagline(product: ProductShowcaseItem): string {
  if (product.subtitle?.trim()) {
    return product.subtitle.trim();
  }

  if (product.searchDescription?.trim()) {
    const text = product.searchDescription.trim();
    return text.length > 120 ? `${text.slice(0, 117)}…` : text;
  }

  return "";
}

export function SignaturePiecesGrid({ products }: SignaturePiecesGridProps) {
  const items = products.filter((product) => Boolean(product.handle?.trim()));

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="border-t border-white/10 bg-zinc-950 py-20 md:py-24"
      aria-labelledby="signature-pieces-heading"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <header className="mb-12 md:mb-14">
          <div className="mx-auto max-w-2xl text-center md:text-left">
            <div className="mx-auto mb-4 h-px w-12 bg-[#D4AF37] md:mx-0" />
            <h2
              id="signature-pieces-heading"
              className="font-serif text-4xl font-light tracking-tight text-white md:text-5xl"
            >
              Signature Pieces
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Featured work from the atelier—curated for collectors and design-led
              brands.
            </p>
          </div>
        </header>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((product) => {
            const imageUrl = resolveShowcaseItemImage(product);
            const handle = product.handle.trim();
            const tagline = resolveTagline(product);

            return (
              <li key={product.id}>
                <Link
                  href={`/products/${handle}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-black">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.image.alt || product.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-zinc-900"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-light text-white">
                    {product.title}
                  </h3>

                  {tagline ? (
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {tagline}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
