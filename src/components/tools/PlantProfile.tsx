import Link from "next/link";
import Image from "next/image";
import type { PlantSpecies } from "@/types/plants";
import type { PlantFacet } from "@/lib/data/plant-facets";
import type { PlantArticleLink } from "@/lib/data/plants";
import {
  STORE_BASE,
  PLANTS_BASE,
  CARE_BASE,
  HUB_CANONICAL_URL,
  plantUrl,
  capitalize,
  type PlantCommerceInfo,
} from "@/lib/data/plant-pages";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  plantProductSchema,
  speciesSchema,
  CARE_GUIDE_AUTHOR,
  CARE_GUIDE_PUBLISHED,
  CARE_GUIDE_UPDATED,
} from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

interface Alternative {
  plant: PlantSpecies;
  commerce: PlantCommerceInfo;
}

interface Props {
  plant: PlantSpecies;
  commerce: PlantCommerceInfo | null;
  alternatives: Alternative[];
  facets: PlantFacet[];
  articles?: PlantArticleLink[];
  /** Handle of the live /pages/ care guide for this species, when one exists */
  carePageHandle?: string;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-leaf-100 last:border-b-0">
      <th
        scope="row"
        className="w-44 py-2.5 pr-4 text-left align-top text-sm font-semibold text-leaf-900/70 sm:w-56"
      >
        {label}
      </th>
      <td className="py-2.5 text-sm text-leaf-950">{value}</td>
    </tr>
  );
}

