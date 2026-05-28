import { resolveCollectionImageOrNull } from "@/lib/product/image-resolver";
import type { CollectionCard } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

type FeaturedCollectionsGridProps = {
  collections: CollectionCard[];
};

export function FeaturedCollectionsGrid({
  collections,
}: FeaturedCollectionsGridProps) {
  const items = collections.filter((collection) =>
    Boolean(collection.slug?.trim()),
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-black py-24"
      aria-labelledby="featured-collections-heading"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <header className="mb-12 text-center">
          <h2
            id="featured-collections-heading"
            className="font-serif text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Curated Collections
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((collection) => {
            const imageUrl = resolveCollectionImageOrNull(collection);
            const slug = collection.slug.trim();

            return (
              <li key={collection.id}>
                <Link
                  href={`/collections/${slug}`}
                  className="group relative block aspect-[4/5] cursor-pointer overflow-hidden"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-zinc-900"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                    aria-hidden="true"
                  />

                  <p className="absolute bottom-6 left-6 font-serif text-xl font-light tracking-wide text-white">
                    {collection.title}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
