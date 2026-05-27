import { ProductGrid } from "@/components/catalog/product-grid";
import { resolveCollectionBySlug } from "@/lib/data/collections";
import {
  resolveCollectionAlt,
  resolveCollectionImageOrNull,
} from "@/lib/product/image-resolver";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const routeParams = await params;

  console.log("Looking for collection slug:", routeParams.slug);

  const slug = routeParams.slug.trim();

  const { collection } = await resolveCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: collection.title,
    description:
      collection.description ??
      `Explore ${collection.title} from V Design Luxury.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const routeParams = await params;

  console.log("Looking for collection slug:", routeParams.slug);

  const slug = routeParams.slug.trim();

  const { collection, products, source } = await resolveCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const heroImageUrl = resolveCollectionImageOrNull(collection);

  return (
    <section className="mx-auto w-full max-w-content px-5 py-16 md:px-8 lg:px-20 lg:py-24">
      <nav
        className="mb-10 text-caption text-text-muted"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/collections"
              className="transition-colors duration-base ease-luxury hover:text-peacock"
            >
              Collections
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary">{collection.title}</li>
        </ol>
      </nav>

      <header
        className={
          heroImageUrl
            ? "mb-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
            : "mb-16 max-w-prose"
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-overline uppercase text-saffron">Collection</p>
          <h1 className="font-serif text-display-lg text-text-primary">
            {collection.title}
          </h1>
          {collection.description ? (
            <p className="max-w-prose text-body text-text-muted">
              {collection.description}
            </p>
          ) : null}
          <p className="text-caption text-text-muted">
            {source === "sanity"
              ? `${products.length} published ${products.length === 1 ? "product" : "products"} · MOQ pricing applies per SKU`
              : "Preview catalog"}
          </p>
        </div>
        {heroImageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border">
            <Image
              src={heroImageUrl}
              alt={resolveCollectionAlt(collection)}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        ) : null}
      </header>

      <ProductGrid products={products} dataSource={source} maxColumns={4} />
    </section>
  );
}