export function PlantProfile({ plant, commerce, alternatives, facets, articles = [], carePageHandle }: Props) {
  const url = plantUrl(plant.slug);
  const inStock = commerce?.availableForSale ?? false;
  const showAlternatives = (!commerce || !inStock) && alternatives.length > 0;

  const lightLabel =
    `${capitalize(plant.light)}` +
    (plant.parMin != null && plant.parMax != null
      ? ` (${plant.parMin}–${plant.parMax} µmol PAR)`
      : "");

  const co2Label =
    plant.co2 === "none"
      ? "Not needed"
      : plant.co2 === "beneficial"
        ? "Beneficial, not required"
        : "Required";

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 via-white to-leaf-50">
      <JsonLd
        data={breadcrumbSchema([
          { name: "AquaticMotiv", url: `${STORE_BASE}/` },
          { name: "Planted Tank Care Guide", url: HUB_CANONICAL_URL },
          { name: "Plants", url: PLANTS_BASE },
          { name: plant.commonName, url },
        ])}
      />
      <JsonLd
        data={speciesSchema({
          commonName: plant.commonName,
          scientificName: plant.scientificName,
          synonyms: plant.synonyms,
          description: plant.careSummary,
          url,
        })}
      />
      <JsonLd
        data={articleSchema({
          title: `${plant.commonName} Care Guide`,
          description: plant.careSummary,
          url,
          image: commerce?.image ?? null,
          publishedAt: CARE_GUIDE_PUBLISHED,
          updatedAt: CARE_GUIDE_UPDATED,
          author: CARE_GUIDE_AUTHOR,
        })}
      />
      {plant.faqs.length > 0 && <JsonLd data={faqSchema(plant.faqs)} />}
      {commerce && (
        <JsonLd
          data={plantProductSchema({
            name: commerce.title,
            description: plant.careSummary,
            url: `${STORE_BASE}/products/${commerce.handle}`,
            image: commerce.image,
            price: commerce.price,
            inStock,
          })}
        />
      )}

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
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-leaf-200">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/a/careguides/plants" className="hover:text-white hover:underline">
                  Plants
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-leaf-100">{plant.commonName}</li>
            </ol>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            {plant.commonName}{" "}
            <span className="block text-xl font-normal italic text-leaf-200 sm:mt-1 sm:text-2xl">
              ({plant.scientificName})
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-leaf-100">{plant.careSummary}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        {/* Spec table */}
        <section aria-labelledby="specs">
          <h2 id="specs" className="text-xl font-bold text-leaf-950">
            Care specifications
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-leaf-100 bg-white px-5 py-2 shadow-sm">
            <table className="w-full border-collapse">
              <tbody>
                <SpecRow label="Type" value={capitalize(plant.type)} />
                <SpecRow label="Difficulty" value={capitalize(plant.difficulty)} />
                <SpecRow label="Light" value={lightLabel} />
                <SpecRow label="CO2" value={co2Label} />
                <SpecRow label="Fertilizer demand" value={capitalize(plant.fertDemand)} />
                <SpecRow label="Growth rate" value={capitalize(plant.growthRate)} />
                <SpecRow label="Max height" value={`${plant.maxHeightIn} in`} />
                {plant.spreadIn != null && (
                  <SpecRow label="Spread" value={`${plant.spreadIn} in`} />
                )}
                <SpecRow
                  label="Placement"
                  value={plant.placement.map(capitalize).join(", ")}
                />
                <SpecRow
                  label="Attaches to hardscape"
                  value={plant.attachesToHardscape ? "Yes" : "No"}
                />
                <SpecRow
                  label="Snail & shrimp safe"
                  value={plant.snailSafe ? "Yes" : "No"}
                />
                <SpecRow
                  label="Temperature"
                  value={`${plant.temperatureF.min}–${plant.temperatureF.max} °F`}
                />
                <SpecRow label="pH" value={`${plant.ph.min}–${plant.ph.max}`} />
                <SpecRow label="Color" value={capitalize(plant.color)} />
                <SpecRow label="Trimming" value={capitalize(plant.trimming)} />
                <SpecRow
                  label="Styles"
                  value={plant.styles.map(capitalize).join(", ")}
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* Buy block */}
        <section aria-labelledby="buy" className="mt-10">
          <h2 id="buy" className="text-xl font-bold text-leaf-950">
            Get {plant.commonName}
          </h2>
          {commerce ? (
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-leaf-100 bg-white p-4 shadow-sm sm:p-5">
              {commerce.image && (
                <Image
                  src={commerce.image}
                  alt={plant.commonName}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-leaf-950">{commerce.title}</p>
                <p className="mt-1 text-sm font-bold text-leaf-950">
                  ${commerce.price.toFixed(2)}{" "}
                  <span
                    className={`ml-1 text-xs font-semibold ${
                      inStock ? "text-green-700" : "text-leaf-900/40"
                    }`}
                  >
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </p>
              </div>
              <a
                href={`${STORE_BASE}/products/${commerce.handle}`}
                className="shrink-0 rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-leaf-950 transition-colors hover:bg-gold-500"
              >
                View product →
              </a>
            </div>
          ) : (
            <p className="mt-3 text-sm text-leaf-900/60">
              {plant.commonName} is not currently stocked at AquaticMotiv.
            </p>
          )}

          {showAlternatives && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf-900/60">
                In-stock alternatives with similar needs
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {alternatives.map(({ plant: alt, commerce: altInfo }) => (
                  <li key={alt.slug}>
                    <Link
                      href={`/a/careguides/plants/${alt.slug}`}
                      className="block h-full rounded-xl border border-leaf-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-md"
                    >
                      <span className="block font-semibold text-leaf-950">
                        {alt.commonName}
                      </span>
                      <span className="block text-xs italic text-leaf-900/50">
                        {alt.scientificName}
                      </span>
                      <span className="mt-2 block text-sm font-bold text-leaf-950">
                        ${altInfo.price.toFixed(2)}{" "}
                        <span className="ml-1 text-xs font-semibold text-green-700">
                          In stock
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Propagation */}
        <section aria-labelledby="propagation" className="mt-10">
          <h2 id="propagation" className="text-xl font-bold text-leaf-950">
            Propagation
          </h2>
          <p className="mt-3 text-leaf-900">{plant.propagation}</p>
        </section>

        {/* FAQs */}
        {plant.faqs.length > 0 && (
          <section aria-labelledby="faqs" className="mt-10">
            <h2 id="faqs" className="text-xl font-bold text-leaf-950">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              {plant.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-leaf-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-leaf-950">{faq.question}</h3>
                  <p className="mt-2 text-sm text-leaf-900/80">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deep-dive guides: the live /pages/ care guide + blog posts (same-domain) */}
        {(articles.length > 0 || carePageHandle) && (
          <section aria-labelledby="guides" className="mt-10">
            <h2 id="guides" className="text-xl font-bold text-leaf-950">
              Go deeper
            </h2>
            <ul className="mt-3 space-y-2">
              {carePageHandle && (
                <li>
                  <a
                    href={`${STORE_BASE}/pages/${carePageHandle}`}
                    className="group flex items-center gap-3 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 transition-colors hover:border-leaf-400"
                  >
                    <span className="text-sm font-semibold text-leaf-900 group-hover:text-leaf-800">
                      Full {plant.commonName} care guide
                    </span>
                    <span aria-hidden className="ml-auto text-leaf-600">→</span>
                  </a>
                </li>
              )}
              {articles.map((article) => (
                <li key={article.handle}>
                  <a
                    href={`${STORE_BASE}/blogs/news/${article.handle}`}
                    className="group flex items-center gap-3 rounded-xl border border-leaf-100 bg-white px-4 py-3 transition-colors hover:border-leaf-400"
                  >
                    <span className="text-sm font-semibold text-leaf-950 group-hover:text-leaf-800">
                      {article.title}
                    </span>
                    <span aria-hidden className="ml-auto text-leaf-600">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related facets + finder CTA */}
        {facets.length > 0 && (
          <section aria-labelledby="related" className="mt-10">
            <h2 id="related" className="text-xl font-bold text-leaf-950">
              {plant.commonName} appears in
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {facets.map((facet) => (
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
          </section>
        )}

        <div className="mt-12 rounded-2xl bg-leaf-950 p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold">Find plants for your tank</h2>
          <p className="mt-1 text-sm text-leaf-100">
            Four questions — size, light, CO2, goals — and a ranked list matched
            to your exact setup.
          </p>
          <Link
            href="/a/careguides/finder"
            className="mt-4 inline-block rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-leaf-950 shadow-lg shadow-gold-400/30 transition-transform hover:scale-[1.02]"
          >
            Open the plant finder →
          </Link>
          <p className="mt-5 text-sm text-leaf-200">
            Part of the{" "}
            <Link
              href={CARE_BASE}
              className="font-semibold text-gold-300 underline underline-offset-2 hover:text-gold-200"
            >
              Freshwater Planted Tank Guide
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
