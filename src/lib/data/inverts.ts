import type { InvertSpecies, InvertType } from "@/types/inverts";
import speciesData from "@/data/inverts/species.json";

const inverts = speciesData as unknown as InvertSpecies[];

export function getAllInverts(): InvertSpecies[] {
  return inverts;
}

export function getInvertBySlug(slug: string): InvertSpecies | undefined {
  return inverts.find((i) => i.slug === slug);
}

export function getInvertSlugs(): string[] {
  return inverts.map((i) => i.slug);
}

export function getInvertsByType(type: InvertType): InvertSpecies[] {
  return inverts.filter((i) => i.type === type);
}

export function getStockedInverts(): InvertSpecies[] {
  return inverts.filter((i) => i.shopifyHandle);
}
