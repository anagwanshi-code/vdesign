"use client";

import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/components/providers/cart-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppChromeProps = {
  children: ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="relative z-10 flex grow flex-col">{children}</main>
          <Footer />
        </CartProvider>
      </div>
    </SmoothScroll>
  );
}
