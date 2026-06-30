// Shared helpers for the /a/careguides SEO page layer.
// These pages are served on the store via a Shopify app proxy that covers ONLY
// aquaticmotiv.com/a/careguides/*. The hub canonicals to the strategic
// storefront URL; native species/tool pages stay in the app-proxy namespace.

import type { PlantSpecies, PlantDifficulty } from "@/types/plants";
import type { ShopifyProduct } from "@/types/shopify";
import { getAllShopifyProducts } from "@/lib/shopify/cache";

export const STORE_BASE = "https://aquaticmotiv.com";
export const CARE_BASE = `${STORE_BASE}/a/careguides`;
export const HUB_CANONICAL_URL = `${STORE_BASE}/freshwater-aquatic-planted-tank-guide`;
export const PLANTS_BASE = `${CARE_BASE}/plants`;
export const FINDER_URL = `${CARE_BASE}/finder`;

export function plantUrl(slug: string): string {
  return `${PLANTS_BASE}/${slug}`;
}

/** Lean per-handle commerce snapshot for plant pages. */
export interface PlantCommerceInfo {
  handle: string;
  title: string;
  price: number;
  availableForSale: boolean;
  image: string | null;
}

/**
 * Live price/stock keyed by Shopify handle. Tolerates Shopify (and the DB
 * override layer) being unavailable — pages render without commerce data.
 */
export async function getPlantCommerceByHandle(): Promise<
  Record<string, PlantCommerceInfo>
> {
  const byHandle: Record<string, PlantCommerceInfo> = {};
  try {
    const products: ShopifyProduct[] = await getAllShopifyProducts();
    for (const p of products) {
      byHandle[p.handle] = {
        handle: p.handle,
        title: p.title,
        price: p.price,
        availableForSale: p.availableForSale,
        image: p.image,
      };
    }
  } catch {
    // No commerce data — pages still render fully.
  }
  return byHandle;
}

export function commerceFor(
  plant: PlantSpecies,
  byHandle: Record<string, PlantCommerceInfo>
): PlantCommerceInfo | null {
  if (!plant.shopifyHandle) return null;
  return byHandle[plant.shopifyHandle] ?? null;
}

const DIFFICULTY_RANK: Record<PlantDifficulty, number> = {
  easy: 0,
  medium: 1,
  advanced: 2,
};

/** Sort: easy species first, then alphabetically by common name. */
export function sortByDifficultyThenName(species: PlantSpecies[]): PlantSpecies[] {
  return [...species].sort((a, b) => {
    const d = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
    return d !== 0 ? d : a.commonName.localeCompare(b.commonName);
  });
}

/** First sentence of a text block (for card blurbs / meta descriptions). */
export function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

/** First sentences up to ~maxLen chars — for meta descriptions. */
export function leadSentences(text: string, maxLen = 160): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    const next = (out + s).trim();
    if (out && next.length > maxLen) break;
    out = next;
    if (out.length > maxLen) break;
  }
  return out || text.slice(0, maxLen);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Up to `limit` in-stock alternatives sharing the plant's light level and at
 * least one placement value — shown when a species is out of stock/unmatched.
 */
export function findInStockAlternatives(
  plant: PlantSpecies,
  allPlants: PlantSpecies[],
  byHandle: Record<string, PlantCommerceInfo>,
  limit = 3
): { plant: PlantSpecies; commerce: PlantCommerceInfo }[] {
  const out: { plant: PlantSpecies; commerce: PlantCommerceInfo }[] = [];
  for (const candidate of sortByDifficultyThenName(allPlants)) {
    if (candidate.slug === plant.slug) continue;
    if (candidate.light !== plant.light) continue;
    if (!candidate.placement.some((pl) => plant.placement.includes(pl))) continue;
    const commerce = commerceFor(candidate, byHandle);
    if (!commerce?.availableForSale) continue;
    out.push({ plant: candidate, commerce });
    if (out.length >= limit) break;
  }
  return out;
}
