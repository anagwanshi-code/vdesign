import type { DownloadResource } from "@/types/resources";
import { cn } from "@/lib/utils/cn";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_DOWNLOADS: DownloadResource[] = [
  {
    _id: "fallback-packaging",
    title: "Packaging Checklist",
    subtitle: "PDF Guide • 1.2 MB",
  },
  {
    _id: "fallback-brand",
    title: "Brand Identity Checklist",
    subtitle: "PDF Guide • 980 KB",
  },
  {
    _id: "fallback-printing",
    title: "Printing Finishes",
    subtitle: "PDF Guide • 1.5 MB",
  },
  {
    _id: "fallback-logo",
    title: "Logo Design Guide",
    subtitle: "PDF Guide • 1.1 MB",
  },
];

function DownloadPreview({ previewImageUrl }: { previewImageUrl?: string | null }) {
  const imageUrl = previewImageUrl?.trim();

  return (
    <div className="relative mb-3 w-full aspect-[4/5] overflow-hidden rounded-lg">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 25vw, 20vw"
          unoptimized={!imageUrl.startsWith("http")}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"
          aria-hidden="true"
        />
      )}
      <div className="absolute -bottom-2 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-md bg-white shadow-md ring-1 ring-zinc-100">
        <FileText
          className="h-5 w-5 text-red-500"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function DownloadCardBody({ item }: { item: DownloadResource }) {
  return (
    <>
      <DownloadPreview previewImageUrl={item.previewImageUrl} />
      <h3 className="text-sm font-bold text-luxury-text">{item.title}</h3>
      {item.subtitle?.trim() ? (
        <p className="mt-1 text-xs text-luxury-muted">{item.subtitle}</p>
      ) : null}
    </>
  );
}

type ResourcesDownloadsProps = {
  downloads?: DownloadResource[] | null;
};

export function ResourcesDownloads({ downloads }: ResourcesDownloadsProps) {
  const liveDownloads =
    downloads?.filter((item) => item?.title?.trim()) ?? [];
  const displayDownloads =
    liveDownloads.length > 0 ? liveDownloads : FALLBACK_DOWNLOADS;

  return (
    <section
      className="relative isolate mx-auto max-w-7xl scroll-mt-28 border-t border-luxury-border/60 px-6 pt-20"
      aria-labelledby="resources-downloads-heading"
    >
      <h2
        id="resources-downloads-heading"
        className="mb-8 text-sm font-bold uppercase tracking-wider text-royal-magenta"
      >
        POPULAR DOWNLOADABLE RESOURCES
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
        {displayDownloads.map((item) => {
          const fileUrl = item.fileUrl?.trim();

          return (
            <article
              key={item._id}
              className="group flex h-full flex-col items-center rounded-xl border border-zinc-100 p-4 text-center transition-all hover:shadow-md"
            >
              {fileUrl ? (
                <a
                  href={fileUrl}
                  download
                  className={cn(
                    "flex w-full flex-col items-center",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-magenta",
                  )}
                >
                  <DownloadCardBody item={item} />
                </a>
              ) : (
                <div className="flex w-full flex-col items-center">
                  <DownloadCardBody item={item} />
                </div>
              )}
            </article>
          );
        })}

        <article className="flex h-full min-h-full flex-col justify-center rounded-xl border border-zinc-100 bg-luxury-surface/50 p-6 text-center">
          <h3 className="font-serif text-lg font-bold text-luxury-text">
            Have a Question?
          </h3>
          <p className="mt-2 text-sm text-luxury-muted">
            Can&apos;t find what you&apos;re looking for? Our experts are here
            to help.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-pink-600 bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get Expert Help
          </Link>
        </article>
      </div>
    </section>
  );
}
