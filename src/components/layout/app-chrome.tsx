"use client";

import { CartDrawer } from "@/components/layout/cart-drawer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/components/providers/cart-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppChromeProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function AppChrome({ children, footer }: AppChromeProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <SmoothScroll>
        {/* Inside Lenis so scroll-driven header state matches smooth-scroll position */}
        <Header />
        <div className="flex min-h-screen flex-1 flex-col pt-0">
          <CartDrawer />
          <main className="relative z-0 flex flex-1 flex-col pt-0">
            {children}
          </main>
          {footer}
        </div>
      </SmoothScroll>
    </CartProvider>
  );
}
