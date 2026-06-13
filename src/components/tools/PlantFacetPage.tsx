import Link from "next/link";
import Image from "next/image";
import type { PlantSpecies } from "@/types/plants";
import type { PlantFacet } from "@/lib/data/plant-facets";
import {
  STORE_BASE,
  PLANTS_BASE,
  plantUrl,
  capitalize,
  firstSentence,
  commerceFor,
  type PlantCommerceInfo,
} from "@/lib/data/plant-pages";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

interface Props {
  facet: PlantFacet;
  /** Pre-sorted: difficulty easy-first, then common name */
  species: PlantSpecies[];
  commerceByHandle: Record<string, PlantCommerceInfo>;
  siblings: PlantFacet[];
}

function speciesBadges(plant: PlantSpecies): string[] {
  return [
    capitalize(plant.difficulty),
    `${capitalize(plant.light)} light`,
    plant.co2 === "none" ? "No CO2 needed" : `CO2 ${plant.co2}`,
    `Max ${plant.maxHeightIn}"`,
  ];
}

export function PlantFacetPage({ facet, species, commerceByHandle, siblings }: Props) {
  const url = plantUrl(facet.slug);
  const inStockCount = species.filter(
    (p) => commerceFor(p, commerceByHandle)?.availableForSale
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-aqua-50 via-white to-ocean-50">
      <JsonLd
        data={breadcrumbSchema([
          { name: "AquaticMotiv", url: `${STORE_BASE}/` },
          { name: "Plants", url: PLANTS_BASE },
          { name: facet.title, url },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          facet.title,
          species.map((p, i) => ({
            name: `${p.commonName} (${p.scientificName})`,
            url: plantUrl(p.slug),
            position: i + 1,
          }))
        )}
      />
      {facet.faqs.length > 0 && <JsonLd data={faqSchema(facet.faqs)} />}

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-ocean-950 via-ocean-800 to-aqua-700 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 20% 0%, #5eead4 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 80% 10%, #60a5fa 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-aqua-200">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/a/careguides/plants" className="hover:text-white hover:underline">
                  Plants
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ocean-100">{facet.title}</li>
            </ol>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {facet.title}
          </h1>
          <p className="mt-4 max-w-2xl text-ocean-100">{facet.directAnswer}</p>
          <p className="mt-4 text-sm font-semibold text-aqua-300">
            {species.length} species match, {inStockCount} in stock at AquaticMotiv
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        {/* Ranked species list */}
        <section aria-labelledby="matches">
          <h2 id="matches" className="text-xl font-bold text-ocean-950">
            The species, easiest first
          </h2>
          <ol className="mt-5 space-y-4">
            {species.map((plant, i) => {
              const commerce = commerceFor(plant, commerceByHandle);
              return (
                <li
                  key={plant.slug}
                  className="overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex gap-4 p-4 sm:p-5">
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-950 text-sm font-bold text-aqua-300">
                        {i + 1}
                      </span>
                      {commerce?.image && (
                        <Image
                          src={commerce.image}
                          alt={plant.commonName}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <h3 className="text-lg font-bold text-ocean-950">
                          <Link
                            href={`/a/careguides/plants/${plant.slug}`}
                            className="hover:text-aqua-700 hover:underline"
                          >
                            {plant.commonName}
                          </Link>
                        </h3>
                        <span className="text-sm italic text-ocean-900/50">
                          {plant.scientificName}
                        </span>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {speciesBadges(plant).map((badge) => (
                          <li
                            key={badge}
                            className="rounded-full bg-aqua-100 px-2.5 py-0.5 text-xs font-medium text-aqua-800"
                          >
                            {badge}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm text-ocean-900/80">
                        {firstSentence(plant.careSummary)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {commerce && (
                          <span className="text-sm font-bold text-ocean-950">
                            ${commerce.price.toFixed(2)}{" "}
                            <span
                              className={`ml-1 text-xs font-semibold ${
                                commerce.availableForSale
                                  ? "text-green-700"
                                  : "text-ocean-900/40"
                              }`}
                            >
                              {commerce.availableForSale ? "In stock" : "Out of stock"}
                            </span>
                          </span>
                        )}
                        <Link
                          href={`/a/careguides/plants/${plant.slug}`}
                          className="text-sm font-semibold text-aqua-700 underline-offset-2 hover:underline"
                        >
                          Care profile →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Finder CTA */}
        <div className="mt-12 rounded-2xl bg-ocean-950 p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold">Narrow it to your exact tank</h2>
          <p className="mt-1 text-sm text-ocean-100">
            The plant finder ranks these against your tank size, light, CO2, and
            goals — with honest care expectations.
          </p>
          <Link
            href={`/a/careguides/finder${facet.finderParams ? `?${facet.finderParams}` : ""}`}
            className="mt-4 inline-block rounded-full bg-aqua-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-aqua-600/25 transition-transform hover:scale-[1.02]"
          >
            Open the plant finder →
          </Link>
        </div>

        {/* Facet FAQs */}
        {facet.faqs.length > 0 && (
          <section aria-labelledby="faqs" className="mt-12">
            <h2 id="faqs" className="text-xl font-bold text-ocean-950">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              {facet.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-ocean-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-ocean-950">{faq.question}</h3>
                  <p className="mt-2 text-sm text-ocean-900/80">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sibling facets */}
        {siblings.length > 0 && (
          <section aria-labelledby="siblings" className="mt-12">
            <h2
              id="siblings"
              className="text-sm font-semibold uppercase tracking-wide text-ocean-900/60"
            >
              More ways to browse
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <Link
                    href={`/a/careguides/plants/${sibling.slug}`}
                    className="inline-block rounded-full border-2 border-ocean-100 bg-white px-4 py-1.5 text-sm font-medium text-ocean-900 transition-colors hover:border-aqua-300 hover:text-aqua-700"
                  >
                    {sibling.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
