import type { Metadata } from "next";
import Link from "next/link";
import { CARE_BASE, STORE_BASE } from "@/lib/data/plant-pages";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CareGuidesHub,
  type HubCategory,
} from "@/components/tools/CareGuidesHub";
import hub from "@/data/guides/hub.json";

const categories = hub.categories as HubCategory[];
const plantReference = hub.plantReference as HubCategory;

export const metadata: Metadata = {
  title:
    "Aquarium Care Guides — Snails, Shrimp, Bettas & Plants | AquaticMotiv",
  description:
    "Expert freshwater aquarium care guides from the growers at AquaticMotiv: snails, shrimp, bettas, and live plants — plus interactive plant and invertebrate databases and a plant finder. Grown and shipped from New Jersey.",
  alternates: { canonical: CARE_BASE },
};

const TOOLS = [
  {
    href: "/a/careguides/plants",
    title: "Plant database",
    description: "Verified care data for every plant species — A–Z or by tank need.",
  },
  {
    href: "/a/careguides/inverts",
    title: "Invertebrate database",
    description: "Snails, shrimp, crabs, clams, and crayfish with full care data.",
  },
  {
    href: "/a/careguides/finder",
    title: "Plant finder",
    description: "Four questions, and every species ranked against your exact tank.",
  },
];

export default function CareGuidesHubPage() {
  const allGuideItems = [
    ...categories.flatMap((c) => c.guides),
    ...plantReference.guides,
  ];

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: "AquaticMotiv", url: `${STORE_BASE}/` },
          { name: "Care Guides", url: CARE_BASE },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "AquaticMotiv aquarium care guides",
          allGuideItems.map((g, i) => ({
            name: g.title,
            url: g.href,
            position: i + 1,
          })),
        )}
      />

      {/* Hero — storefront green/gold */}
      <header className="relative overflow-hidden bg-gradient-to-b from-leaf-900 via-leaf-700 to-leaf-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 45% at 18% 0%, #8fb592 0%, transparent 60%), radial-gradient(ellipse 45% 40% at 85% 5%, #ffd800 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            AquaticMotiv care guides
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Everything you need to keep it thriving
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-leaf-50/90">
            Expert, no-fluff care guides from the team that grows and ships
            190+ tanks of freshwater plants, snails, shrimp, and bettas out of
            New Jersey. Look up a species, fix a problem, or plan your next
            aquascape.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10">
        {/* Native tools */}
        <section aria-labelledby="tools" className="mb-12">
          <h2 id="tools" className="sr-only">
            Interactive tools
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="group block h-full rounded-2xl border border-leaf-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-md"
                >
                  <span className="inline-flex rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-950">
                    Tool
                  </span>
                  <span className="mt-3 block text-lg font-bold text-leaf-900">
                    {tool.title}
                  </span>
                  <span className="mt-1 block text-sm text-leaf-700/75">
                    {tool.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Searchable guide hub */}
        <CareGuidesHub categories={categories} plantReference={plantReference} />

        {/* Shop CTA */}
        <section className="mt-14 rounded-3xl bg-leaf-900 p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-bold">Ready to stock your tank?</h2>
          <p className="mx-auto mt-2 max-w-xl text-leaf-50/85">
            Every species in these guides is grown in-house with a 100% live
            arrival guarantee and fast 1–3 day shipping.
          </p>
          <a
            href={`${STORE_BASE}/collections/all`}
            className="mt-6 inline-block rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-leaf-950 shadow-lg transition-transform hover:scale-[1.03]"
          >
            Shop all plants & livestock →
          </a>
        </section>
      </main>
    </div>
  );
}
