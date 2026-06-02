"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get("from") ?? "/admin/orders";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      router.replace(redirectTo.startsWith("/admin") ? redirectTo : "/admin/orders");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isLoading}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={cn(
              "w-full rounded-lg border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors",
              "placeholder:text-zinc-400 focus:border-[#0088A9] focus:ring-2 focus:ring-[#0088A9]/20",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
            placeholder="Enter admin password"
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading || !password.trim()}
        className="w-full bg-[#0088A9] hover:bg-[#007799] focus-visible:ring-[#0088A9]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
