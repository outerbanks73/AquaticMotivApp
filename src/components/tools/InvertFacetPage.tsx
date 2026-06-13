import Link from "next/link";
import Image from "next/image";
import type { InvertSpecies } from "@/types/inverts";
import type { InvertFacet } from "@/lib/data/invert-facets";
import {
  STORE_BASE,
  INVERTS_BASE,
  invertUrl,
  capitalize,
  firstSentence,
  invertCommerceFor,
  roleLabel,
  type InvertCommerceInfo,
} from "@/lib/data/invert-pages";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

interface Props {
  facet: InvertFacet;
  /** Pre-sorted: difficulty easy-first, then common name */
  species: InvertSpecies[];
  commerceByHandle: Record<string, InvertCommerceInfo>;
  siblings: InvertFacet[];
}

function speciesBadges(invert: InvertSpecies): string[] {
  return [
    capitalize(invert.difficulty),
    capitalize(invert.type),
    `Max ${invert.maxSizeIn}"`,
    invert.roles.length > 0 ? roleLabel(invert.roles[0]) : capitalize(invert.temperament),
  ];
}

export function InvertFacetPage({ facet, species, commerceByHandle, siblings }: Props) {
  const url = invertUrl(facet.slug);
  const inStockCount = species.filter(
    (i) => invertCommerceFor(i, commerceByHandle)?.availableForSale
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-aqua-50 via-white to-ocean-50">
      <JsonLd
        data={breadcrumbSchema([
          { name: "AquaticMotiv", url: `${STORE_BASE}/` },
          { name: "Invertebrates", url: INVERTS_BASE },
          { name: facet.title, url },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          facet.title,
          species.map((i, idx) => ({
            name: `${i.commonName} (${i.scientificName})`,
            url: invertUrl(i.slug),
            position: idx + 1,
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
                <Link href="/a/careguides/inverts" className="hover:text-white hover:underline">
                  Invertebrates
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
            {species.map((invert, i) => {
              const commerce = invertCommerceFor(invert, commerceByHandle);
              return (
                <li
                  key={invert.slug}
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
                          alt={invert.commonName}
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
                            href={`/a/careguides/inverts/${invert.slug}`}
                            className="hover:text-aqua-700 hover:underline"
                          >
                            {invert.commonName}
                          </Link>
                        </h3>
                        <span className="text-sm italic text-ocean-900/50">
                          {invert.scientificName}
                        </span>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {speciesBadges(invert).map((badge) => (
                          <li
                            key={badge}
                            className="rounded-full bg-aqua-100 px-2.5 py-0.5 text-xs font-medium text-aqua-800"
                          >
                            {badge}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm text-ocean-900/80">
                        {firstSentence(invert.careSummary)}
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
                          href={`/a/careguides/inverts/${invert.slug}`}
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

        {/* Plants hub + finder CTA (inverts have no finder of their own) */}
        <div className="mt-12 rounded-2xl bg-ocean-950 p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold">Planting the same tank?</h2>
          <p className="mt-1 text-sm text-ocean-100">
            Most of these species do their best work in a planted tank. Browse
            the plant database, or let the finder rank every plant against your
            exact setup.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/a/careguides/plants"
              className="inline-block rounded-full bg-aqua-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-aqua-600/25 transition-transform hover:scale-[1.02]"
            >
              Browse the plant database →
            </Link>
            <Link
              href="/a/careguides/finder"
              className="inline-block rounded-full border-2 border-aqua-400/60 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-aqua-300"
            >
              Open the plant finder →
            </Link>
          </div>
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
                    href={`/a/careguides/inverts/${sibling.slug}`}
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
