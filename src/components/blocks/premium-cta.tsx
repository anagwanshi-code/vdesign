import Link from "next/link";

type PremiumCtaProps = {
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
};

export function PremiumCta({
  title = "Ready to Build a Premium Brand?",
  description = "Let's create something extraordinary together.",
  href = "/consultation",
  buttonLabel = "Book a Free Consultation →",
}: PremiumCtaProps) {
  return (
    <section
      className="relative w-full overflow-hidden px-6 py-24"
      aria-labelledby="premium-cta-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#D91E63]/90 to-[#0088A9]/90"
        aria-hidden="true"
      />

      <div
        className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-peacock-blue/40 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-royal-magenta/50 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron-gold/20 opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2
          id="premium-cta-heading"
          className="mb-6 font-serif text-4xl text-white md:text-6xl"
        >
          {title}
        </h2>
        <p className="mb-10 text-xl text-white/80">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center rounded-full bg-white px-8 py-4 font-bold text-royal-magenta shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
