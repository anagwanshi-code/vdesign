export type HeaderNavLink = {
  name: string;
  href: string;
};

export type HeaderNavDropdown = {
  type: "dropdown";
  label: string;
  items: HeaderNavLink[];
};

export type HeaderNavStandalone = {
  type: "link";
  name: string;
  href: string;
};

export type HeaderNavItem = HeaderNavDropdown | HeaderNavStandalone;

/** Desktop top-level nav — compact dropdowns + standalone links (Home via logo only). */
export const DESKTOP_NAV_ITEMS: HeaderNavItem[] = [
  {
    type: "dropdown",
    label: "Studio",
    items: [
      { name: "About Us", href: "/about" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "Resources", href: "/resources" },
    ],
  },
  {
    type: "dropdown",
    label: "Expertise",
    items: [
      { name: "Services", href: "/services" },
      { name: "Products", href: "/products" },
      { name: "Industries", href: "/industries" },
    ],
  },
  { type: "link", name: "Shop", href: "/shop" },
  { type: "link", name: "Contact", href: "/contact" },
];

/** Flat list for mobile sheet — all destinations, no Home. */
export const MOBILE_NAV_LINKS: HeaderNavLink[] = [
  { name: "About Us", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Resources", href: "/resources" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Industries", href: "/industries" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" },
];

export function isHeaderNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  const basePath = href.split("#")[0];
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function isHeaderDropdownActive(
  pathname: string,
  items: HeaderNavLink[],
): boolean {
  return items.some((item) => isHeaderNavLinkActive(pathname, item.href));
}
