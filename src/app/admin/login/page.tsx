import { AdminLoginForm } from "@/components/admin/admin-login-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0088A9]">
              V Design
            </p>
            <h1 className="mt-2 font-serif text-3xl text-zinc-900">Admin access</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Sign in to manage orders and dispatch.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="h-32 animate-pulse rounded-lg bg-zinc-100" aria-hidden="true" />
            }
          >
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
