import { resolveTestimonials } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils/cn";
import type { TestimonialDocument } from "@/types/testimonial";
import { Star } from "lucide-react";
import Image from "next/image";

type TestimonialSliderProps = {
  testimonials?: TestimonialDocument[];
  className?: string;
};

function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.min(5, Math.max(1, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < safeRating
              ? "fill-brand-pink/90 text-brand-pink"
              : "fill-pink-100 text-pink-100",
          )}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialDocument }) {
  const rating = testimonial.rating ?? 5;

  return (
    <article className="group/card relative mx-3 flex w-[min(100vw-2rem,22rem)] shrink-0 flex-col overflow-hidden rounded-2xl border border-pink-200/50 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 shadow-xl shadow-pink-500/10 ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/15 sm:w-[24rem] sm:p-7">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-brand-pink/20 to-purple-400/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-gradient-to-tr from-peacock-blue/10 to-rose-200/30 blur-2xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute right-5 top-4 font-serif text-6xl leading-none text-brand-pink/10"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <div className="relative z-10">
        <RatingStars rating={rating} />
        <blockquote className="mt-5 flex-1 font-serif text-[1.05rem] leading-[1.65] tracking-tight text-zinc-800 sm:text-lg">
          {testimonial.review}
        </blockquote>
        <footer className="mt-6 flex items-center gap-4 border-t border-pink-200/40 pt-5">
          {testimonial.imageUrl ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md shadow-pink-500/10">
              <Image
                src={testimonial.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-rose-500 font-serif text-lg font-medium text-white shadow-md shadow-pink-500/25"
              aria-hidden="true"
            >
              {testimonial.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-sans text-sm font-semibold tracking-tight text-zinc-900">
              {testimonial.name}
            </p>
            {testimonial.designation ? (
              <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {testimonial.designation}
              </p>
            ) : null}
          </div>
        </footer>
      </div>
    </article>
  );
}

function buildTestimonialMarqueeTrack(
  testimonials: TestimonialDocument[],
): TestimonialDocument[] {
  let track = [...testimonials];
  while (track.length < 4) {
    track = [...track, ...testimonials];
  }
  return [...track, ...track];
}

export function TestimonialSlider({
  testimonials = [],
  className,
}: TestimonialSliderProps) {
  const items = resolveTestimonials(testimonials);
  const marqueeTrack = buildTestimonialMarqueeTrack(items);

  return (
    <section
      className={cn(
        "w-full max-w-none overflow-hidden border-t border-zinc-100 bg-white py-16 md:py-20",
        className,
      )}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-royal-magenta">
            Client Stories
          </p>
          <h2
            id="testimonials-heading"
            className="font-serif text-3xl text-zinc-900 md:text-4xl"
          >
            What Our Clients Say
          </h2>
          <p className="mt-3 text-sm text-zinc-600 md:text-base">
            Trusted by brands, studios, and celebrations across Surat and beyond.
          </p>
        </div>
      </div>

      <div className="group relative mt-12 w-full max-w-none overflow-hidden px-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <div className="flex w-max animate-marquee-testimonials items-stretch motion-reduce:animate-none group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
          {marqueeTrack.map((item, index) => (
            <TestimonialCard
              key={`${item._id}-${index}`}
              testimonial={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
