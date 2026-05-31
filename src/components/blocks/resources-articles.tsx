import { cn } from "@/lib/utils/cn";
import type { ResourcePost } from "@/types/resources";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_GRADIENTS = [
  "from-rose-50 via-royal-magenta/15 to-amber-50",
  "from-sky-50 via-peacock-blue/20 to-zinc-100",
  "from-amber-50 via-saffron-gold/25 to-white",
  "from-purple-50 via-white to-peacock-blue/15",
] as const;

const FALLBACK_ARTICLES: ResourcePost[] = [
  {
    _id: "fallback-1",
    title: "5 Branding Mistakes That Hurt Premium Perception",
    excerpt:
      "Learn how typography, color, and consistency shape how customers perceive your brand at first glance.",
    categoryName: "BRANDING",
    publishedAt: "2026-03-12T00:00:00.000Z",
  },
  {
    _id: "fallback-2",
    title: "Luxury Packaging Trends for Wedding Season 2026",
    excerpt:
      "Rigid boxes, tactile finishes, and keepsake formats that couples and planners are requesting most.",
    categoryName: "PACKAGING",
    publishedAt: "2026-03-08T00:00:00.000Z",
  },
  {
    _id: "fallback-3",
    title: "Choosing the Right Print Finish for Retail",
    excerpt:
      "Compare foil, emboss, spot UV, and lamination options before your next production run.",
    categoryName: "PRINTING",
    publishedAt: "2026-02-28T00:00:00.000Z",
  },
  {
    _id: "fallback-4",
    title: "Building a Cohesive Brand System Across Channels",
    excerpt:
      "Align packaging, stationery, and digital touchpoints so your brand feels unmistakably yours.",
    categoryName: "BRANDING",
    publishedAt: "2026-02-20T00:00:00.000Z",
  },
];

function formatPostDate(publishedAt?: string | null): string {
  if (!publishedAt) return "";
  return new Date(publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type ResourcesArticlesProps = {
  posts?: ResourcePost[] | null;
};

export function ResourcesArticles({ posts }: ResourcesArticlesProps) {
  const livePosts =
    posts?.filter((post) => post?.title?.trim()).slice(0, 4) ?? [];
  const usePlaceholders = livePosts.length === 0;
  const displayPosts = usePlaceholders ? FALLBACK_ARTICLES : livePosts;

  return (
    <section
      className="relative isolate mx-auto max-w-7xl scroll-mt-28 px-6 pt-4 pb-0"
      aria-labelledby="resources-articles-heading"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="resources-articles-heading"
          className="text-sm font-bold uppercase tracking-wider text-royal-magenta"
        >
          LATEST ARTICLES &amp; RESOURCES
        </h2>
        <Link
          href="/resources"
          className="text-sm font-semibold text-royal-magenta transition-colors hover:text-peacock-blue"
        >
          View All Articles →
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayPosts.map((post, index) => {
          const category =
            post.categoryName?.trim().toUpperCase() || "INSIGHTS";
          const dateLabel = formatPostDate(post.publishedAt);
          const gradient =
            PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

          return (
            <li key={post._id}>
              <Link href="/resources" className="group block cursor-pointer">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-zinc-50">
                  {usePlaceholders || !post.imageUrl ? (
                    <div
                      className={cn(
                        "h-full w-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-105",
                        gradient,
                      )}
                      aria-hidden="true"
                    />
                  ) : (
                    <Image
                      src={post.imageUrl}
                      alt={post.title ?? "Article cover"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      unoptimized={!post.imageUrl.startsWith("http")}
                    />
                  )}
                  <span className="absolute bottom-3 left-3 rounded bg-white px-2 py-1 text-[10px] font-bold text-royal-magenta">
                    {category}
                  </span>
                </div>
                <h3 className="mb-2 line-clamp-2 font-serif text-lg font-bold text-luxury-text">
                  {post.title}
                </h3>
                {post.excerpt?.trim() ? (
                  <p className="mb-4 line-clamp-3 text-sm text-luxury-muted">
                    {post.excerpt}
                  </p>
                ) : null}
                <p className="flex justify-between text-xs text-zinc-400">
                  <span>{dateLabel || "—"}</span>
                  <span>Read article</span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
