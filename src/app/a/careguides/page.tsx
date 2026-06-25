import type { Metadata } from "next";
import Link from "next/link";
import { CARE_BASE, STORE_BASE } from "@/lib/data/plant-pages";
import { getAllPlants } from "@/lib/data/plants";
import { getAllInverts } from "@/lib/data/inverts";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CareGuidesLaunchpad,
  type MetaCategory,
  type HubGuide,
  type BrowseChip,
} from "@/components/tools/CareGuidesLaunchpad";
import hub from "@/data/guides/hub.json";

interface RawCategory {
  id: string;
  title: string;
  blurb: string;
  guides: HubGuide[];
}
const rawCategories = hub.categories as RawCategory[];

function category(id: string): RawCategory | undefined {
  return rawCategories.find((c) => c.id === id);
}
function guidesOf(...ids: string[]): HubGuide[] {
  return ids.flatMap((id) => category(id)?.guides ?? []);
}

const PLANT_COUNT = getAllPlants().length;
const INVERT_COUNT = getAllInverts().length;

// Plant/invert chips deep-link into the faceted database — these are the
// "browse by what your tank needs" entry points and double as internal links.
function plantChip(slug: string, label: string): BrowseChip {
  return { label, href: `/a/careguides/plants/${slug}` };
}
function invertChip(slug: string, label: string): BrowseChip {
  return { label, href: `/a/careguides/inverts/${slug}` };
}

// Setup has no faceted DB, so its chips jump straight to the strongest guide
// for each topic — resolved from the live data so a chip never points nowhere.
const plantGuides = guidesOf("freshwater-plant-care", "beginner-plants");
const invertGuides = guidesOf("snails-shrimp-inverts");
const setupGuides = guidesOf("planted-tank-setup", "plant-health", "other");
function setupChip(keyword: string, label: string): BrowseChip | null {
  const g = setupGuides.find((x) => x.title.toLowerCase().includes(keyword));
  return g ? { label, href: g.href } : null;
}

// How many cards each collection features on the hub. The rest live on the
// collection's own "See all" page — the hub stays this size at 99 or 500 guides.
const FEATURED = 8;

const METAS: MetaCategory[] = [
  {
    id: "plant-care",
    title: "Plant Care",
    tagline:
      "Pick plants that match your light, tank size, and experience — every species with verified care data you can check before you buy.",
    image:
      category("beginner-plants")?.guides[0]?.image ??
      category("freshwater-plant-care")?.guides[0]?.image ??
      "",
    seeAllHref: "/a/careguides/plants",
    seeAllLabel: "Explore all plants & guides",
    countLabel: `${PLANT_COUNT} species · ${plantGuides.length} guides`,
    chips: [
      plantChip("low-light", "Low light"),
      plantChip("carpet", "Carpets"),
      plantChip("beginner", "Beginner"),
      plantChip("no-co2", "No CO₂"),
      plantChip("red", "Red plants"),
      plantChip("nano-tank", "Nano tanks"),
    ],
    featured: plantGuides.slice(0, FEATURED),
    guides: plantGuides,
  },
  {
    id: "critter-care",
    title: "Snail, Shrimp & Critter Care",
    tagline:
      "Your cleanup crew — what each snail, shrimp, and critter does, how to keep it healthy, and which ones leave your plants alone.",
    image: category("snails-shrimp-inverts")?.guides[0]?.image ?? "",
    seeAllHref: "/a/careguides/inverts",
    seeAllLabel: "Explore all critters & guides",
    countLabel: `${INVERT_COUNT} species · ${invertGuides.length} guides`,
    chips: [
      invertChip("snails", "Snails"),
      invertChip("shrimp", "Shrimp"),
      invertChip("best-algae-eaters", "Algae eaters"),
      invertChip("plant-safe", "Plant-safe"),
      invertChip("beginner", "Beginner"),
      invertChip("wont-overrun-tank", "Won't overrun"),
    ],
    featured: invertGuides.slice(0, FEATURED),
    guides: invertGuides,
  },
  {
    id: "tank-setup",
    title: "Tank Setup & Maintenance",
    tagline:
      "From substrate and lighting to algae fixes and water changes — set the tank up right, then keep it thriving for the long haul.",
    image: category("planted-tank-setup")?.guides[0]?.image ?? "",
    seeAllHref: "/a/careguides/tank-setup",
    seeAllLabel: `Browse all ${setupGuides.length} setup guides`,
    countLabel: `${setupGuides.length} guides`,
    chips: [
      setupChip("substrate", "Substrate"),
      setupChip("light", "Lighting"),
      setupChip("co2", "CO₂"),
      setupChip("algae", "Algae fixes"),
      setupChip("cycl", "Cycling"),
      setupChip("fertil", "Fertilizing"),
    ].filter((c): c is BrowseChip => c !== null),
    featured: setupGuides.slice(0, FEATURED),
    guides: setupGuides,
  },
];

const INTRO =
  "Photo-illustrated freshwater aquarium guides — plants, snails, shrimp, bettas, lighting, CO₂, and algae control — written by the growers who keep these species. Pick a collection, then narrow down to exactly what your tank needs.";

export const metadata: Metadata = {
  title: "Freshwater Aquarium Care Guides | Aquatic Motiv",
  description:
    "The Aquatic Motiv care guide library — photo-illustrated freshwater aquarium guides for plants, snails, shrimp, bettas, lighting, CO₂, and algae control, written by the growers who keep these species.",
  alternates: { canonical: CARE_BASE },
};

export default function CareGuidesHubPage() {
  const allGuides = METAS.flatMap((m) => m.guides);
  const totalGuides = allGuides.length;

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Aquatic Motiv", url: `${STORE_BASE}/` },
          { name: "Freshwater Aquarium Care Guides", url: CARE_BASE },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Freshwater Aquarium Care Guides",
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
            Freshwater Aquarium Care Guides
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-leaf-50/90">
            {INTRO}
          </p>

          {/* Depth at a glance */}
          <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            {[
              [`${PLANT_COUNT + INVERT_COUNT}`, "species with care data"],
              [`${totalGuides}`, "in-depth guides"],
              ["3", "free planning tools"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="text-3xl font-extrabold text-gold-400">{n}</dt>
                <dd className="text-sm text-leaf-50/80">{label}</dd>
              </div>
            ))}
          </dl>

          {/* Primary CTA — Planted Tank Quiz (Plant Finder) */}
          <Link
            href="/a/careguides/finder"
            className="group mt-8 inline-flex max-w-2xl items-center gap-3 rounded-2xl bg-gold-400 px-6 py-4 text-left font-bold text-leaf-950 shadow-xl transition-transform hover:scale-[1.02]"
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
        <CareGuidesLaunchpad metas={METAS} />

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
