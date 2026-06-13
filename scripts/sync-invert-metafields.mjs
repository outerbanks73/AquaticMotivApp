// Syncs invertebrate knowledge-graph attributes (src/data/inverts/species.json)
// onto live Shopify products as `aquascaping` metafields, matched by
// shopifyHandle. Idempotent — metafieldsSet overwrites in place.
//
// Usage: node scripts/sync-invert-metafields.mjs [--dry-run]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadEnv, mintAdminToken, adminGraphql, fetchProductIndex } from "./lib/shopify-admin.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

const CARE_LEVEL = { easy: "beginner", medium: "intermediate", advanced: "advanced" };

function metafieldsFor(species) {
  const fields = [
    // Shared keys (same semantics as the plant sync)
    ["category", "single_line_text_field", "Invertebrates"],
    ["care_level", "single_line_text_field", CARE_LEVEL[species.difficulty]],
    ["scientific_name", "single_line_text_field", species.scientificName],
    ["temp_min", "number_integer", String(species.temperatureF.min)],
    ["temp_max", "number_integer", String(species.temperatureF.max)],
    ["ph_min", "number_decimal", String(species.ph.min)],
    ["ph_max", "number_decimal", String(species.ph.max)],
    ["tank_size_min", "number_integer", String(species.tankSizeMinGal)],
    // Invert-specific keys
    ["gh_min", "number_integer", String(species.gh.min)],
    ["gh_max", "number_integer", String(species.gh.max)],
    ["lifespan_min_years", "number_decimal", String(species.lifespanYears.min)],
    ["lifespan_max_years", "number_decimal", String(species.lifespanYears.max)],
    ["max_size_in", "number_decimal", String(species.maxSizeIn)],
    ["plant_safe", "boolean", String(species.plantSafe)],
    ["betta_compatible", "single_line_text_field", species.bettaCompatible],
    ["population_growth", "single_line_text_field", species.populationGrowth],
    ["calcium_needs", "single_line_text_field", species.calciumNeeds],
    ["temperament", "single_line_text_field", species.temperament],
    ["roles", "single_line_text_field", species.roles.join(",")],
    ["breeds_in_freshwater", "boolean", String(species.breedsInFreshwater)],
    ["invert_slug", "single_line_text_field", species.slug],
  ];
  return fields.map(([key, type, value]) => ({ namespace: "aquascaping", key, type, value }));
}

const species = JSON.parse(readFileSync(join(ROOT, "src/data/inverts/species.json"), "utf8"));
const env = loadEnv();
const token = await mintAdminToken(env);

console.log("Building product index from Admin API...");
const index = await fetchProductIndex(env, token);
console.log(`${index.size} products in store.\n`);

const report = { synced: [], unmatched: [], skipped: [], failed: [] };

for (const sp of species) {
  if (!sp.shopifyHandle) {
    report.skipped.push(sp.slug);
    continue;
  }
  const product = index.get(sp.shopifyHandle);
  if (!product) {
    report.unmatched.push(`${sp.slug} -> ${sp.shopifyHandle}`);
    continue;
  }
  const metafields = metafieldsFor(sp).map((m) => ({ ...m, ownerId: product.id }));
  if (DRY_RUN) {
    console.log(`~ dry-run ${sp.slug} -> ${sp.shopifyHandle} (${metafields.length} fields)`);
    report.synced.push(sp.slug);
    continue;
  }
  const data = await adminGraphql(
    env,
    token,
    `mutation($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message code }
      }
    }`,
    { metafields },
  );
  const errs = data.metafieldsSet.userErrors;
  if (errs.length) {
    console.log(`! failed  ${sp.slug}: ${JSON.stringify(errs)}`);
    report.failed.push(sp.slug);
  } else {
    console.log(`+ synced  ${sp.slug} -> ${sp.shopifyHandle} (${metafields.length} fields)`);
    report.synced.push(sp.slug);
  }
}

console.log(`\nReport: ${report.synced.length} synced, ${report.unmatched.length} unmatched, ${report.skipped.length} not stocked, ${report.failed.length} failed.`);
if (report.unmatched.length) console.log("Unmatched handles:\n  " + report.unmatched.join("\n  "));
if (report.failed.length) process.exit(1);
