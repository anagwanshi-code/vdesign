import Image from "next/image";
import Link from "next/link";

export type HomeFeaturedProduct = {
  _id: string;
  title: string;
  slug?: string;
  price?: number;
  rating?: number;
  reviewsCount?: number;
  isBestSeller?: boolean;
  imageUrl?: string | null;
  categoryName?: string | null;
};

type ProductShowcaseProps = {
  products: HomeFeaturedProduct[];
};

export function ProductShowcase({ products }: ProductShowcaseProps) {
  return (
    <section
      className="w-full bg-white py-24 md:py-32"
      aria-labelledby="product-showcase-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              Our Products
            </p>
            <h2
              id="product-showcase-heading"
              className="font-serif text-4xl leading-tight text-luxury-text md:text-5xl"
            >
              Crafted with Precision.
              <br />
              Designed to Impress.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:text-right">
            <p className="max-w-md text-lg text-luxury-muted lg:ml-auto">
              Signature formats from the V Design atelier—engineered for
              tactile impact, vibrant print, and shelf presence.
            </p>
            <Link
              href="/shop"
              className="font-medium text-royal-magenta transition-colors hover:text-peacock-blue"
            >
              Explore Collection →
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-luxury-muted">
            No products yet. Add products in Sanity Studio to feature them here.
          </p>
        ) : (
          <ul className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const href = product.slug
                ? `/products/${product.slug}`
                : "/shop";

              return (
                <li key={product._id}>
                  <Link
                    href={href}
                    className="group block transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-lg border border-zinc-100 bg-luxury-surface shadow-sm">
                      <Image
                        src={product.imageUrl || "/images/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={!product.imageUrl?.startsWith("http")}
                      />
                      {product.isBestSeller ? (
                        <span className="absolute left-3 top-3 rounded-full bg-royal-magenta px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          Bestseller
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mb-1 font-serif text-xl text-luxury-text transition-colors group-hover:text-royal-magenta">
                      {product.title}
                    </h3>
                    {product.categoryName ? (
                      <p className="mb-2 text-xs uppercase tracking-widest text-luxury-muted">
                        {product.categoryName}
                      </p>
                    ) : null}
                    <p className="text-sm font-semibold text-royal-magenta">
                      ₹{product.price ?? 0}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
