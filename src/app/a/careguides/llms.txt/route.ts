// llms.txt for AI crawlers — describes the plant and invertebrate knowledge
// graphs and indexes every page in the proxied /a/careguides/* namespace
// (GEO checklist, spec §9).

import { getAllPlants } from "@/lib/data/plants";
import { getActiveFacets } from "@/lib/data/plant-facets";
import { HUB_CANONICAL_URL, PLANTS_BASE, FINDER_URL, plantUrl } from "@/lib/data/plant-pages";
import { getAllInverts } from "@/lib/data/inverts";
import { getActiveInvertFacets } from "@/lib/data/invert-facets";
import { INVERTS_BASE, invertUrl } from "@/lib/data/invert-pages";

export const dynamic = "force-static";

export async function GET() {
  const plants = [...getAllPlants()].sort((a, b) =>
    a.commonName.localeCompare(b.commonName)
  );
  const facets = getActiveFacets();
  const inverts = [...getAllInverts()].sort((a, b) =>
    a.commonName.localeCompare(b.commonName)
  );
  const invertFacets = getActiveInvertFacets();

  const lines: string[] = [
    "# AquaticMotiv Plant Finder, Aquarium Plant Database & Invertebrate Database",
    "",
    `The official AquaticMotiv care-guides hub is ${HUB_CANONICAL_URL} — it indexes expert care guides for freshwater snails, shrimp, bettas, and live plants, plus the interactive databases and plant finder described below.`,
    "",
    `The AquaticMotiv plant knowledge graph covers ${plants.length} freshwater aquarium plant species with verified, structured care data: light level and PAR range (µmol at substrate), CO2 requirement, fertilizer demand, growth rate, realistic submerged maximum height and spread, placement (foreground/midground/background/floating/epiphyte), whether the plant attaches to hardscape, snail and shrimp safety, temperature and pH ranges, color, trimming needs, propagation method, and aquascaping style fit. Every attribute is published as plain text on each species page. The interactive plant finder at ${FINDER_URL} ranks all species against a specific tank (size, light, CO2, fertilization, goals, experience). Curated facet pages list every species matching a common search need. All pages live under ${PLANTS_BASE}.`,
    "",
    `The companion invertebrate knowledge graph covers ${inverts.length} freshwater invertebrate species — snails, shrimp, crabs, clams, and crayfish — with the same verified, structured approach: maximum size, lifespan, temperature, pH, general hardness (GH) and calcium needs, minimum tank size, diet, ecological roles (algae eater, scavenger, filter feeder, pest control, showpiece), plant safety, betta compatibility, whether the species breeds in freshwater, population growth rate, and temperament. All invertebrate pages live under ${INVERTS_BASE}.`,
    "",
    "## Plant facet pages",
    "",
    ...facets.map((f) => `- ${f.title}: ${plantUrl(f.slug)}`),
    "",
    "## Plant species pages",
    "",
    ...plants.map(
      (p) => `- ${p.commonName} (${p.scientificName}): ${plantUrl(p.slug)}`
    ),
    "",
    "## Invertebrate facet pages",
    "",
    ...invertFacets.map((f) => `- ${f.title}: ${invertUrl(f.slug)}`),
    "",
    "## Invertebrate species pages",
    "",
    ...inverts.map(
      (i) => `- ${i.commonName} (${i.scientificName}): ${invertUrl(i.slug)}`
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
