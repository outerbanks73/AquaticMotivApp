"use client";

import { useMemo, useState } from "react";
import { GuideCard, GuideCardGrid, type HubGuide } from "./GuideCard";

export type { HubGuide };

export interface BrowseChip {
  label: string;
  href: string;
}

// A meta-collection is one of the three top-level spines (Plant Care · Critter
// Care · Tank Setup). The hub shows a compact banner + a FEW featured cards +
// "See all" — the full list lives on the category page at `seeAllHref`, so the
// landing stays fixed-size as the library grows toward 500. `guides` carries the
// complete list purely so search can span everything from the hub.
export interface MetaCategory {
  id: string;
  title: string;
  tagline: string;
  image: string;
  seeAllHref: string;
  seeAllLabel: string;
  countLabel: string;
  chips: BrowseChip[];
  featured: HubGuide[];
  guides: HubGuide[];
}

export function CareGuidesLaunchpad({ metas }: { metas: MetaCategory[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const total = metas.reduce((n, m) => n + m.guides.length, 0);

  const results = useMemo(
    () =>
      query
        ? metas.map((m) => ({
            ...m,
            matches: m.guides.filter((g) =>
              g.title.toLowerCase().includes(query),
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );
  const shownCount = results.reduce((n, m) => n + m.matches.length, 0);

  return (
    <div>
      {/* ── Search — sticky launchpad bar ─────────────────────────────── */}
      <div className="sticky top-0 z-20 -mx-4 mb-12 border-b border-leaf-100 bg-white/90 px-4 py-4 backdrop-blur">
        <div className="relative mx-auto max-w-3xl">
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
            placeholder="Search every guide — nerite, betta, CO₂, algae, monte carlo…"
            aria-label="Search care guides"
            className="w-full rounded-full border-2 border-leaf-200 bg-white py-3 pl-12 pr-4 text-base text-leaf-950 shadow-sm placeholder:text-leaf-400 focus:border-leaf-500 focus:outline-none"
          />
          <p
            className="mt-2 px-1 text-center text-sm text-leaf-700"
            aria-live="polite"
          >
            {query
              ? `${shownCount} of ${total} guides match`
              : `${total} care guides across 3 collections`}
          </p>
        </div>
      </div>

      {query ? (
        /* ── Search results — flat across all collections ─────────────── */
        shownCount === 0 ? (
          <p className="rounded-2xl border border-dashed border-leaf-200 bg-white p-10 text-center text-leaf-700">
            No guides match “{q.trim()}”. Try a species or topic — e.g.{" "}
            <em>nerite</em>, <em>betta</em>, <em>CO₂</em>.
          </p>
        ) : (
          <div className="space-y-12">
            {results.map((m) =>
              m.matches.length === 0 ? null : (
                <section key={m.id} aria-labelledby={`r-${m.id}`}>
                  <h2
                    id={`r-${m.id}`}
                    className="mb-5 text-lg font-bold text-leaf-900"
                  >
                    {m.title}{" "}
                    <span className="font-normal text-leaf-700/70">
                      ({m.matches.length})
                    </span>
                  </h2>
                  <GuideCardGrid guides={m.matches} />
                </section>
              ),
            )}
          </div>
        )
      ) : (
        /* ── Default — one compact block per collection ───────────────── */
        <div className="space-y-16">
          {metas.map((m) => (
            <Collection key={m.id} meta={m} />
          ))}
        </div>
      )}
    </div>
  );
}

// One collection block: a photo banner (title, count, tagline, browse-by-need
// chips, "See all") followed by a handful of featured guide cards. Fixed height
// regardless of how many guides the collection holds.
function Collection({ meta }: { meta: MetaCategory }) {
  const remaining = meta.guides.length - meta.featured.length;
  return (
    <section aria-labelledby={meta.id} className="scroll-mt-24">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-leaf-900 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.image}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-950 via-leaf-950/85 to-leaf-900/50" />
        <div className="relative flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id={meta.id}
              className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl"
            >
              {meta.title}
            </h2>
            <span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-leaf-950">
              {meta.countLabel}
            </span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-leaf-50/85">
            {meta.tagline}
          </p>
          {meta.chips.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {meta.chips.map((chip) => (
                <li key={chip.href}>
                  <a
                    href={chip.href}
                    className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-gold-400 hover:text-leaf-950 hover:ring-gold-400"
                  >
                    {chip.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a
            href={meta.seeAllHref}
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold-400 px-5 py-2 text-sm font-bold text-leaf-950 shadow transition-transform hover:scale-[1.03]"
          >
            {meta.seeAllLabel}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* Featured cards */}
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {meta.featured.map((g) => (
          <li key={g.href}>
            <GuideCard guide={g} />
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-6 text-center">
          <a
            href={meta.seeAllHref}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-leaf-200 px-6 py-2.5 text-sm font-bold text-leaf-700 transition-colors hover:border-leaf-400 hover:text-leaf-900"
          >
            See all {meta.guides.length} {meta.title.toLowerCase()} guides
            <span aria-hidden>→</span>
          </a>
        </div>
      )}
    </section>
  );
}
