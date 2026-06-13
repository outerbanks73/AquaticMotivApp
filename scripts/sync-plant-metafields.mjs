// Syncs plant knowledge-graph attributes (src/data/plants/species.json)
// onto live Shopify products as `aquascaping` metafields, matched by
// shopifyHandle. Idempotent — metafieldsSet overwrites in place.
//
// Usage: node scripts/sync-plant-metafields.mjs [--dry-run]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadEnv, mintAdminToken, adminGraphql, fetchProductIndex } from "./lib/shopify-admin.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

const CARE_LEVEL = { easy: "beginner", medium: "intermediate", advanced: "advanced" };

function metafieldsFor(species) {
  const fields = [
    ["category", "single_line_text_field", "Plants"],
    ["care_level", "single_line_text_field", CARE_LEVEL[species.difficulty]],
    ["scientific_name", "single_line_text_field", species.scientificName],
    ["light_requirement", "single_line_text_field", species.light],
    ["co2_required", "boolean", String(species.co2 === "required")],
    ["placement", "single_line_text_field", species.placement.join(",")],
    ["growth_rate", "single_line_text_field", species.growthRate],
    ["max_height_in", "number_integer", String(species.maxHeightIn)],
    ["attaches_to_hardscape", "boolean", String(species.attachesToHardscape)],
    ["snail_safe", "boolean", String(species.snailSafe)],
    ["fert_demand", "single_line_text_field", species.fertDemand],
    ["temp_min", "number_integer", String(species.temperatureF.min)],
    ["temp_max", "number_integer", String(species.temperatureF.max)],
    ["ph_min", "number_decimal", String(species.ph.min)],
    ["ph_max", "number_decimal", String(species.ph.max)],
    ["plant_slug", "single_line_text_field", species.slug],
  ];
  if (species.spreadIn != null) fields.push(["spread_in", "number_integer", String(species.spreadIn)]);
  if (species.parMin != null) fields.push(["par_min", "number_integer", String(species.parMin)]);
  if (species.parMax != null) fields.push(["par_max", "number_integer", String(species.parMax)]);
  return fields.map(([key, type, value]) => ({ namespace: "aquascaping", key, type, value }));
}

const species = JSON.parse(readFileSync(join(ROOT, "src/data/plants/species.json"), "utf8"));
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
