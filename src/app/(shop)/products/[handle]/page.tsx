import { SimilarProducts } from "@/components/catalog/similar-products";
import { ProductDetailGallery } from "@/components/product/product-detail-gallery";
import { ProductPurchaseSection } from "@/components/product/product-purchase-section";
import { ProductSpecifications } from "@/components/product/product-specifications";
import { formatQuantityHint } from "@/lib/commerce/pricing";
import { resolveProductByHandle } from "@/lib/data/product";
import { getSimilarProducts } from "@/lib/product/similar-products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const routeParams = await params;

  console.log(
    "Searching for slug/handle:",
    (routeParams as { slug?: string }).slug || routeParams.handle,
  );

  const slug = (
    (routeParams as { slug?: string }).slug || routeParams.handle
  )
    .toString()
    .toLowerCase()
    .trim();

  const product = await resolveProductByHandle(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.title,
    description:
      product.description ??
      product.subtitle ??
      "Curated luxury product from V Design Luxury.",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const routeParams = await params;

  console.log(
    "Searching for slug/handle:",
    (routeParams as { slug?: string }).slug || routeParams.handle,
  );

  const slug = (
    (routeParams as { slug?: string }).slug || routeParams.handle
  )
    .toString()
    .toLowerCase()
    .trim();

  const product = await resolveProductByHandle(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(
    product.id,
    product.categoryRef,
    product.collectionRef,
  );

  return (
    <article className="mx-auto w-full max-w-content px-5 py-16 md:px-8 lg:px-20 lg:py-24">
      <nav className="mb-10 text-caption text-text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/collections"
              className="transition-colors duration-base ease-luxury hover:text-peacock"
            >
              Collections
            </Link>
          </li>
          {product.collection ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/collections/${product.collection.slug}`}
                  className="transition-colors duration-base ease-luxury hover:text-peacock"
                >
                  {product.collection.title}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">/</li>
          <li className="text-text-primary">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <ProductDetailGallery
          primary={product.image}
          gallery={product.gallery}
          title={product.title}
        />

        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <p className="text-overline uppercase text-saffron">Signature Edit</p>
            <h1 className="font-serif text-display-lg text-text-primary">
              {product.title}
            </h1>
            {product.subtitle ? (
              <p className="text-body-lg text-text-muted">{product.subtitle}</p>
            ) : null}
            {product.description ? (
              <p className="max-w-prose text-body text-text-muted">
                {product.description}
              </p>
            ) : null}
            <p className="text-caption uppercase tracking-widest text-text-muted">
              {formatQuantityHint(
                product.saleType,
                product.minOrderQuantity,
              )}
            </p>
          </header>

          <ProductPurchaseSection key={product.id} product={product} />

          <ProductSpecifications specifications={product.specifications} />
        </div>
      </div>

      <SimilarProducts
        products={similarProducts}
        collectionTitle={product.collection?.title}
        collectionSlug={product.collection?.slug}
      />
    </article>
  );
}
