"use client";

import {
  DESKTOP_NAV_ITEMS,
  isHeaderDropdownActive,
  isHeaderNavLinkActive,
  type HeaderNavDropdown,
  type HeaderNavItem,
  type HeaderNavLink,
} from "@/lib/navigation/header-nav";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const navTriggerClass =
  "inline-flex items-center gap-1.5 whitespace-nowrap font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-300";

const submenuLinkClass =
  "block px-5 py-2.5 font-sans text-sm tracking-wide text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-brand-pink";

type HeaderDesktopNavProps = {
  pathname: string;
};

function NavDropdownMenu({
  dropdown,
  pathname,
}: {
  dropdown: HeaderNavDropdown;
  pathname: string;
}) {
  const isActive = isHeaderDropdownActive(pathname, dropdown.items);

  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(
          navTriggerClass,
          isActive ? "text-brand-pink" : "text-zinc-800 hover:text-brand-pink",
        )}
        aria-haspopup="menu"
        aria-expanded="false"
      >
        {dropdown.label}
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <div
        role="menu"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 pt-3",
          "opacity-0 translate-y-2 transition-all duration-300 ease-out",
          "group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0",
          "group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0",
        )}
      >
        <div className="overflow-hidden rounded-xl border border-zinc-100/80 bg-white/95 py-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-zinc-900/5 backdrop-blur-sm">
          {dropdown.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={cn(
                submenuLinkClass,
                isHeaderNavLinkActive(pathname, item.href) &&
                  "bg-royal-magenta/5 font-medium text-brand-pink",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavStandaloneLink({
  name,
  href,
  pathname,
}: HeaderNavLink & { pathname: string }) {
  const isShop = name === "Shop";

  return (
    <Link
      href={href}
      className={cn(
        navTriggerClass,
        isShop
          ? "font-semibold text-brand-pink hover:text-royal-magenta"
          : isHeaderNavLinkActive(pathname, href)
            ? "text-brand-pink"
            : "text-zinc-800 hover:text-brand-pink",
      )}
    >
      {name}
    </Link>
  );
}

function renderNavItem(item: HeaderNavItem, pathname: string) {
  if (item.type === "dropdown") {
    return (
      <NavDropdownMenu key={item.label} dropdown={item} pathname={pathname} />
    );
  }
  return (
    <NavStandaloneLink
      key={item.href}
      name={item.name}
      href={item.href}
      pathname={pathname}
    />
  );
}

export function HeaderDesktopNav({ pathname }: HeaderDesktopNavProps) {
  return (
    <nav
      className="flex min-w-0 flex-[2] items-center justify-center gap-8"
      aria-label="Main navigation"
    >
      {DESKTOP_NAV_ITEMS.map((item) => renderNavItem(item, pathname))}
    </nav>
  );
}
