import { PortfolioHeroMedia } from "@/components/blocks/portfolio-hero-media";
import { SanityPortableText } from "@/components/sanity/portable-text";
import { client } from "@/sanity/lib/client";
import {
  PORTFOLIO_DETAIL_QUERY,
  PORTFOLIO_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { PortfolioCaseStudy } from "@/types/portfolio";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export const revalidate = 30;

type PortfolioCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCaseStudy(slug: string): Promise<PortfolioCaseStudy | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const project = await client.fetch<
    (PortfolioCaseStudy & { slug?: string | null }) | null
  >(PORTFOLIO_DETAIL_QUERY, { slug: normalized });

  if (!project?.title) {
    return null;
  }

  return {
    ...project,
    slug: project.slug?.trim() || normalized,
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(PORTFOLIO_SLUGS_QUERY);
  return (slugs ?? [])
    .map((entry) => entry.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PortfolioCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCaseStudy(slug);

  if (!project) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: project.title,
    description:
      project.shortDescription?.trim() ||
      `Case study: ${project.title} by V Design Surat.`,
  };
}

export default async function PortfolioCaseStudyPage({
  params,
}: PortfolioCaseStudyPageProps) {
  const { slug } = await params;
  const project = await getCaseStudy(slug);

  if (!project?.slug) {
    notFound();
  }

  const imageUrl = project.imageUrl?.trim();
  const videoUrl = project.videoUrl?.trim();
  const services = project.servicesProvided?.filter((item) => item?.trim()) ?? [];
  const gallery = project.gallery?.filter((item) => item.url?.trim()) ?? [];

  return (
    <article className="bg-white">
      <section className="relative min-h-[55vh] overflow-hidden bg-luxury-text md:min-h-[70vh]">
        <PortfolioHeroMedia
          title={project.title}
          imageUrl={imageUrl}
          videoUrl={videoUrl}
        />

        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-10 md:min-h-[70vh] md:pb-20 lg:pt-16">
          <Link
            href="/portfolio"
            className="mb-8 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Back to Portfolio
          </Link>

          {project.category ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-saffron-gold">
              {project.category}
            </p>
          ) : null}

          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-white md:text-6xl lg:text-7xl">
            {project.title}
          </h1>

          {project.shortDescription ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              {project.shortDescription}
            </p>
          ) : null}
        </div>
      </section>

      <section
        className="border-b border-zinc-100 bg-luxury-bg"
        aria-label="Project metadata"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-14">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-luxury-muted">
              Client
            </p>
            <p className="font-serif text-xl text-luxury-text">
              {project.clientName?.trim() || "—"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-luxury-muted">
              Category
            </p>
            <p className="font-serif text-xl text-luxury-text">
              {project.category?.trim() || "—"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-luxury-muted">
              Timeline
            </p>
            <p className="font-serif text-xl text-luxury-text">
              {project.timeline?.trim() || "—"}
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-luxury-muted">
              Services Provided
            </p>
            {services.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-luxury-text"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-serif text-xl text-luxury-text">—</p>
            )}
          </div>
        </div>
      </section>

      {project.body?.length ? (
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <SanityPortableText value={project.body} />
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section
          className="border-t border-zinc-100 bg-luxury-bg py-16 md:py-24"
          aria-label="Project gallery"
        >
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-10 font-serif text-3xl text-luxury-text md:text-4xl">
              Project Gallery
            </h2>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {gallery.map((item) => {
                const url = item.url!.trim();
                return (
                  <li
                    key={item._key}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 shadow-md"
                  >
                    <Image
                      src={url}
                      alt={item.alt?.trim() || project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={!url.startsWith("http")}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t border-zinc-100 bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center">
          <p className="max-w-lg text-lg text-luxury-muted">
            Ready to craft something equally distinctive for your brand?
          </p>
          <Link
            href="/consultation"
            className="inline-flex rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </article>
  );
}
