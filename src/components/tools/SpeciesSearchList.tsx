"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface SearchItem {
  href: string;
  name: string;
  sub: string;
  synonyms: string[];
  badges: string[];
}

// Renders the full species list (so SSR HTML keeps every item for SEO) plus a
// client-side live filter by common name, scientific name, or synonym.
export function SpeciesSearchList({
  items,
  placeholder,
}: {
  items: SearchItem[];
  placeholder: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(query) ||
        it.sub.toLowerCase().includes(query) ||
        it.synonyms.some((s) => s.toLowerCase().includes(query)),
    );
  }, [q, items]);

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border-2 border-leaf-100 bg-white px-4 py-3 text-leaf-950 placeholder:text-leaf-900/40 focus:border-leaf-400 focus:outline-none"
      />
      <p className="mt-2 text-sm text-leaf-900/50" aria-live="polite">
        {q.trim()
          ? `${filtered.length} of ${items.length} species`
          : `${items.length} species`}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-leaf-200 p-8 text-center text-leaf-900/60">
          No species match “{q.trim()}”. Try a common or scientific name.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {filtered.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className="block h-full rounded-xl border border-leaf-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-md"
              >
                <span className="block font-bold text-leaf-950">{it.name}</span>
                <span className="block text-sm italic text-leaf-900/50">{it.sub}</span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {it.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-leaf-100 px-2.5 py-0.5 text-xs font-medium text-leaf-800"
                    >
                      {b}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
