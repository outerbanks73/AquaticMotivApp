import type { Metadata } from "next";
import Link from "next/link";
import { HUB_CANONICAL_URL, STORE_BASE } from "@/lib/data/plant-pages";
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
  return { label, href: `https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/plants/${slug}` };
}
function invertChip(slug: string, label: string): BrowseChip {
  return { label, href: `https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/inverts/${slug}` };
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
    title: "Aquarium Plant Care",
    tagline:
      "Pick plants that match your light, tank size, and experience — every species with verified care data you can check before you buy.",
    image:
      category("beginner-plants")?.guides[0]?.image ??
      category("freshwater-plant-care")?.guides[0]?.image ??
      "",
    seeAllHref: "https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/plants",
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
    title: "Snail, Shrimp & Invertebrate Care",
    tagline:
      "Your cleanup crew — what each snail, shrimp, and critter does, how to keep it healthy, and which ones leave your plants alone.",
    image: category("snails-shrimp-inverts")?.guides[0]?.image ?? "",
    seeAllHref: "https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/inverts",
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
    seeAllHref: "https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/tank-setup",
    seeAllLabel: `Browse all ${setupGuides.length} setup guides`,
    countLabel: `${setupGuides.length} guides`,
    chips: [
      setupChip("substrate", "Substrate"),
      setupChip("light", "Lighting"),
      setupChip("co2", "CO₂"),
      setupChip("algae", "Algae fixes"),
      setupChip("cycl", "Cycling"),
      setupChip("feeder", "Feeding"),
    ].filter((c): c is BrowseChip => c !== null),
    featured: setupGuides.slice(0, FEATURED),
    guides: setupGuides,
  },
];

const INTRO =
  "Photo-illustrated aquarium plant care guides, planted-tank setup help, and troubleshooting from the growers who keep these species — with supporting snail, shrimp, and invertebrate care organized as a separate freshwater cleanup-crew cluster.";

const HUB_TITLE = "Aquarium Plants: Care Guides, Setup & Troubleshooting";

export const metadata: Metadata = {
  title: { absolute: HUB_TITLE },
  description:
    "Aquarium plant care guides, planted-tank setup help, and troubleshooting from Aquatic Motiv, with supporting snail, shrimp, and invertebrate care sections.",
  alternates: { canonical: HUB_CANONICAL_URL },
};

export default function CareGuidesHubPage() {
  const allGuides = METAS.flatMap((m) => m.guides);
  const totalGuides = allGuides.length;

  // A few real guide photos for the hero collage — pulled from live data so the
  // hero never points at a missing asset.
  const heroImages = [
    category("freshwater-plant-care")?.guides[0]?.image,
    category("snails-shrimp-inverts")?.guides[0]?.image,
    category("planted-tank-setup")?.guides[0]?.image,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Aquatic Motiv", url: `${STORE_BASE}/` },
          { name: HUB_TITLE, url: HUB_CANONICAL_URL },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: HUB_TITLE,
          description: INTRO,
          url: HUB_CANONICAL_URL,
          items: allGuides.map((g, i) => ({
            name: g.title,
            url: g.href,
            position: i + 1,
          })),
        })}
      />

      {/* Hero — compact storefront content header */}
      <header className="relative overflow-hidden border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-white/70"
        />
        <div className="relative mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
              AquaticMotiv care guide library
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-leaf-950 sm:text-5xl">
              {HUB_TITLE}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-leaf-900/75">
              {INTRO}
            </p>

            <dl className="mt-6 flex flex-wrap gap-2">
              {[
                [`${PLANT_COUNT + INVERT_COUNT}`, "species with care data"],
                [`${totalGuides}`, "in-depth guides"],
                ["1", "free planted-tank quiz"],
              ].map(([n, label]) => (
                <div
                  key={label}
                  className="rounded-full border border-leaf-200 bg-white px-4 py-2 text-sm shadow-sm"
                >
                  <dt className="inline font-bold text-leaf-950">{n}</dt>
                  <dd className="inline text-leaf-700"> {label}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/finder"
              className="group mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-gold-400 px-5 py-3 text-sm font-bold text-leaf-950 shadow-sm transition-colors hover:bg-gold-500"
            >
              <span
                aria-hidden
                className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white/70 text-base"
              >
                ✦
              </span>
              <span>
                Take the Planted Tank Quiz
                <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>

          <div className="hidden grid-cols-[1fr_8rem] gap-3 lg:grid" aria-hidden>
            {heroImages[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImages[0]}
                alt=""
                className="h-72 w-full rounded-lg border border-leaf-100 bg-white object-cover shadow-sm"
              />
            )}
            <div className="grid gap-3">
              {heroImages.slice(1, 3).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-[8.625rem] w-full rounded-lg border border-leaf-100 bg-white object-cover shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10">
        <CareGuidesLaunchpad metas={METAS} />

        {/* Shop CTA */}
        <section className="mt-16 rounded-3xl bg-leaf-900 p-8 text-center text-white sm:p-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
            Ready to stock your tank?
          </h2>
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
