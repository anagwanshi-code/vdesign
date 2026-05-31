import Link from "next/link";

export function ProductsCta() {
  return (
    <section className="mx-auto max-w-7xl px-6" aria-labelledby="products-cta-heading">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-royal-magenta to-peacock-blue p-10 shadow-lg">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-saffron-gold/20 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 opacity-40"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <h2
              id="products-cta-heading"
              className="mb-2 font-serif text-3xl text-white"
            >
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-sm text-white/80">
              Tell us your vision—we&apos;ll design and produce a bespoke solution
              tailored to your brand or celebration.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-royal-magenta shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book Consultation
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
