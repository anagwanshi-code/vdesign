const TRUST_STATS = [
  { value: "18+", label: "Years Experience" },
  { value: "5000+", label: "Projects Delivered" },
  { value: "100+", label: "Business Partners" },
  { value: "25+", label: "Awards & Recognition" },
] as const;

const TRUSTED_BRANDS = ["Kasturi", "Maharaja", "Senorita", "V Design Partners"] as const;

export function TrustStrip() {
  return (
    <section
      className="w-full border-y border-luxury-border bg-white py-12"
      aria-label="Trust and credentials"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-luxury-muted">
          Trusted by Growing Brands
        </p>

        <ul className="mb-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TRUSTED_BRANDS.map((brand) => (
            <li
              key={brand}
              className="font-serif text-lg tracking-wide text-luxury-text/70 transition-colors hover:text-royal-magenta"
            >
              {brand}
            </li>
          ))}
        </ul>

        <ul className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <li key={stat.label}>
              <p className="mb-1 font-serif text-3xl text-royal-magenta">
                {stat.value}
              </p>
              <p className="text-xs font-medium uppercase tracking-widest text-luxury-muted">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
