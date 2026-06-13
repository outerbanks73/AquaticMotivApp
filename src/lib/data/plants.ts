import type {
  PlantSpecies,
  LightLevel,
  PlantPlacement,
  PlantStyleTag,
} from "@/types/plants";
import speciesData from "@/data/plants/species.json";
import articleLinksData from "@/data/plants/article-links.json";
import carePageLinksData from "@/data/plants/care-page-links.json";

const plants = speciesData as unknown as PlantSpecies[];

export interface PlantArticleLink {
  title: string;
  handle: string;
}

const articleLinks = articleLinksData as Record<string, PlantArticleLink[]>;

/** Published AquaticMotiv blog guides covering this species (same-domain links) */
export function getArticlesForPlant(slug: string): PlantArticleLink[] {
  return articleLinks[slug] ?? [];
}

const carePageLinks = carePageLinksData as Record<string, string>;

/**
 * Live care-guide Page handle for this species (aquaticmotiv.com/pages/{handle}).
 * These pages convert and are never redirected (owner decision 2026-06-12) —
 * species pages link to them and take a differentiated, specs-intent title.
 */
export function getCarePageForPlant(slug: string): string | undefined {
  return carePageLinks[slug];
}

export function getAllPlants(): PlantSpecies[] {
  return plants;
}

export function getPlantBySlug(slug: string): PlantSpecies | undefined {
  return plants.find((p) => p.slug === slug);
}

export function getPlantSlugs(): string[] {
  return plants.map((p) => p.slug);
}

export function getPlantsByLight(light: LightLevel): PlantSpecies[] {
  return plants.filter((p) => p.light === light);
}

export function getPlantsByPlacement(placement: PlantPlacement): PlantSpecies[] {
  return plants.filter((p) => p.placement.includes(placement));
}

export function getPlantsByStyle(style: PlantStyleTag): PlantSpecies[] {
  return plants.filter((p) => p.styles.includes(style));
}

export function getStockedPlants(): PlantSpecies[] {
  return plants.filter((p) => p.shopifyHandle);
}
