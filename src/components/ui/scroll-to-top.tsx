"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { cn } from "@/lib/utils/cn";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const pathname = usePathname();
  const isCheckout = pathname?.startsWith("/checkout");

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!isVisible || isCartOpen || isCheckout) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-8 right-8 z-40 rounded-full bg-royal-magenta p-3 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-peacock-blue",
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" strokeWidth={2} />
    </button>
  );
}
