export type InvertType = "snail" | "shrimp" | "clam" | "crab" | "crayfish";
export type InvertDifficulty = "easy" | "medium" | "advanced";
export type PopulationGrowth = "none" | "slow" | "fast";
export type InvertRole =
  | "algae-eater"
  | "scavenger"
  | "filter-feeder"
  | "pest-control"
  | "showpiece";
export type BettaCompatibility = "yes" | "caution" | "no";

export interface InvertFaq {
  question: string;
  answer: string;
}

export interface InvertSpecies {
  slug: string;
  commonName: string;
  scientificName: string;
  synonyms: string[];
  type: InvertType;
  difficulty: InvertDifficulty;
  maxSizeIn: number;
  lifespanYears: { min: number; max: number };
  temperatureF: { min: number; max: number };
  ph: { min: number; max: number };
  /** General hardness in dGH — critical for shell/exoskeleton health */
  gh: { min: number; max: number };
  tankSizeMinGal: number;
  diet: string[]; // e.g. ["algae", "biofilm", "detritus", "blanched vegetables"]
  roles: InvertRole[];
  plantSafe: boolean; // won't eat healthy plants
  bettaCompatible: BettaCompatibility;
  breedsInFreshwater: boolean;
  populationGrowth: PopulationGrowth; // in a typical freshwater tank
  temperament: "peaceful" | "predatory";
  /** Calcium demand for shell health */
  calciumNeeds: "low" | "medium" | "high";
  brackishNotes?: string; // e.g. nerite breeding requirements
  careSummary: string;
  faqs: InvertFaq[];
  shopifyHandle?: string;
  relatedPlants: string[]; // plant slugs from src/data/plants/species.json
  relatedGuides: string[];
}
