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
      setupChip("feeder", "Feeding"),
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

      {/* Hero — editorial botanical */}
      <header className="relative overflow-hidden bg-leaf-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 48% 55% at 10% 6%, #2d4830 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 92% 0%, #375a3a 0%, transparent 55%), radial-gradient(circle at 80% 95%, rgba(255,216,0,0.16) 0%, transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
          {/* Left — editorial copy */}
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
              <span aria-hidden className="h-px w-8 bg-gold-400/60" />
              Aquatic Motiv care guide library
            </p>
            <h1
              className="mt-5 font-[family-name:var(--font-display)] font-semibold leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)" }}
            >
              Freshwater aquarium{" "}
              <span className="italic text-gold-300">care guides</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-leaf-50/80 sm:text-lg">
              {INTRO}
            </p>

            {/* Depth at a glance */}
            <dl className="mt-8 flex flex-wrap gap-x-9 gap-y-4">
              {[
                [`${PLANT_COUNT + INVERT_COUNT}`, "species with care data"],
                [`${totalGuides}`, "in-depth guides"],
                ["1", "free planted-tank quiz"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="font-[family-name:var(--font-display)] text-4xl font-semibold text-gold-300">
                    {n}
                  </dt>
                  <dd className="mt-1 text-sm text-leaf-50/70">{label}</dd>
                </div>
              ))}
            </dl>

            {/* Primary CTA — Planted Tank Quiz (Plant Finder) */}
            <Link
              href="/a/careguides/finder"
              className="group mt-9 flex max-w-md items-center gap-4 rounded-2xl border border-gold-400/40 bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10 backdrop-blur transition-colors hover:border-gold-400 hover:bg-white/[0.1]"
            >
              <span
                aria-hidden
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold-400 text-xl text-leaf-950 shadow-lg shadow-gold-400/30"
              >
                ✦
              </span>
              <span className="min-w-0">
                <span className="block font-[family-name:var(--font-display)] text-base font-semibold text-white">
                  Take the Planted Tank Quiz
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-leaf-50/70">
                  Answer a few questions — we&rsquo;ll match the perfect plants
                  to your setup
                  <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </span>
            </Link>
          </div>

          {/* Right — overlapping aquascape collage (desktop only) */}
          <div className="relative hidden h-[440px] lg:block" aria-hidden>
            <div className="absolute right-2 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-gold-400/15 blur-3xl" />
            {heroImages[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImages[0]}
                alt=""
                className="absolute right-4 top-0 h-64 w-52 rotate-[3deg] rounded-2xl object-cover shadow-2xl ring-1 ring-white/15"
              />
            )}
            {heroImages[1] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImages[1]}
                alt=""
                className="absolute left-0 top-24 h-56 w-44 -rotate-[5deg] rounded-2xl object-cover shadow-2xl ring-1 ring-white/15"
              />
            )}
            {heroImages[2] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImages[2]}
                alt=""
                className="absolute bottom-0 right-16 h-52 w-60 rotate-[1deg] rounded-2xl object-cover shadow-2xl ring-1 ring-white/15"
              />
            )}
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
