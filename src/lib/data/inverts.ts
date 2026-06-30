import type { InvertSpecies, InvertType } from "@/types/inverts";
import speciesData from "@/data/inverts/species.json";
import articleLinksData from "@/data/inverts/article-links.json";
import carePageLinksData from "@/data/inverts/care-page-links.json";

const inverts = speciesData as unknown as InvertSpecies[];

export interface InvertArticleLink {
  title: string;
  handle: string;
}

const articleLinks = articleLinksData as Record<string, InvertArticleLink[]>;

/** Published AquaticMotiv blog guides covering this species (same-domain links) */
export function getArticlesForInvert(slug: string): InvertArticleLink[] {
  return articleLinks[slug] ?? [];
}

const carePageLinks = carePageLinksData as Record<string, string>;

/**
 * Live care-guide Page handle for this species (aquaticmotiv.com/pages/{handle}).
 * Most invert coverage currently lives in Shopify blog articles; this hook keeps
 * the data model aligned with plant pages when future invert Pages are added.
 */
export function getCarePageForInvert(slug: string): string | undefined {
  return carePageLinks[slug];
}

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
