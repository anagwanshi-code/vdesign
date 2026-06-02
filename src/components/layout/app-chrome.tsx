"use client";

import { AnnouncementBarClient } from "@/components/layout/announcement-bar-client";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Header } from "@/components/layout/header";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import type { ShippingConfig } from "@/lib/checkout/shipping";
import { FALLBACK_ANNOUNCEMENTS } from "@/lib/data/announcements";
import { useCartStore } from "@/lib/store/useCartStore";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type AppChromeProps = {
  children: ReactNode;
  footer?: ReactNode;
  announcementMessages?: string[];
  shippingConfig?: ShippingConfig;
};

export function AppChrome({
  children,
  footer,
  announcementMessages = [...FALLBACK_ANNOUNCEMENTS],
  shippingConfig,
}: AppChromeProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");
  const isAdminRoute = pathname.startsWith("/admin");
  const setShippingConfig = useCartStore((state) => state.setShippingConfig);

  useEffect(() => {
    if (shippingConfig) {
      setShippingConfig(shippingConfig);
    }
  }, [shippingConfig, setShippingConfig]);

  if (isStudioRoute || isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <AnnouncementBarClient messages={announcementMessages} />
      <Header />
      <div className="flex min-h-screen flex-1 flex-col pt-0">
        <CartDrawer />
        <main className="relative z-0 flex flex-1 flex-col pt-0">
          {children}
        </main>
        {footer}
      </div>
    </SmoothScroll>
  );
}
