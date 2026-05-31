import { Quote } from "lucide-react";
import Image from "next/image";

export type FounderData = {
  name?: string;
  role?: string;
  heading?: string;
  quote?: string;
  bio?: string;
  imageUrl?: string | null;
  signatureUrl?: string | null;
};

const DEFAULT_HEADING = "Built on Passion, Driven by Purpose";

const DEFAULT_BIO_PARAGRAPHS = [
  "V Design began in Surat with a simple belief: Indian brands deserve packaging and visual systems that feel as considered as the products inside them. What started as a boutique print studio has grown into a full creative atelier—serving weddings, retail, and corporate teams who value craft over compromise.",
  "Every project is led with hands-on attention—from the first sketch to the final foil pass—so clients experience clarity, color fidelity, and calm collaboration at every stage.",
] as const;

const DEFAULT_QUOTE =
  "Design is not decoration—it is the promise your brand makes before a word is read.";

type FounderStoryProps = {
  founder?: FounderData | null;
};

function FounderHeading({ heading }: { heading: string }) {
  const commaIndex = heading.indexOf(",");

  if (commaIndex === -1) {
    const words = heading.trim().split(/\s+/);
    if (words.length < 2) {
      return <>{heading}</>;
    }
    const accent = words.pop()!;
    return (
      <>
        {words.join(" ")}{" "}
        <span className="font-dancing ml-2 text-5xl text-royal-magenta md:text-6xl">
          {accent}
        </span>
      </>
    );
  }

  const line1 = heading.slice(0, commaIndex).trim();
  const line2 = heading.slice(commaIndex + 1).trim();
  const words = line2.split(/\s+/);

  if (words.length < 2) {
    return (
      <>
        {line1},
        <br />
        <span className="font-dancing ml-2 text-5xl text-royal-magenta md:text-6xl">
          {line2}
        </span>
      </>
    );
  }

  const accent = words.pop()!;
  const prefix = words.join(" ");

  return (
    <>
      {line1},
      <br />
      {prefix}{" "}
      <span className="font-dancing ml-2 text-5xl text-royal-magenta md:text-6xl">
        {accent}
      </span>
    </>
  );
}

export function FounderStory({ founder }: FounderStoryProps) {
  const bioParagraphs = founder?.bio?.trim()
    ? founder.bio
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [...DEFAULT_BIO_PARAGRAPHS];

  const displayName = founder?.name?.trim() || "V Design";
  const displayRole = founder?.role?.trim() || "Founder & Creative Director";
  const displayHeading = founder?.heading?.trim() || DEFAULT_HEADING;
  const displayQuote = founder?.quote?.trim() || DEFAULT_QUOTE;

  return (
    <section
      className="w-full border-t border-luxury-border bg-luxury-surface py-24 md:py-32"
      aria-labelledby="founder-story-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative">
          <div
            className="absolute -left-6 -top-6 h-48 w-48 rounded-full bg-royal-magenta/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-8 -right-4 h-56 w-56 rounded-full bg-peacock-blue/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute inset-4 rounded-3xl border border-luxury-border/40 opacity-60"
            aria-hidden="true"
          />

          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white p-4 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-luxury-bg via-zinc-100 to-rose-50">
              {founder?.imageUrl ? (
                <Image
                  src={founder.imageUrl}
                  alt={displayName}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={!founder.imageUrl.startsWith("http")}
                />
              ) : (
                <span
                  className="absolute inset-0 flex items-end justify-center pb-16 font-serif text-2xl text-luxury-text/25"
                  aria-hidden="true"
                >
                  Founder Portrait
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Founder&apos;s Story
          </p>

          <h2
            id="founder-story-heading"
            className="mb-6 font-serif text-4xl leading-tight text-luxury-text md:text-5xl"
          >
            <FounderHeading heading={displayHeading} />
          </h2>

          {bioParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mb-6 text-lg leading-relaxed text-luxury-muted last:mb-8"
            >
              {paragraph}
            </p>
          ))}

          <blockquote className="relative mb-8 rounded-xl border border-luxury-border/50 bg-white p-8 font-serif text-xl italic text-luxury-text shadow-sm">
            <Quote
              className="absolute left-6 top-6 h-8 w-8 text-royal-magenta/20"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <p className="relative z-10 pl-10">&ldquo;{displayQuote}&rdquo;</p>
          </blockquote>

          <div>
            {founder?.signatureUrl ? (
              <div className="relative h-14 w-40">
                <Image
                  src={founder.signatureUrl}
                  alt={`${displayName} signature`}
                  fill
                  className="object-contain object-left"
                  unoptimized={!founder.signatureUrl.startsWith("http")}
                />
              </div>
            ) : (
              <p className="font-dancing text-3xl text-luxury-text">{displayName}</p>
            )}
            <p className="mt-1 text-sm uppercase tracking-widest text-luxury-muted">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
