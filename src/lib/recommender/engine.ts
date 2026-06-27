// Pure scoring engine for the plant recommender — docs/PLANT_FINDER_SPEC.md §6.
// Pipeline: hard filters -> weighted scoring -> ranked results with
// human-readable "why this fits" reasons. No I/O; deterministic.

import type { PlantSpecies, LightLevel } from "../../types/plants";
import type {
  RecommenderInput,
  RecommenderOptions,
  RecommenderResult,
  RecommenderGoal,
  ScoredPlant,
} from "./types";

const LIGHT_ORDER: Record<LightLevel, number> = { low: 0, medium: 1, high: 2 };

function hardFilter(plant: PlantSpecies, input: RecommenderInput): string[] {
  const fails: string[] = [];

  if (plant.co2 === "required" && input.co2 === "none") {
    fails.push("Needs injected CO2, which this tank doesn't have.");
  }

  // A plant that demands more light than the tank provides will starve.
  if (input.light && LIGHT_ORDER[plant.light] > LIGHT_ORDER[input.light]) {
    const gap = LIGHT_ORDER[plant.light] - LIGHT_ORDER[input.light];
    if (gap >= 2 || plant.light === "high") {
      fails.push(`Needs ${plant.light} light; this tank has ${input.light}.`);
    }
    // one-step gap for a medium-light plant is handled as a scoring penalty
  }

  // Rosettes and bulbs can't be height-managed by trimming the way stems can.
  if (
    input.tankHeightIn &&
    (plant.type === "rosette" || plant.type === "bulb") &&
    plant.maxHeightIn > input.tankHeightIn * 1.25
  ) {
    fails.push(
      `Grows to ${plant.maxHeightIn}" — too tall for a ${input.tankHeightIn}" tall tank.`,
    );
  }

  if (
    input.temperatureF != null &&
    (input.temperatureF < plant.temperatureF.min ||
      input.temperatureF > plant.temperatureF.max)
  ) {
    fails.push(
      `Happiest between ${plant.temperatureF.min}–${plant.temperatureF.max}°F; this tank runs ${input.temperatureF}°F.`,
    );
  }

  return fails;
}

function goalMatches(plant: PlantSpecies, goal: RecommenderGoal): string | null {
  switch (goal) {
    case "carpet":
      // Genuine carpeting plants that spread into a low lawn (Monte Carlo, dwarf
      // hairgrass, baby tears…). The old "any short foreground plant" heuristic
      // wrongly swept in epiphytes (Anubias Petite, Bucephalandra) and small
      // crypts that are foreground accents, not carpets — match on type instead.
      return plant.type === "carpet"
        ? "Forms the low carpet you're after"
        : null;
    case "attach_to_hardscape":
      return plant.attachesToHardscape
        ? "Attaches directly to stone and driftwood — no substrate needed"
        : null;
    case "background_wall":
      return plant.placement.includes("background") && plant.growthRate !== "slow"
        ? "Fills the back wall quickly"
        : null;
    case "red_accents":
      return plant.color === "red" || plant.color === "orange"
        ? "Brings the red coloration you want"
        : null;
    case "snail_safe":
      return plant.snailSafe ? "Holds up to snail and shrimp grazing" : null;
    case "low_maintenance":
      return plant.trimming === "minimal" && plant.growthRate !== "fast"
        ? "Barely needs trimming"
        : null;
    case "floating_cover":
      // True floating plants only (frogbit, salvinia, duckweed, red root
      // floaters…). Many stems CAN be left to drift, so their data lists
      // "floating" as a placement — but Anacharis/Hornwort/Water Sprite are not
      // what someone means by "floating cover", so match on type, not placement.
      return plant.type === "floating"
        ? "Provides the floating cover you asked for"
        : null;
    case "betta_tank":
      return plant.attachesToHardscape ||
        plant.type === "floating" ||
        (plant.light === "low" && plant.relatedFish.includes("betta-splendens"))
        ? "A classic betta-tank plant — gentle conditions, resting spots"
        : null;
  }
}

