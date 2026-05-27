import {
  resolveCollectionAlt,
  resolveCollectionImageOrNull,
} from "@/lib/product/image-resolver";
import type { CollectionCard } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

type CollectionGridProps = {
  collections: CollectionCard[];
};

export function CollectionGrid({ collections }: CollectionGridProps) {
  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => {
        const resolvedImage = resolveCollectionImageOrNull(collection);

        if (!collection.slug?.trim()) {
          return null;
        }

        return (
          <li key={collection.id}>
            <Link
              href={`/collections/${collection.slug}`}
              className="group flex cursor-pointer flex-col items-center text-center"
            >
              {resolvedImage ? (
                <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-sm border border-border">
                  <div className="absolute inset-0 z-10 bg-black/10 transition-colors duration-700 group-hover:bg-black/0" />
                  <Image
                    src={resolvedImage}
                    alt={resolveCollectionAlt(collection)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="z-0 object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                  />
                </div>
              ) : null}

              <h3 className="mb-2 font-serif text-2xl text-foreground md:text-3xl">
                {collection.title}
              </h3>

              {collection.description ? (
                <p className="mx-auto max-w-sm line-clamp-2 font-sans text-sm text-muted">
                  {collection.description}
                </p>
              ) : null}

              <p className="mt-3 font-sans text-xs uppercase tracking-widest text-muted">
                {collection.productCount}{" "}
                {collection.productCount === 1 ? "product" : "products"}
              </p>

              <span className="mt-4 border-b border-foreground pb-1 font-sans text-xs uppercase tracking-widest text-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Explore Collection
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
