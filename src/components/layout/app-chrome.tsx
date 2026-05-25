"use client";

import { CartDrawer } from "@/components/layout/cart-drawer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/components/providers/cart-provider";
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
    <CartProvider>
      <Header />
      <CartDrawer />
      {children}
    </CartProvider>
  );
}