function scorePlant(
  plant: PlantSpecies,
  input: RecommenderInput,
  inStock: boolean,
): Omit<ScoredPlant, "hardFails"> {
  let score = 50;
  const reasons: string[] = [];
  const cautions: string[] = [];

  // --- Light fit ---
  if (input.light) {
    const diff = LIGHT_ORDER[input.light] - LIGHT_ORDER[plant.light];
    if (diff === 0) {
      score += 20;
      reasons.push(`Matched to your ${input.light}-light setup`);
    } else if (diff === 1) {
      score += 12; // tolerant: low-light plant under medium light is fine
      if (plant.growthRate === "slow") {
        cautions.push(
          "Slow grower under stronger light — give it some shade or shorter photoperiod to keep algae off the leaves.",
        );
      }
    } else if (diff === 2) {
      score += 4;
      cautions.push("Will grow, but expect algae pressure on a low-light plant under high light.");
    } else {
      // plant.light one step above input.light (medium plant, low tank)
      score -= 15;
      cautions.push("Below its preferred light — growth will be slow and sparse.");
    }
  }

  // --- CO2 fit ---
  if (plant.co2 === "none") {
    if (input.co2 === "none") {
      score += 10;
      reasons.push("No CO2 needed");
    }
  } else if (plant.co2 === "beneficial") {
    if (input.co2 !== "none") {
      score += 10;
      reasons.push("Takes full advantage of your CO2");
    } else {
      score -= 4;
    }
  } else if (plant.co2 === "required" && input.co2 !== "none") {
    score += 8;
    reasons.push("Your CO2 setup unlocks this demanding species");
  }

  // --- Fertilization fit ---
  const fertLevel = { none: 0, root_tabs: 1, liquid: 1, comprehensive: 2 }[input.fertilization];
  const demand = { low: 0, medium: 1, high: 2 }[plant.fertDemand];
  if (demand <= fertLevel) {
    score += 8;
  } else if (demand - fertLevel === 1) {
    score -= 4;
    cautions.push(
      plant.fertDemand === "high"
        ? "A heavy feeder — add root tabs or regular liquid dosing for best results."
        : "Appreciates some fertilization.",
    );
  } else {
    score -= 12;
    cautions.push("A heavy feeder; without fertilization it will limp along.");
  }

  // --- Difficulty vs experience ---
  const expLevel = { beginner: 0, intermediate: 1, advanced: 2 }[input.experience];
  const diffLevel = { easy: 0, medium: 1, advanced: 2 }[plant.difficulty];
  if (diffLevel === 0) {
    score += expLevel === 0 ? 12 : 6;
    if (expLevel === 0) reasons.push("Genuinely beginner-proof");
  } else if (diffLevel > expLevel) {
    score -= 12 * (diffLevel - expLevel);
    cautions.push("A step up in difficulty from your experience level.");
  }

  // --- Goals ---
  // The user's selected goals are explicit intent and must dominate the ranking.
  // A plant that delivers a requested goal is boosted hard; one that misses it is
  // demoted — otherwise generic light/CO2/in-stock bonuses float easy green plants
  // above the red showpieces (etc.) the user actually asked for. With multiple
  // goals selected, plants that satisfy more of them naturally rise to the top.
  // `goalsMet` lets the UI show ONLY plants that deliver the goal, instead of
  // dumping every plant that merely survives the tank's hard filters.
  const metGoals: RecommenderGoal[] = [];
  for (const goal of input.goals) {
    const match = goalMatches(plant, goal);
    if (match) {
      metGoals.push(goal);
      score += 22;
      reasons.push(match);
    } else {
      score -= 12;
    }
  }

  // --- Tank size niceties ---
  if (input.tankGallons != null && input.tankGallons <= 10) {
    if (plant.maxHeightIn <= 8) {
      score += 5;
      reasons.push("Scaled right for a nano tank");
    } else if (plant.maxHeightIn > 16 && plant.type === "stem") {
      cautions.push("Fast vertical grower — plan on frequent trimming in a small tank.");
    }
  }

  // --- Stock bonus ---
  if (inStock) {
    score += 8;
  }

  return {
    plant,
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
    cautions,
    inStock,
    goalsMet: metGoals.length,
    metGoals,
  };
}

export function recommendPlants(
  species: PlantSpecies[],
  input: RecommenderInput,
  options: RecommenderOptions = {},
): RecommenderResult {
  const recommendations: ScoredPlant[] = [];
  const excluded: ScoredPlant[] = [];

  for (const plant of species) {
    const inStock = plant.shopifyHandle
      ? options.stockByHandle?.get(plant.shopifyHandle) ?? false
      : false;
    const hardFails = hardFilter(plant, input);
    const scored = { ...scorePlant(plant, input, inStock), hardFails };
    (hardFails.length ? excluded : recommendations).push(scored);
  }

  // Plants that satisfy MORE of the user's goals always rank first — so when two
  // goals are picked, anything matching both leads, then single-goal matches.
  // Within the same goals-met tier, fall back to the fit score.
  recommendations.sort(
    (a, b) =>
      b.goalsMet - a.goalsMet ||
      b.score - a.score ||
      b.reasons.length - a.reasons.length ||
      a.cautions.length - b.cautions.length ||
      a.plant.commonName.localeCompare(b.plant.commonName),
  );
  return { recommendations, excluded };
}
