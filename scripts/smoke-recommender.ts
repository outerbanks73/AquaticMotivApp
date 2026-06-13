// Smoke test for the recommender engine. Run with:
//   node --experimental-strip-types scripts/smoke-recommender.ts
// Asserts the hard-filter and ranking invariants against the real dataset.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert";
import { recommendPlants } from "../src/lib/recommender/engine.ts";
import type { PlantSpecies } from "../src/types/plants.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const species: PlantSpecies[] = JSON.parse(
  readFileSync(join(ROOT, "src/data/plants/species.json"), "utf8"),
);

function slugs(result: { plant: PlantSpecies }[]) {
  return result.map((r) => r.plant.slug);
}

// Scenario 1: beginner low-tech 10 gallon, no CO2, betta tank
const lowTech = recommendPlants(species, {
  tankGallons: 10,
  tankHeightIn: 12,
  light: "low",
  co2: "none",
  fertilization: "none",
  experience: "beginner",
  goals: ["betta_tank", "low_maintenance"],
});
const lowTechTop = slugs(lowTech.recommendations.slice(0, 8));
console.log("low-tech betta 10g top:", lowTechTop.join(", "));
const bySlug = (slug: string) => {
  const hit = lowTech.recommendations.find((r) => r.plant.slug === slug);
  assert(hit, `${slug} missing from recommendations`);
  return hit;
};
const topScore = lowTech.recommendations[0].score;
assert(bySlug("java-fern").score >= topScore - 5, "java fern should score near the top for low-tech betta");
assert(bySlug("anubias-nana").score >= topScore - 5, "anubias should score near the top for low-tech betta");
assert(
  slugs(lowTech.excluded).includes("jungle-val"),
  "jungle val (36in rosette) must be excluded from 12in-tall tank",
);
const excludedDHG = lowTech.recommendations.find((r) => r.plant.slug === "dwarf-hairgrass");
assert(
  !lowTechTop.slice(0, 5).includes("dwarf-hairgrass"),
  "medium-light carpet should not lead a low-light ranking",
);
if (excludedDHG) assert(excludedDHG.score < 60, "DHG should be penalized in low light");

// Scenario 2: high-tech iwagumi — CO2, high light, carpet goal
const highTech = recommendPlants(species, {
  tankGallons: 20,
  tankHeightIn: 14,
  light: "high",
  co2: "pressurized",
  fertilization: "comprehensive",
  experience: "intermediate",
  goals: ["carpet"],
});
const highTechTop = slugs(highTech.recommendations.slice(0, 6));
console.log("high-tech carpet 20g top:", highTechTop.join(", "));
assert(
  highTechTop.includes("monte-carlo") || highTechTop.includes("dwarf-hairgrass"),
  "carpet plants should lead a high-tech carpet query",
);

// Scenario 3: unheated coldwater tank at 62°F
const coldwater = recommendPlants(species, {
  tankGallons: 29,
  tankHeightIn: 18,
  light: "low",
  co2: "none",
  fertilization: "none",
  experience: "beginner",
  goals: [],
  temperatureF: 62,
});
const coldTop = slugs(coldwater.recommendations.slice(0, 6));
console.log("coldwater 62F top:", coldTop.join(", "));
assert(coldTop.includes("hornwort") || coldTop.includes("anacharis"), "coldwater classics should lead at 62F");
assert(
  slugs(coldwater.excluded).includes("anubias-nana"),
  "anubias (72F min) must be excluded at 62F",
);

// Invariants
for (const r of [lowTech, highTech, coldwater]) {
  for (const s of r.recommendations) {
    assert(s.hardFails.length === 0, "recommendation with hardFails");
    assert(s.score >= 0 && s.score <= 100, "score out of range");
  }
  for (const e of r.excluded) assert(e.hardFails.length > 0, "excluded without hardFails");
  const scores = r.recommendations.map((s) => s.score);
  assert(
    scores.every((v, i) => i === 0 || scores[i - 1] >= v),
    "recommendations not sorted",
  );
}

console.log("\nSMOKE TESTS PASSED");
