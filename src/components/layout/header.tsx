"use client";

import { ProductSearchModal } from "@/components/catalog/product-search-modal";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import { useLenis } from "@studio-freight/react-lenis";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const NAV_LINKS = [
  { name: "Collections", href: "/collections", hasMegaMenu: true },
  { name: "Work", href: "/work", hasMegaMenu: false },
  { name: "About", href: "/about", hasMegaMenu: false },
  { name: "Studio", href: "/atelier", hasMegaMenu: true },
] as const;

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { openCart, totalQuantity } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const getThreshold = () => window.innerHeight * 0.85;

    const updateScrollState = (scrollY: number) => {
      setIsScrolled(scrollY > getThreshold());
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
          "fixed left-0 right-0 top-0 z-40 transition-colors duration-500",
          isScrolled || activeMenu
            ? "border-b border-border/50 bg-background/95 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-6 md:px-12">
          <nav className="hidden flex-1 items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <div
                key={link.name}
                onMouseEnter={() => link.hasMegaMenu && setActiveMenu(link.name)}
                className="flex h-full cursor-pointer items-center py-8"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-300",
                    pathname === link.href || pathname.startsWith(`${link.href}/`)
                      ? "text-saffron"
                      : "text-foreground hover:text-saffron",
                  )}
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex flex-1 justify-center lg:justify-center">
            <Link href="/" className="group flex flex-col items-center">
              <span className="font-serif text-3xl tracking-widest text-foreground transition-colors duration-300 md:text-4xl">
                V DESIGN
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="text-foreground transition-colors duration-300 hover:text-saffron"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative text-foreground transition-colors duration-300 hover:text-saffron"
              aria-label={
                totalQuantity > 0
                  ? `Open cart, ${totalQuantity} items`
                  : "Open cart"
              }
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalQuantity > 0 ? (
                <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[9px] font-bold text-surface">
                  {totalQuantity > 9 ? "9+" : totalQuantity}
                </span>
              ) : null}
            </button>

            <Link
              href="/collections"
              className="text-foreground transition-colors duration-300 hover:text-saffron lg:hidden"
              aria-label="Shop"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: CINEMATIC_EASE }}
              className="absolute left-0 top-full w-full overflow-hidden border-b border-border bg-background shadow-lift"
            >
              <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-12 py-16">
                <div className="col-span-4 flex flex-col gap-4">
                  <h3 className="mb-4 font-serif text-2xl text-foreground">
                    {activeMenu === "Collections"
                      ? "Curated Collections"
                      : "Our Expertise"}
                  </h3>
                  {activeMenu === "Collections" ? (
                    <>
                      <Link
                        href="/collections"
                        className="font-sans text-sm text-muted transition-colors hover:text-saffron"
                      >
                        View All Collections
                      </Link>
                      <Link
                        href="/collections"
                        className="font-sans text-sm text-muted transition-colors hover:text-saffron"
                      >
                        Luxury Packaging
                      </Link>
                      <Link
                        href="/collections"
                        className="mt-4 font-sans text-sm text-foreground underline transition-colors hover:text-saffron"
                      >
                        Shop the Edit
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/atelier"
                        className="font-sans text-sm text-muted transition-colors hover:text-saffron"
                      >
                        Atelier & Craft
                      </Link>
                      <Link
                        href="/work"
                        className="font-sans text-sm text-muted transition-colors hover:text-saffron"
                      >
                        Portfolio
                      </Link>
                      <Link
                        href="/about"
                        className="font-sans text-sm text-muted transition-colors hover:text-saffron"
                      >
                        About V Design
                      </Link>
                    </>
                  )}
                </div>
                <div className="group col-span-4 cursor-pointer">
                  <Link href="/collections">
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-sm bg-border/30">
                      <div className="h-full w-full bg-muted/20 transition-transform duration-700 ease-out group-hover:scale-105" />
                    </div>
                    <p className="font-serif text-lg text-foreground">
                      Curated Collection
                    </p>
                    <p className="mt-1 font-sans text-xs uppercase tracking-widest text-muted">
                      Discover
                    </p>
                  </Link>
                </div>
                <div className="group col-span-4 cursor-pointer">
                  <Link href="/atelier">
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-sm bg-border/30">
                      <div className="h-full w-full bg-muted/20 transition-transform duration-700 ease-out group-hover:scale-105" />
                    </div>
                    <p className="font-serif text-lg text-foreground">
                      Bespoke Studio
                    </p>
                    <p className="mt-1 font-sans text-xs uppercase tracking-widest text-muted">
                      Explore
                    </p>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <ProductSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
