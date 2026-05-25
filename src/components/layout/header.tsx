"use client";

import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import { useLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/atelier" },
] as const;

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { openCart, totalQuantity } = useCart();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const getThreshold = () => window.innerHeight * 0.85;

    const updateScrollState = (scrollY: number) => {
      setScrolledPastHero(scrollY > getThreshold());
    };

    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => {
        updateScrollState(scroll);
      };

      updateScrollState(lenis.scroll);
      lenis.on("scroll", onScroll);

      return () => {
        lenis.off("scroll", onScroll);
      };
    }

    const onWindowScroll = () => {
      updateScrollState(window.scrollY);
    };

    onWindowScroll();
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, [lenis]);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b",
        scrolledPastHero
          ? "border-border bg-surface/95 backdrop-blur-sm"
          : "border-transparent bg-transparent",
      )}
      animate={{
        backgroundColor: scrolledPastHero
          ? "hsl(24 100% 97% / 0.95)"
          : "hsl(24 100% 97% / 0)",
      }}
      transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
    >
      <div className="mx-auto grid h-16 max-w-content grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 lg:px-20">
        <div className="justify-self-start">
          <Link
            href="/"
            className="font-serif text-body-lg tracking-[0.18em] text-text-primary transition-colors duration-base ease-luxury hover:text-peacock"
          >
            V DESIGN
          </Link>
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden justify-self-center md:flex md:items-center md:gap-8"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-caption font-sans uppercase tracking-[0.14em] transition-colors duration-base ease-luxury",
                  isActive
                    ? "text-peacock"
                    : "text-text-muted hover:text-text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <nav
            aria-label="Mobile navigation"
            className="flex items-center gap-4 md:hidden"
          >
            <Link
              href="/collections"
              className="text-caption uppercase tracking-[0.14em] text-text-muted"
            >
              Shop
            </Link>
          </nav>

          <button
            type="button"
            aria-label={
              totalQuantity > 0
                ? `Open shopping bag, ${totalQuantity} items`
                : "Open shopping bag"
            }
            onClick={openCart}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-primary transition-colors duration-base ease-luxury hover:border-peacock hover:text-peacock focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {totalQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-medium tabular-nums text-surface">
                {totalQuantity > 9 ? "9+" : totalQuantity}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
