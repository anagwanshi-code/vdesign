"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function ResourcesSearch() {
  const [query, setQuery] = useState("");

  return (
    <form
      className="relative max-w-xl"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor="resources-search" className="sr-only">
        Search articles and guides
      </label>
      <input
        id="resources-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search articles, guides & more..."
        className="w-full rounded-full border border-zinc-200 bg-white py-3.5 pl-5 pr-14 text-sm text-luxury-text outline-none transition-colors focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-pink-600 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm transition-transform hover:scale-105"
        aria-label="Search resources"
      >
        <Search className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
    </form>
  );
}
