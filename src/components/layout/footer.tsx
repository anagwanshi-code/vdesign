import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background px-6 pb-12 pt-24 md:px-12 lg:px-24">
      <div className="mx-auto mb-24 flex max-w-[1440px] flex-col items-start justify-between gap-12 md:flex-row">
        <div className="max-w-sm">
          <h2 className="mb-6 font-serif text-3xl tracking-widest text-foreground">
            V DESIGN
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted">
            Elevating brands through luxury packaging, bespoke wedding stationery,
            and cinematic visual identities.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-foreground">
              Explore
            </h3>
            <Link
              href="/collections"
              className="font-sans text-sm text-muted transition-colors hover:text-saffron"
            >
              Shop
            </Link>
            <Link
              href="/atelier"
              className="font-sans text-sm text-muted transition-colors hover:text-saffron"
            >
              Services
            </Link>
            <Link
              href="/work"
              className="font-sans text-sm text-muted transition-colors hover:text-saffron"
            >
              Portfolio
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-foreground">
              Connect
            </h3>
            <Link
              href="/about"
              className="font-sans text-sm text-muted transition-colors hover:text-saffron"
            >
              Contact
            </Link>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted transition-colors hover:text-saffron"
            >
              Instagram
            </a>
            <a
              href="https://www.behance.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted transition-colors hover:text-saffron"
            >
              Behance
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between border-t border-border/50 pt-8 md:flex-row">
        <p className="font-sans text-xs text-muted">
          &copy; {new Date().getFullYear()} V Design. All rights reserved.
        </p>
        <div className="mt-4 flex items-center gap-6 md:mt-0">
          <Link
            href="/about"
            className="font-sans text-xs text-muted transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/about"
            className="font-sans text-xs text-muted transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/studio"
            className="font-sans text-xs text-muted/40 transition-colors hover:text-foreground"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
