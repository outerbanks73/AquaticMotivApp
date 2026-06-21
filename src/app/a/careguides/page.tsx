import type { Metadata } from "next";
import Link from "next/link";
import { CARE_BASE, STORE_BASE } from "@/lib/data/plant-pages";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CareGuidesHub,
  type HubCategory,
} from "@/components/tools/CareGuidesHub";
import hub from "@/data/guides/hub.json";

const categories = hub.categories as HubCategory[];

const INTRO =
  "Browse the Aquatic Motiv freshwater aquarium care guide library — photo-illustrated guides covering aquarium plants, snails, shrimp, bettas, lighting, CO2, and algae control. Every guide is written by the growers who keep these species, so you can set up and maintain a thriving planted tank with confidence.";

export const metadata: Metadata = {
  title: "Freshwater Aquarium Plant Care Guides | Aquatic Motiv",
  description:
    "The Aquatic Motiv care guide library — photo-illustrated freshwater aquarium guides for plants, snails, shrimp, bettas, lighting, CO2, and algae control, written by the growers who keep these species.",
  alternates: { canonical: CARE_BASE },
};

export default function CareGuidesHubPage() {
  const allGuides = categories.flatMap((c) => c.guides);

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Aquatic Motiv", url: `${STORE_BASE}/` },
          { name: "Freshwater Aquarium Plant Care Guides", url: CARE_BASE },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Freshwater Aquarium Plant Care Guides",
          description: INTRO,
          url: CARE_BASE,
          items: allGuides.map((g, i) => ({
            name: g.title,
            url: g.href,
            position: i + 1,
          })),
        })}
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
            Aquatic Motiv care guide library
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Freshwater Aquarium Plant Care Guides
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-leaf-50/90">
            {INTRO}
          </p>

          {/* Primary CTA — Planted Tank Quiz (Plant Finder) */}
          <Link
            href="/a/careguides/finder"
            className="group mt-7 inline-flex max-w-2xl items-center gap-3 rounded-2xl bg-gold-400 px-6 py-4 text-left font-bold text-leaf-950 shadow-xl transition-transform hover:scale-[1.02]"
          >
            <span
              aria-hidden
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-leaf-900 text-gold-400"
            >
              ✦
            </span>
            <span className="text-sm sm:text-base">
              Planted Tank Quiz — answer a few questions about your setup and
              we&rsquo;ll find the perfect plants for you
              <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10">
        <CareGuidesHub categories={categories} />

        {/* Shop CTA */}
        <section className="mt-16 rounded-3xl bg-leaf-900 p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-bold">Ready to stock your tank?</h2>
          <p className="mx-auto mt-2 max-w-xl text-leaf-50/85">
            Every species in these guides is grown in-house with a 100% live
            arrival guarantee and fast 1–3 day shipping.
          </p>
          <a
            href={`${STORE_BASE}/collections/all`}
            className="mt-6 inline-block rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-leaf-950 shadow-lg transition-transform hover:scale-[1.03]"
          >
            Shop all plants &amp; livestock →
          </a>
        </section>
      </main>
    </div>
  );
}
