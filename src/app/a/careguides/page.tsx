import type { Metadata } from "next";
import Link from "next/link";
import { CARE_BASE, FINDER_URL, PLANTS_BASE } from "@/lib/data/plant-pages";
import { INVERTS_BASE } from "@/lib/data/invert-pages";

export const metadata: Metadata = {
  title: "Aquarium Care Tools — Plant & Invert Databases, Finder | AquaticMotiv",
  description:
    "Free aquarium care tools from AquaticMotiv: verified plant and invertebrate databases with structured care data for every species, and an interactive finder that matches plants to your exact tank.",
  alternates: { canonical: CARE_BASE },
};

const TOOLS = [
  {
    href: "/a/careguides/plants",
    url: PLANTS_BASE,
    title: "Aquarium plant database",
    description:
      "Verified care data for every species we track: light, CO2, height, temperature, placement, and snail safety — browsable A–Z or by what your tank needs.",
  },
  {
    href: "/a/careguides/inverts",
    url: INVERTS_BASE,
    title: "Invertebrate database",
    description:
      "Snails, shrimp, crabs, clams, and crayfish with verified care data: size, lifespan, GH and calcium needs, plant and betta safety, and breeding behavior.",
  },
  {
    href: "/a/careguides/finder",
    url: FINDER_URL,
    title: "Plant finder",
    description:
      "Four questions — tank size, light, CO2, goals — and every species is ranked against your exact setup, with honest care expectations.",
  },
];

export default function CareToolsIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-aqua-50 via-white to-ocean-50">
      <header className="relative overflow-hidden bg-gradient-to-b from-ocean-950 via-ocean-800 to-aqua-700 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 20% 0%, #5eead4 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 80% 10%, #60a5fa 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua-300">
            AquaticMotiv care tools
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Aquarium care tools
          </h1>
          <p className="mt-4 max-w-2xl text-ocean-100">
            Free tools built on verified, structured care data — check a species
            against your tank before you buy it.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-10">
        <ul className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="block h-full rounded-xl border border-ocean-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-md"
              >
                <span className="block text-lg font-bold text-ocean-950">
                  {tool.title}
                </span>
                <span className="mt-2 block text-sm text-ocean-900/70">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
