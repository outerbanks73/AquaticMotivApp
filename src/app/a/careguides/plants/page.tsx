import type { Metadata } from "next";
import Link from "next/link";
import { getAllPlants } from "@/lib/data/plants";
import { getActiveFacets, type FacetGroup } from "@/lib/data/plant-facets";
import {
  STORE_BASE,
  PLANTS_BASE,
  plantUrl,
  capitalize,
} from "@/lib/data/plant-pages";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpeciesSearchList } from "@/components/tools/SpeciesSearchList";

export const metadata: Metadata = {
  title: "Aquarium Plant Database — Care Data for Every Species | AquaticMotiv",
  description:
    "Verified care data for every aquarium plant we track: light, CO2, height, temperature, placement, and snail safety — browsable A–Z or by what your tank needs.",
  alternates: { canonical: PLANTS_BASE },
};

const FACET_GROUPS: { id: FacetGroup; label: string }[] = [
  { id: "light", label: "By light" },
  { id: "placement", label: "By placement" },
  { id: "goal", label: "By goal" },
  { id: "style", label: "By style" },
];

function speciesBadges(light: string, co2: string, difficulty: string): string[] {
  return [
    capitalize(difficulty),
    `${capitalize(light)} light`,
    co2 === "none" ? "No CO2" : `CO2 ${co2}`,
  ];
}

export default function PlantsHubPage() {
  const plants = [...getAllPlants()].sort((a, b) =>
    a.commonName.localeCompare(b.commonName)
  );
  const facets = getActiveFacets();

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 via-white to-leaf-50">
      <JsonLd
        data={breadcrumbSchema([
          { name: "AquaticMotiv", url: `${STORE_BASE}/` },
          { name: "Plants", url: PLANTS_BASE },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "AquaticMotiv aquarium plant database",
          plants.map((p, i) => ({
            name: `${p.commonName} (${p.scientificName})`,
            url: plantUrl(p.slug),
            position: i + 1,
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
            AquaticMotiv plant database
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Aquarium plant database
          </h1>
          <p className="mt-4 max-w-2xl text-leaf-100">
            Verified care data for {plants.length} freshwater aquarium plant
            species: light and PAR ranges, CO2 requirements, realistic submerged
            heights, temperature floors, placement, and snail safety. Every
            attribute is published as plain text on each species page, so you can
            check a plant against your tank before you buy it — browse A–Z below,
            or jump to the list that matches what your tank needs.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-10">
        {/* Finder CTA */}
        <div className="rounded-2xl bg-leaf-950 p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold">Not sure where to start?</h2>
          <p className="mt-1 text-sm text-leaf-100">
            The plant finder asks four questions — tank size, light, CO2, goals —
            and ranks every species here against your exact setup.
          </p>
          <Link
            href="/a/careguides/finder"
            className="mt-4 inline-block rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-leaf-950 shadow-lg shadow-gold-400/30 transition-transform hover:scale-[1.02]"
          >
            Open the plant finder →
          </Link>
        </div>

        {/* Facet directory */}
        <section aria-labelledby="browse" className="mt-12">
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
                          href={`/a/careguides/plants/${facet.slug}`}
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

        {/* All species — searchable */}
        <section aria-labelledby="all-species" className="mt-12">
          <h2 id="all-species" className="text-xl font-bold text-leaf-950">
            Find a plant
          </h2>
          <p className="mt-1 mb-4 text-sm text-leaf-900/60">
            Search {plants.length} species by common or scientific name.
          </p>
          <SpeciesSearchList
            placeholder="Search plants — e.g. anubias, Microsorum, monte carlo…"
            items={plants.map((plant) => ({
              href: `/a/careguides/plants/${plant.slug}`,
              name: plant.commonName,
              sub: plant.scientificName,
              synonyms: plant.synonyms,
              badges: speciesBadges(plant.light, plant.co2, plant.difficulty),
            }))}
          />
        </section>
      </main>
    </div>
  );
}
