// Plant recommender input/output types — docs/PLANT_FINDER_SPEC.md §6
// Note: relative imports (not @/) so the module runs under
// `node --experimental-strip-types` for smoke tests.

import type { PlantSpecies, LightLevel } from "../../types/plants";

export type CO2Setup = "none" | "liquid" | "pressurized";
export type FertRoutine = "none" | "root_tabs" | "liquid" | "comprehensive";
export type Experience = "beginner" | "intermediate" | "advanced";

export type RecommenderGoal =
  | "carpet"
  | "attach_to_hardscape"
  | "background_wall"
  | "red_accents"
  | "snail_safe"
  | "low_maintenance"
  | "floating_cover"
  | "betta_tank";

export interface RecommenderInput {
  /** Tank volume in gallons; null = unknown */
  tankGallons: number | null;
  /** Interior tank height in inches; null = unknown */
  tankHeightIn: number | null;
  /** Light level over the tank; null = unknown (treated leniently) */
  light: LightLevel | null;
  co2: CO2Setup;
  fertilization: FertRoutine;
  experience: Experience;
  goals: RecommenderGoal[];
  /** Steady tank temperature in °F, if known (e.g. 68 for unheated) */
  temperatureF?: number | null;
}

export interface ScoredPlant {
  plant: PlantSpecies;
  /** 0–100; only meaningful for eligible plants */
  score: number;
  /** Non-empty = excluded; each entry is a human-readable reason */
  hardFails: string[];
  /** "Why this fits" bullets shown with the recommendation */
  reasons: string[];
  /** Soft warnings worth surfacing alongside a recommendation */
  cautions: string[];
  /** True when a live, in-stock AquaticMotiv SKU backs this plant */
  inStock: boolean;
}

export interface RecommenderResult {
  /** Eligible plants, best first */
  recommendations: ScoredPlant[];
  /** Hard-filtered plants with the reasons they were excluded */
  excluded: ScoredPlant[];
}

export interface RecommenderOptions {
  /** Live availability keyed by shopifyHandle (from the Storefront pipeline) */
  stockByHandle?: ReadonlyMap<string, boolean>;
}
