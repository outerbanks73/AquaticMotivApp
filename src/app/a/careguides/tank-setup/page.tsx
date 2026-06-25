import type { Metadata } from "next";
import Link from "next/link";
import { CARE_BASE, STORE_BASE } from "@/lib/data/plant-pages";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GuideCardGrid, type HubGuide } from "@/components/tools/GuideCard";
import hub from "@/data/guides/hub.json";

interface RawCategory {
  id: string;
  title: string;
  blurb: string;
  guides: HubGuide[];
}
const rawCategories = hub.categories as RawCategory[];
const guidesOf = (...ids: string[]): HubGuide[] =>
  ids.flatMap((id) => rawCategories.find((c) => c.id === id)?.guides ?? []);

// The full Tank Setup & Maintenance list — the "See all" destination for that
// collection on the hub. Server-rendered card grid, so every guide link is
// crawlable from one click below the hub.
const setupGuides = guidesOf("planted-tank-setup", "plant-health", "other");

const SETUP_URL = `${CARE_BASE}/tank-setup`;
const INTRO =
  "Everything that keeps a planted tank running — choosing substrate and lighting, dialing in CO₂ and fertilizers, cycling a new tank, and fixing algae before it takes over. Practical, photo-illustrated guides from the growers who run these tanks every day.";

export const metadata: Metadata = {
  title: "Aquarium Setup & Maintenance Guides | Aquatic Motiv",
  description:
    "Planted aquarium setup and maintenance guides — substrate, lighting, CO₂, fertilizing, cycling, water changes, and algae control, written by the growers who keep these tanks.",
  alternates: { canonical: SETUP_URL },
};

export default function TankSetupPage() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Aquatic Motiv", url: `${STORE_BASE}/` },
          { name: "Care Guides", url: CARE_BASE },
          { name: "Tank Setup & Maintenance", url: SETUP_URL },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Aquarium Setup & Maintenance Guides",
          description: INTRO,
          url: SETUP_URL,
          items: setupGuides.map((g, i) => ({
            name: g.title,
            url: g.href,
            position: i + 1,
          })),
        })}
      />

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-leaf-900 via-leaf-700 to-leaf-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 45% at 18% 0%, #8fb592 0%, transparent 60%), radial-gradient(ellipse 45% 40% at 85% 5%, #ffd800 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav className="text-sm text-leaf-50/80">
            <Link href="/a/careguides" className="hover:text-gold-400">
              Care Guides
            </Link>{" "}
            <span aria-hidden>/</span> Tank Setup &amp; Maintenance
          </nav>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tank Setup &amp; Maintenance Guides
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-leaf-50/90">
            {INTRO}
          </p>
          <p className="mt-4 text-sm font-semibold text-gold-400">
            {setupGuides.length} guides
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10">
        <GuideCardGrid guides={setupGuides} />

        {/* Back to hub + shop */}
        <section className="mt-16 rounded-3xl bg-leaf-900 p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-bold">Building a new tank?</h2>
          <p className="mx-auto mt-2 max-w-xl text-leaf-50/85">
            Start with the Planted Tank Quiz, then shop everything you need —
            grown and stocked in-house with a 100% live arrival guarantee.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/a/careguides/finder"
              className="rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-leaf-950 shadow-lg transition-transform hover:scale-[1.03]"
            >
              Take the Planted Tank Quiz →
            </Link>
            <a
              href={`${STORE_BASE}/collections/all`}
              className="rounded-full border-2 border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              Shop all plants &amp; livestock
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
