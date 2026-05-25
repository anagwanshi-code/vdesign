import { ShopShell } from "@/components/layout/ShopShell";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ShopShell>{children}</ShopShell>;
}
