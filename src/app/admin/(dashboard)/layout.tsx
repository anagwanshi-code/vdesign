import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0088A9]">
              V Design · Admin
            </p>
            <h1 className="font-serif text-xl text-zinc-900">Operations</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <Link href="/admin/orders" className="hover:text-[#0088A9]">
              Orders
            </Link>
            <Link href="/" className="hover:text-[#0088A9]">
              View site
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
