"use client";

import { ProductSearchModal } from "@/components/catalog/product-search-modal";
import { HeaderDesktopNav } from "@/components/layout/header-desktop-nav";
import { useCart } from "@/hooks/use-cart";
import {
  isHeaderNavLinkActive,
  MOBILE_NAV_LINKS,
} from "@/lib/navigation/header-nav";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

function CartButton({
  onClick,
  totalQuantity,
  className,
}: {
  onClick: () => void;
  totalQuantity: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-800 transition-colors hover:border-brand-pink hover:bg-royal-magenta/5 hover:text-brand-pink",
        className,
      )}
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
  );
}

function SearchButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center text-zinc-800 transition-colors hover:text-brand-pink",
        className,
      )}
      aria-label="Open search"
    >
      <Search className="h-5 w-5" strokeWidth={1.5} />
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const { openCart, totalQuantity } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const openMobileMenu = () => setMobileMenuOpen(true);

  useEffect(() => {
    const getThreshold = () => window.innerHeight * 0.85;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > getThreshold());
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: CINEMATIC_EASE }}
        className={cn(
          "sticky top-0 z-50 border-b border-zinc-200/50 bg-white/75 shadow-sm backdrop-blur-lg transition-shadow duration-300",
          isScrolled && "shadow-md",
        )}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-12">
          {/* Mobile: 3 equal columns */}
          <div className="grid h-20 grid-cols-3 items-center md:hidden">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={openMobileMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-800 transition-colors hover:border-brand-pink hover:text-brand-pink"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex justify-center px-2">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="flex max-w-full items-center justify-center"
              >
                <Image
                  src="/logo.png"
                  alt="V Design - The Printing Magician"
                  width={240}
                  height={80}
                  className="h-9 w-auto max-w-full object-contain sm:h-10"
                  priority
                  sizes="(max-width: 768px) 176px, 240px"
                />
              </Link>
            </div>

            <div className="flex items-center justify-end gap-3">
              <CartButton onClick={openCart} totalQuantity={totalQuantity} />
              <SearchButton onClick={() => setSearchModalOpen(true)} />
            </div>
          </div>

          {/* Desktop: logo left · nav center · actions right */}
          <div className="hidden h-20 min-w-0 items-stretch gap-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:items-center lg:h-24 lg:gap-6">
            <div className="flex min-w-0 flex-1 items-center justify-start">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="inline-flex shrink-0 items-center"
              >
                <Image
                  src="/logo.png"
                  alt="V Design - The Printing Magician"
                  width={240}
                  height={80}
                  className="h-11 w-auto max-w-[11rem] object-contain lg:h-14 lg:max-w-none"
                  priority
                  sizes="240px"
                />
              </Link>
            </div>

            <HeaderDesktopNav pathname={pathname} />

            <div className="flex min-w-0 flex-1 items-center justify-end gap-3 lg:gap-4">
              <Link
                href="/consultation"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-xs font-medium leading-none text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl lg:px-6 lg:text-sm"
              >
                Book Consultation
              </Link>
              <CartButton onClick={openCart} totalQuantity={totalQuantity} />
              <SearchButton onClick={() => setSearchModalOpen(true)} />
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-zinc-900/40 md:hidden"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <motion.nav
              key="mobile-nav-panel"
              id="mobile-nav-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[min(100%,20rem)] flex-col overflow-y-auto border-r border-zinc-200 bg-white px-6 py-8 shadow-xl md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-pink">
                  Menu
                </p>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {MOBILE_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "block rounded-lg px-3 py-3 font-sans text-sm uppercase tracking-[0.12em] transition-colors",
                        isHeaderNavLinkActive(pathname, link.href)
                          ? "bg-royal-magenta/5 text-brand-pink"
                          : "text-zinc-800 hover:bg-zinc-50 hover:text-brand-pink",
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/consultation"
                onClick={closeMobileMenu}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-medium text-white shadow-md"
              >
                Book Consultation
              </Link>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      <ProductSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
