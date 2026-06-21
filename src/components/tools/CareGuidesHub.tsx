"use client";

import { useMemo, useState } from "react";

export interface HubGuide {
  title: string;
  href: string;
  blurb?: string;
  image?: string;
}
export interface HubCategory {
  id: string;
  title: string;
  blurb?: string;
  guides: HubGuide[];
}

// The full guide index is rendered server-side (every card is in the initial
// HTML for SEO); this client layer adds a live filter by title. Cards link OUT
// to the existing Shopify guides — those convert and are never redirected.
export function CareGuidesHub({
  categories,
  plantReference,
}: {
  categories: HubCategory[];
  plantReference: HubCategory;
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const match = (g: HubGuide) =>
    !query ||
    g.title.toLowerCase().includes(query) ||
    (g.blurb?.toLowerCase().includes(query) ?? false);

  const total =
    categories.reduce((n, c) => n + c.guides.length, 0) +
    plantReference.guides.length;

  const shownCats = useMemo(
    () =>
      categories
        .map((c) => ({ ...c, guides: c.guides.filter(match) }))
        .filter((c) => c.guides.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );
  const shownPlants = plantReference.guides.filter(match);
  const shownCount =
    shownCats.reduce((n, c) => n + c.guides.length, 0) + shownPlants.length;

  return (
    <div>
      {/* Search */}
      <div className="sticky top-0 z-10 -mx-4 mb-10 border-b border-leaf-100 bg-leaf-50/80 px-4 py-4 backdrop-blur">
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="currentColor"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-leaf-400"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 3.4 9.83l3.63 3.64a1 1 0 0 0 1.42-1.42l-3.64-3.63A5.5 5.5 0 0 0 9 3.5ZM5.5 9a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search care guides — snail, betta, java fern, algae…"
            aria-label="Search care guides"
            className="w-full rounded-full border-2 border-leaf-200 bg-white py-3 pl-12 pr-4 text-leaf-950 shadow-sm placeholder:text-leaf-400 focus:border-leaf-500 focus:outline-none"
          />
        </div>
        <p className="mt-2 px-1 text-sm text-leaf-700" aria-live="polite">
          {query ? `${shownCount} of ${total} guides` : `${total} care guides`}
        </p>
      </div>

      {shownCount === 0 && (
        <p className="rounded-2xl border border-dashed border-leaf-200 bg-white p-10 text-center text-leaf-700">
          No guides match “{q.trim()}”. Try a species or topic — e.g.{" "}
          <em>nerite</em>, <em>betta</em>, <em>CO2</em>.
        </p>
      )}

      {/* Featured / editorial guide categories */}
      {shownCats.map((cat) => (
        <section key={cat.id} aria-labelledby={cat.id} className="mb-14">
          <h2
            id={cat.id}
            className="text-2xl font-bold tracking-tight text-leaf-900"
          >
            {cat.title}
          </h2>
          {cat.blurb && (
            <p className="mt-1 max-w-3xl text-leaf-700/80">{cat.blurb}</p>
          )}
          <ul className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {cat.guides.map((g) => (
              <li key={g.href}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Plant care reference — compact directory */}
      {shownPlants.length > 0 && (
        <section
          aria-labelledby="plant-reference"
          className="mb-6 rounded-3xl bg-leaf-50 p-6 sm:p-8"
        >
          <h2
            id="plant-reference"
            className="text-2xl font-bold tracking-tight text-leaf-900"
          >
            {plantReference.title}
          </h2>
          {plantReference.blurb && (
            <p className="mt-1 max-w-3xl text-leaf-700/80">
              {plantReference.blurb}
            </p>
          )}
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shownPlants.map((g) => (
              <li key={g.href}>
                <a
                  href={g.href}
                  className="group flex items-center gap-2 rounded-xl border-l-4 border-gold-400 bg-white px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex-1 text-sm font-semibold text-leaf-900">
                    {g.title}
                  </span>
                  <span
                    aria-hidden
                    className="text-leaf-300 transition-colors group-hover:text-leaf-600"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function GuideCard({ guide }: { guide: HubGuide }) {
  return (
    <a
      href={guide.href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e0e0e0] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-leaf-400 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-leaf-50">
        {guide.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={guide.image}
            alt={guide.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-leaf-600 via-leaf-500 to-leaf-700 p-4">
            <span className="text-center text-sm font-bold leading-snug text-white/95">
              {guide.title}
            </span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-950 shadow">
          Guide
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-snug text-leaf-900">
          {guide.title}
        </h3>
        {guide.blurb && (
          <p className="mt-1 line-clamp-2 text-xs text-leaf-700/75">
            {guide.blurb}
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-leaf-600 transition-colors group-hover:text-leaf-800">
          Read guide
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
