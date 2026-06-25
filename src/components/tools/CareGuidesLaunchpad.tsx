"use client";

import { useMemo, useState } from "react";

export interface HubGuide {
  title: string;
  href: string;
  image: string;
  alt: string;
  shopHref: string;
}

export interface BrowseChip {
  label: string;
  href: string;
}

// A meta-category is one of the three top-level "spines" the whole library
// hangs off (Plant Care · Critter Care · Tank Setup & Care). Each renders a
// photo portal up top and a card section below — the portal is the navigation
// that stays fixed-size as the library grows from ~99 to 500+ guides.
export interface MetaCategory {
  id: string;
  title: string;
  tagline: string;
  image: string;
  exploreHref: string;
  exploreLabel: string;
  countLabel: string;
  chips: BrowseChip[];
  guides: HubGuide[];
}

export function CareGuidesLaunchpad({ metas }: { metas: MetaCategory[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const total = metas.reduce((n, m) => n + m.guides.length, 0);

  const filtered = useMemo(
    () =>
      metas.map((m) => ({
        ...m,
        matches: query
          ? m.guides.filter((g) => g.title.toLowerCase().includes(query))
          : m.guides,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );
  const shownCount = filtered.reduce((n, m) => n + m.matches.length, 0);

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
            {query ? `${shownCount} of ${total} guides match` : `${total} care guides across 3 collections`}
          </p>
        </div>
      </div>

      {/* ── Three meta portals — the scalable spine ───────────────────── */}
      {!query && (
        <section aria-label="Browse by collection" className="mb-16">
          <div className="grid gap-5 md:grid-cols-3">
            {metas.map((m) => (
              <Portal key={m.id} meta={m} />
            ))}
          </div>
        </section>
      )}

      {/* ── Library — grouped under the same three spines ─────────────── */}
      {shownCount === 0 ? (
        <p className="rounded-2xl border border-dashed border-leaf-200 bg-white p-10 text-center text-leaf-700">
          No guides match “{q.trim()}”. Try a species or topic — e.g.{" "}
          <em>nerite</em>, <em>betta</em>, <em>CO₂</em>.
        </p>
      ) : (
        <div className="space-y-16">
          {filtered.map((m) =>
            m.matches.length === 0 ? null : (
              <section key={m.id} id={m.id} aria-labelledby={`${m.id}-h`} className="scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-leaf-100 pb-3">
                  <div>
                    <h2
                      id={`${m.id}-h`}
                      className="text-2xl font-extrabold tracking-tight text-leaf-900"
                    >
                      {m.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-leaf-700/80">{m.tagline}</p>
                  </div>
                  <a
                    href={m.exploreHref}
                    className="whitespace-nowrap text-sm font-bold text-leaf-600 hover:text-leaf-800"
                  >
                    {m.exploreLabel}
                    <span aria-hidden className="ml-1 inline-block">→</span>
                  </a>
                </div>
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                  {m.matches.map((g) => (
                    <li key={g.href}>
                      <GuideCard guide={g} />
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )}
        </div>
      )}
    </div>
  );
}

// A tall, photo-backed portal — the "front door" to one collection. Title,
// live count, plain-language tagline, a few browse-by-need chips (real deep
// links into the faceted database for SEO + navigation), and an explore link.
function Portal({ meta }: { meta: MetaCategory }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-leaf-900 shadow-lg ring-1 ring-leaf-900/10 transition-transform hover:-translate-y-1">
      {/* Photo header */}
      <a href={meta.exploreHref} className="relative block aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.image}
          alt={meta.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-950 via-leaf-950/40 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-leaf-950 shadow">
          {meta.countLabel}
        </span>
        <h2 className="absolute inset-x-0 bottom-0 p-4 text-2xl font-extrabold leading-tight text-white drop-shadow">
          {meta.title}
        </h2>
      </a>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-relaxed text-leaf-50/85">{meta.tagline}</p>

        {meta.chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
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
          href={meta.exploreHref}
          className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-gold-400 px-5 py-2 text-sm font-bold text-leaf-950 shadow transition-transform group-hover:scale-[1.03]"
        >
          {meta.exploreLabel}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}

// The single card used for EVERY guide — uniform structure so the grid stays
// tidy at any scale. Image + title link to the guide; Shop link splits the
// commercial intent off to the matching collection.
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
