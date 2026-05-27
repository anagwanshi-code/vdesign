"use client";

import type { ProductShowcaseItem } from "@/types/home";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const TRENDING_TERMS = ["Royal Peacock Box", "Stationery", "Corporate"] as const;

type ProductSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProductSearchModal({ isOpen, onClose }: ProductSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<ProductShowcaseItem[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);

  const runSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      setFilteredResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(trimmed)}`,
      );
      const payload = (await response.json()) as {
        products?: ProductShowcaseItem[];
      };
      setFilteredResults(payload.products ?? []);
    } catch {
      setFilteredResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      setFilteredResults([]);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void runSearch(searchQuery);
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [isOpen, searchQuery, runSearch]);

  const hasQuery = Boolean(searchQuery.trim());

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background/95 backdrop-blur-md"
        >
          <div className="sticky top-0 z-10 flex h-24 items-center justify-between border-b border-border/50 bg-background/95 p-6 md:px-12">
            <span className="font-serif text-2xl tracking-widest text-foreground">
              SEARCH
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-border/40"
              aria-label="Close search"
            >
              <X className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-grow flex-col items-center px-6 pb-24 pt-12">
            <div className="relative w-full max-w-3xl">
              <Search
                className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 text-muted"
                strokeWidth={1}
                aria-hidden="true"
              />
              <input
                type="search"
                autoFocus
                placeholder="Search for luxury packaging…"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full border-b-2 border-border/50 bg-transparent pb-4 pl-12 font-serif text-3xl text-foreground transition-colors placeholder:text-muted/50 focus:border-saffron focus:outline-none md:text-5xl"
              />
            </div>

            {!hasQuery ? (
              <div className="mt-12 flex w-full max-w-3xl flex-wrap gap-4">
                <span className="mr-4 mt-2 font-sans text-xs uppercase tracking-widest text-muted">
                  Trending:
                </span>
                {TRENDING_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full border border-border/50 px-4 py-2 font-sans text-sm text-foreground transition-colors hover:border-saffron hover:text-saffron"
                  >
                    {term}
                  </button>
                ))}
              </div>
            ) : null}

            {hasQuery ? (
              <div className="mt-16 w-full max-w-5xl">
                <h4 className="mb-8 border-b border-border/50 pb-4 font-sans text-xs uppercase tracking-widest text-muted">
                  {isSearching
                    ? "Searching…"
                    : `${filteredResults.length} Results Found`}
                </h4>

                {!isSearching && filteredResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                    {filteredResults.map((product) => (
                      <Link
                        href={`/products/${product.handle}`}
                        key={product.id}
                        onClick={onClose}
                        className="group flex flex-col"
                      >
                        <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-sm border border-border bg-border/30">
                          <Image
                            src={product.image.src}
                            alt={product.image.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <h5 className="font-serif text-lg text-foreground transition-colors group-hover:text-saffron">
                          {product.title}
                        </h5>
                        <span className="mt-1 font-sans text-xs uppercase tracking-widest text-muted">
                          {product.priceLabel}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {!isSearching && filteredResults.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="mb-2 font-serif text-2xl text-foreground">
                      No results found for &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="font-sans text-muted">
                      Try checking your spelling or using more general terms.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
