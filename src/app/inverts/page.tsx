import type { Metadata } from "next";
import Link from "next/link";
import type { InvertSpecies, InvertType } from "@/types/inverts";
import { getAllInverts } from "@/lib/data/inverts";
import {
  getActiveInvertFacets,
  type InvertFacetGroup,
} from "@/lib/data/invert-facets";
import {
  STORE_BASE,
  INVERTS_BASE,
  HUB_CANONICAL_URL,
  invertUrl,
  capitalize,
  roleLabel,
} from "@/lib/data/invert-pages";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GuideCardGrid, type HubGuide } from "@/components/tools/GuideCard";
import hub from "@/data/guides/hub.json";

const invertGuides = (hub.categories as { id: string; guides: HubGuide[] }[])
  .filter((c) => c.id === "snails-shrimp-inverts")
  .flatMap((c) => c.guides);

export const metadata: Metadata = {
  title: "Freshwater Invertebrate Database — Snails, Shrimp & More",
  description:
    "Verified care data for every freshwater invertebrate we track: snails, shrimp, crabs, clams, and crayfish — size, lifespan, GH, breeding behavior, and tankmate safety.",
  alternates: { canonical: INVERTS_BASE },
};

const FACET_GROUPS: { id: InvertFacetGroup; label: string }[] = [
  { id: "type", label: "By type" },
  { id: "goal", label: "By goal" },
];

const TYPE_SECTIONS: { type: InvertType; label: string }[] = [
  { type: "snail", label: "Snails" },
  { type: "shrimp", label: "Shrimp" },
  { type: "crab", label: "Crabs" },
  { type: "clam", label: "Clams" },
  { type: "crayfish", label: "Crayfish" },
];

function speciesBadges(invert: InvertSpecies): string[] {
  return [
    capitalize(invert.difficulty),
    `Max ${invert.maxSizeIn}"`,
    invert.roles.length > 0
      ? roleLabel(invert.roles[0])
      : capitalize(invert.temperament),
  ];
}

export default function InvertsHubPage() {
  const inverts = [...getAllInverts()].sort((a, b) =>
    a.commonName.localeCompare(b.commonName)
  );
  const facets = getActiveInvertFacets();

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 via-white to-leaf-50">
      <JsonLd
        data={breadcrumbSchema([
          { name: "AquaticMotiv", url: `${STORE_BASE}/` },
          { name: "Planted Tank Care Guide", url: HUB_CANONICAL_URL },
          { name: "Invertebrates", url: INVERTS_BASE },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "AquaticMotiv freshwater invertebrate database",
          inverts.map((i, idx) => ({
            name: `${i.commonName} (${i.scientificName})`,
            url: invertUrl(i.slug),
            position: idx + 1,
          }))
        )}
      />

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-leaf-950 via-leaf-800 to-leaf-700 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 20% 0%, #8fb592 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 80% 10%, #ffd800 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            AquaticMotiv invertebrate database
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Freshwater invertebrate database
          </h1>
          <p className="mt-4 max-w-2xl text-leaf-100">
            Verified care data for {inverts.length} freshwater invertebrate
            species — snails, shrimp, crabs, clams, and crayfish: size,
            lifespan, temperature and pH ranges, general hardness and calcium
            needs, plant and betta safety, and exactly how (or whether) each one
            breeds in your tank. Every attribute is published as plain text on
            each species page, so you can check an animal against your tank
            before you buy it.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-10">
        {/* Care guides */}
        <section aria-labelledby="guides" className="mb-12">
          <h2 id="guides" className="text-xl font-bold text-leaf-950">
            Snail, shrimp &amp; critter care guides
          </h2>
          <p className="mt-1 mb-5 text-sm text-leaf-900/60">
            In-depth, photo-illustrated guides for keeping and breeding
            freshwater invertebrates.
          </p>
          <GuideCardGrid guides={invertGuides} />
        </section>

        {/* Facet directory */}
        <section aria-labelledby="browse">
          <h2 id="browse" className="text-xl font-bold text-leaf-950">
            Browse by what your tank needs
          </h2>
          <div className="mt-5 space-y-6">
            {FACET_GROUPS.map((group) => {
              const groupFacets = facets.filter((f) => f.group === group.id);
              if (groupFacets.length === 0) return null;
              return (
                <div key={group.id}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf-900/60">
                    {group.label}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {groupFacets.map((facet) => (
                      <li key={facet.slug}>
                        <Link
                          href={`https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/inverts/${facet.slug}`}
                          className="inline-block rounded-full border-2 border-leaf-100 bg-white px-4 py-1.5 text-sm font-medium text-leaf-900 transition-colors hover:border-leaf-400 hover:text-leaf-800"
                        >
                          {facet.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* A–Z species cards grouped by type */}
        <section aria-labelledby="all-species" className="mt-12">
          <h2 id="all-species" className="text-xl font-bold text-leaf-950">
            All species, A–Z by type
          </h2>
          <div className="mt-5 space-y-10">
            {TYPE_SECTIONS.map(({ type, label }) => {
              const group = inverts.filter((i) => i.type === type);
              if (group.length === 0) return null;
              return (
                <div key={type}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf-900/60">
                    {label}
                  </h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {group.map((invert) => (
                      <li key={invert.slug}>
                        <Link
                          href={`https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/inverts/${invert.slug}`}
                          className="block h-full rounded-xl border border-leaf-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-md"
                        >
                          <span className="block font-bold text-leaf-950">
                            {invert.commonName}
                          </span>
                          <span className="block text-sm italic text-leaf-900/50">
                            {invert.scientificName}
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {speciesBadges(invert).map((badge) => (
                              <span
                                key={badge}
                                className="rounded-full bg-leaf-100 px-2.5 py-0.5 text-xs font-medium text-leaf-800"
                              >
                                {badge}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Plants cross-link CTA */}
        <div className="mt-12 rounded-2xl bg-leaf-950 p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold">Planting the same tank?</h2>
          <p className="mt-1 text-sm text-leaf-100">
            Nearly every invert here does its best work in a planted tank.
            Browse the plant database, or let the finder rank every plant
            against your exact setup.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/plants"
              className="inline-block rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-leaf-950 shadow-lg shadow-gold-400/30 transition-transform hover:scale-[1.02]"
            >
              Browse the plant database →
            </Link>
            <Link
              href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/finder"
              className="inline-block rounded-full border-2 border-leaf-400/60 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-leaf-400"
            >
              Open the plant finder →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
