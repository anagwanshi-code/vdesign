"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export function AdminLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  function handleLogout() {
    setIsLoading(true);
    window.location.href = "/api/admin/logout";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-[#0088A9] disabled:opacity-60"
      aria-label="Log out of admin"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      <span>{isLoading ? "Signing out…" : "Logout"}</span>
    </button>
  );
}
