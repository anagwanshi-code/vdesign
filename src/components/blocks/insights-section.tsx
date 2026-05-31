import Image from "next/image";
import Link from "next/link";

export type InsightPost = {
  _id: string;
  title: string;
  slug?: string;
  publishedAt?: string;
  excerpt?: string;
  imageUrl?: string | null;
  categoryName?: string | null;
};

const PLACEHOLDER_POSTS: InsightPost[] = [
  {
    _id: "insight-placeholder-1",
    title: "The Anatomy of Luxury Wedding Packaging",
    publishedAt: "2026-04-20T00:00:00.000Z",
    categoryName: "Packaging",
  },
  {
    _id: "insight-placeholder-2",
    title: "Color Systems That Elevate Indian Retail Brands",
    publishedAt: "2026-04-12T00:00:00.000Z",
    categoryName: "Branding",
  },
  {
    _id: "insight-placeholder-3",
    title: "Print Finishes Every Creative Director Should Know",
    publishedAt: "2026-04-03T00:00:00.000Z",
    categoryName: "Print",
  },
];

const PLACEHOLDER_GRADIENTS = [
  "from-rose-100 via-luxury-surface to-saffron-gold/20",
  "from-peacock-blue/20 via-luxury-surface to-royal-magenta/10",
  "from-purple-100/50 via-white to-luxury-bg",
] as const;

function formatPostDate(publishedAt?: string): string {
  if (!publishedAt) return "";
  return new Date(publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type InsightsSectionProps = {
  posts?: InsightPost[];
};

export function InsightsSection({ posts }: InsightsSectionProps) {
  const livePosts = posts?.filter((post) => post?.title?.trim()) ?? [];
  const usePlaceholders = livePosts.length === 0;
  const displayPosts = usePlaceholders ? PLACEHOLDER_POSTS : livePosts;

  return (
    <section
      className="w-full bg-white py-24 md:py-32"
      aria-labelledby="insights-section-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              Latest Insights
            </p>
            <h2
              id="insights-section-heading"
              className="mb-4 font-serif text-4xl text-luxury-text md:text-5xl"
            >
              Insights & Creative Inspiration
            </h2>
            <p className="text-lg text-luxury-muted">
              Explore our latest articles on branding, packaging and design.
            </p>
          </div>

          <div className="md:flex md:justify-end md:pb-1">
            <Link
              href="/resources"
              className="font-medium text-royal-magenta transition-colors hover:text-peacock-blue"
            >
              View All Blogs →
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayPosts.map((post, index) => {
            const dateLabel = formatPostDate(post.publishedAt);
            const meta = [dateLabel, post.categoryName]
              .filter(Boolean)
              .join(" • ");
            return (
              <li key={post._id}>
                <article>
                  <Link href="/resources" className="group block">
                    <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl border border-zinc-100 bg-luxury-surface shadow-sm">
                      {usePlaceholders ? (
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]}`}
                        >
                          <span
                            className="font-serif text-lg text-luxury-text/25 transition-transform duration-700 group-hover:scale-105"
                            aria-hidden="true"
                          >
                            V Design Journal
                          </span>
                        </div>
                      ) : (
                        <Image
                          src={post.imageUrl || "/placeholder.png"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized={!post.imageUrl?.startsWith("http")}
                        />
                      )}
                    </div>

                    {meta ? (
                      <p className="mb-3 text-xs uppercase tracking-wider text-luxury-muted">
                        {meta}
                      </p>
                    ) : null}

                    <h3 className="mb-3 font-serif text-2xl leading-snug text-luxury-text">
                      {post.title}
                    </h3>

                    {post.excerpt?.trim() ? (
                      <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-luxury-muted">
                        {post.excerpt}
                      </p>
                    ) : null}

                    <span className="inline-block border-b border-transparent text-sm font-medium text-royal-magenta transition-colors group-hover:border-royal-magenta">
                      Read Article
                    </span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
