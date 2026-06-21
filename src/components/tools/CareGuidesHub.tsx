"use client";

import { useMemo, useState } from "react";

export interface HubGuide {
  title: string;
  href: string;
  image: string;
  alt: string;
  shopHref: string;
}
export interface HubCategory {
  id: string;
  title: string;
  blurb: string;
  guides: HubGuide[];
}

// Every guide is rendered server-side (full grid is in the initial HTML for SEO
// and internal linking); this client layer only adds a live title filter.
export function CareGuidesHub({ categories }: { categories: HubCategory[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const total = categories.reduce((n, c) => n + c.guides.length, 0);

  const shown = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          guides: query
            ? c.guides.filter((g) => g.title.toLowerCase().includes(query))
            : c.guides,
        }))
        .filter((c) => c.guides.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );
  const shownCount = shown.reduce((n, c) => n + c.guides.length, 0);

  return (
    <div>
      {/* Search */}
      <div className="sticky top-0 z-10 -mx-4 mb-10 border-b border-leaf-100 bg-white/90 px-4 py-4 backdrop-blur">
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
            placeholder="Search care guides — nerite, betta, CO2, algae, monte carlo…"
            aria-label="Search care guides"
            className="w-full rounded-full border-2 border-leaf-200 bg-white py-3 pl-12 pr-4 text-base text-leaf-950 shadow-sm placeholder:text-leaf-400 focus:border-leaf-500 focus:outline-none"
          />
        </div>
        <p className="mt-2 px-1 text-sm text-leaf-700" aria-live="polite">
          {query ? `${shownCount} of ${total} guides` : `${total} care guides`}
        </p>
      </div>

      {shownCount === 0 ? (
        <p className="rounded-2xl border border-dashed border-leaf-200 bg-white p-10 text-center text-leaf-700">
          No guides match “{q.trim()}”. Try a species or topic — e.g.{" "}
          <em>nerite</em>, <em>betta</em>, <em>CO2</em>.
        </p>
      ) : (
        <div className="space-y-14">
          {shown.map((cat) => (
            <section key={cat.id} aria-labelledby={cat.id}>
              <h2
                id={cat.id}
                className="text-2xl font-bold tracking-tight text-leaf-900"
              >
                {cat.title}
              </h2>
              <p className="mt-1 max-w-3xl text-leaf-700/80">{cat.blurb}</p>
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {cat.guides.map((g) => (
                  <li key={g.href}>
                    <GuideCard guide={g} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// The single card used for EVERY guide — identical structure and sizing so the
// grid stays uniform. Image links to the care guide; a separate Shop link goes
// to the matching collection (commercial vs. informational intent split).
function GuideCard({ guide }: { guide: HubGuide }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-leaf-400 hover:shadow-lg">
      <a href={guide.href} className="relative block aspect-square overflow-hidden bg-leaf-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.image}
          alt={guide.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-950 shadow">
          Guide
        </span>
      </a>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-snug text-leaf-900">
          <a href={guide.href} className="hover:text-leaf-600">
            {guide.title}
          </a>
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <a
            href={guide.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-600 hover:text-leaf-800"
          >
            Read guide
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={guide.shopHref}
            className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-800 ring-1 ring-inset ring-leaf-200 transition-colors hover:bg-gold-400 hover:text-leaf-950 hover:ring-gold-400"
          >
            Shop
          </a>
        </div>
      </div>
    </article>
  );
}
