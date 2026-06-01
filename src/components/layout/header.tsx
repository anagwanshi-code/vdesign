"use client";

import { ProductSearchModal } from "@/components/catalog/product-search-modal";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import { useLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Shop", href: "/shop" },
  { name: "PORTFOLIO ", href: "/portfolio" },
  { name: "Industries", href: "/industries" },
  { name: "Resources", href: "/resources" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const;

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href.startsWith("/#")) {
    return pathname === "/";
  }
  const basePath = href.split("#")[0];
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { openCart, totalQuantity } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileNavRow, setShowMobileNavRow] = useState(true);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const hideMobileNavRow =
    pathname === "/" ||
    pathname === "/contact" ||
    pathname === "/resources";

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const getThreshold = () => window.innerHeight * 0.85;
    const mobileNavCollapseOffset = 80;

    const updateScrollState = (scrollY: number) => {
      setIsScrolled(scrollY > getThreshold());
      setShowMobileNavRow(scrollY < mobileNavCollapseOffset);
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
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: CINEMATIC_EASE }}
        className={cn(
          "sticky top-0 z-50 border-b border-zinc-200/50 bg-white/75 shadow-sm backdrop-blur-lg transition-all duration-300",
          isScrolled && "shadow-md",
        )}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="flex h-20 items-center justify-between lg:h-24">
            <nav
              className="hidden flex-1 items-center gap-4 lg:flex xl:gap-5"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={link.href === "/" ? handleHomeClick : undefined}
                  className={cn(
                    "whitespace-nowrap font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-300",
                    isNavLinkActive(pathname, link.href)
                      ? "text-brand-pink"
                      : "text-zinc-800 hover:text-brand-pink",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex flex-1 justify-center lg:justify-center">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="group flex flex-col items-center"
              >
                <Image
                  src="/logo.png"
                  alt="V Design - The Printing Magician"
                  width={240}
                  height={80}
                  className="h-10 w-auto object-contain md:h-14"
                  priority
                />
              </Link>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
              <Link
                href="/consultation"
                className="hidden rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:inline-flex"
              >
                Book Consultation
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative rounded-full border border-zinc-200 p-2 text-zinc-800 transition-colors duration-300 hover:border-brand-pink hover:bg-royal-magenta/5 hover:text-brand-pink"
                aria-label={
                  totalQuantity > 0
                    ? `Open cart, ${totalQuantity} items`
                    : "Open shopping cart"
                }
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {totalQuantity > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[9px] font-bold text-white">
                    {totalQuantity > 9 ? "9+" : totalQuantity}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="text-zinc-800 transition-colors duration-300 hover:text-brand-pink"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <nav
            className={cn(
              "flex items-center gap-3 overflow-x-auto border-t border-zinc-100 py-3 transition-[max-height,opacity,padding] duration-300 lg:hidden",
              showMobileNavRow && !hideMobileNavRow
                ? "max-h-16 opacity-100"
                : "pointer-events-none max-h-0 overflow-hidden border-transparent py-0 opacity-0",
            )}
            aria-label="Mobile navigation"
            aria-hidden={!showMobileNavRow || hideMobileNavRow}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.href === "/" ? handleHomeClick : undefined}
                className={cn(
                  "shrink-0 font-sans text-[10px] uppercase tracking-[0.12em] transition-colors duration-300",
                  isNavLinkActive(pathname, link.href)
                    ? "text-brand-pink"
                    : "text-zinc-800 hover:text-brand-pink",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </motion.header>

      <ProductSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
