"use client";

import { AnnouncementBarClient } from "@/components/layout/announcement-bar-client";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/components/providers/cart-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { FALLBACK_ANNOUNCEMENTS } from "@/lib/data/announcements";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppChromeProps = {
  children: ReactNode;
  footer?: ReactNode;
  announcementMessages?: string[];
};

export function AppChrome({
  children,
  footer,
  announcementMessages = [...FALLBACK_ANNOUNCEMENTS],
}: AppChromeProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isStudioRoute || isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
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
    </CartProvider>
  );
}
