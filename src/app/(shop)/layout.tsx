import { ShopShell } from "@/components/layout/ShopShell";

export const revalidate = 30;

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ShopShell>{children}</ShopShell>;
}
