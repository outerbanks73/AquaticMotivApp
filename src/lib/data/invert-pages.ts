// Shared helpers for the standalone /inverts SEO page layer.
// Canonical care-guide URLs live on careguides.aquaticmotiv.com; commerce
// links still point to aquaticmotiv.com.

import type { InvertSpecies, InvertDifficulty, InvertRole } from "@/types/inverts";
import {
  CARE_BASE,
  getPlantCommerceByHandle,
  type PlantCommerceInfo,
} from "@/lib/data/plant-pages";

// Re-export the shared text/URL helpers so invert templates have one import home.
export {
  STORE_BASE,
  CARE_BASE,
  HUB_CANONICAL_URL,
  PLANTS_BASE,
  FINDER_URL,
  capitalize,
  firstSentence,
  leadSentences,
} from "@/lib/data/plant-pages";

export const INVERTS_BASE = `${CARE_BASE}/inverts`;

export function invertUrl(slug: string): string {
  return `${INVERTS_BASE}/${slug}`;
}

/** Same lean per-handle commerce snapshot the plant pages use. */
export type InvertCommerceInfo = PlantCommerceInfo;

/**
 * Live price/stock keyed by Shopify handle. The snapshot is store-wide, so
 * the plant helper is reused directly — it already tolerates Shopify being
 * unavailable (pages render without commerce data).
 */
export const getInvertCommerceByHandle = getPlantCommerceByHandle;

export function invertCommerceFor(
  invert: InvertSpecies,
  byHandle: Record<string, InvertCommerceInfo>
): InvertCommerceInfo | null {
  if (!invert.shopifyHandle) return null;
  return byHandle[invert.shopifyHandle] ?? null;
}

const DIFFICULTY_RANK: Record<InvertDifficulty, number> = {
  easy: 0,
  medium: 1,
  advanced: 2,
};

/** Sort: easy species first, then alphabetically by common name. */
export function sortInvertsByDifficultyThenName(
  species: InvertSpecies[]
): InvertSpecies[] {
  return [...species].sort((a, b) => {
    const d = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
    return d !== 0 ? d : a.commonName.localeCompare(b.commonName);
  });
}

const ROLE_LABELS: Record<InvertRole, string> = {
  "algae-eater": "Algae eater",
  scavenger: "Scavenger",
  "filter-feeder": "Filter feeder",
  "pest-control": "Pest control",
  showpiece: "Showpiece",
};

export function roleLabel(role: InvertRole): string {
  return ROLE_LABELS[role];
}

export function bettaLabel(value: InvertSpecies["bettaCompatible"]): string {
  return value === "yes" ? "Yes" : value === "caution" ? "With caution" : "No";
}

/**
 * Up to `limit` in-stock alternatives of the same invert type — shown when a
 * species is out of stock or unmatched.
 */
export function findInStockInvertAlternatives(
  invert: InvertSpecies,
  allInverts: InvertSpecies[],
  byHandle: Record<string, InvertCommerceInfo>,
  limit = 3
): { invert: InvertSpecies; commerce: InvertCommerceInfo }[] {
  const out: { invert: InvertSpecies; commerce: InvertCommerceInfo }[] = [];
  for (const candidate of sortInvertsByDifficultyThenName(allInverts)) {
    if (candidate.slug === invert.slug) continue;
    if (candidate.type !== invert.type) continue;
    const commerce = invertCommerceFor(candidate, byHandle);
    if (!commerce?.availableForSale) continue;
    out.push({ invert: candidate, commerce });
    if (out.length >= limit) break;
  }
  return out;
}
