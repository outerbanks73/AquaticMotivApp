// Plant knowledge graph types — see docs/PLANT_FINDER_SPEC.md §3.1

export type PlantType =
  | "stem"
  | "rosette"
  | "rhizome"
  | "moss"
  | "carpet"
  | "floating"
  | "bulb";

export type PlantDifficulty = "easy" | "medium" | "advanced";
export type LightLevel = "low" | "medium" | "high";
export type CO2Need = "none" | "beneficial" | "required";
export type FertDemand = "low" | "medium" | "high";
export type PlantGrowthRate = "slow" | "medium" | "fast";
export type PlantColor = "green" | "red" | "orange" | "variegated";
export type TrimmingNeed = "minimal" | "regular" | "frequent";

export type PlantPlacement =
  | "foreground"
  | "midground"
  | "background"
  | "floating"
  | "epiphyte";

export type PlantStyleTag =
  | "iwagumi"
  | "nature"
  | "dutch"
  | "jungle"
  | "biotope";

export interface PlantFaq {
  question: string;
  answer: string;
}

export interface PlantSpecies {
  slug: string;
  commonName: string;
  scientificName: string;
  synonyms: string[];
  type: PlantType;
  difficulty: PlantDifficulty;

  light: LightLevel;
  /** µmol PAR at substrate level; practical hobby range, not a lab figure */
  parMin?: number;
  parMax?: number;

  co2: CO2Need;
  fertDemand: FertDemand;

  maxHeightIn: number;
  spreadIn?: number;
  growthRate: PlantGrowthRate;

  placement: PlantPlacement[];
  attachesToHardscape: boolean;
  /** Survives grazing by common aquarium snails and shrimp */
  snailSafe: boolean;
  styles: PlantStyleTag[];

  temperatureF: { min: number; max: number };
  ph: { min: number; max: number };

  color: PlantColor;
  trimming: TrimmingNeed;
  propagation: string;

  careSummary: string;
  faqs: PlantFaq[];

  /** Live AquaticMotiv product handle; undefined = not currently stocked */
  shopifyHandle?: string;
  relatedGuides: string[];
  relatedFish: string[];
}
