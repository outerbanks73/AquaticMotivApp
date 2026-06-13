// Idempotently creates the `aquascaping` product metafield definitions
// (PRD §5.1 + plant-finder fields, docs/PLANT_FINDER_SPEC.md §4.1, plus
// invertebrate fields for src/data/inverts/species.json).
// Definitions get storefront PUBLIC_READ access so the theme editor
// (dynamic sources) and the Storefront API can both read them.
//
// Usage: node scripts/setup-metafield-definitions.mjs

import { loadEnv, mintAdminToken, adminGraphql } from "./lib/shopify-admin.mjs";

const DEFINITIONS = [
  { key: "category", name: "Category", type: "single_line_text_field" },
  { key: "care_level", name: "Care level", type: "single_line_text_field" },
  { key: "scientific_name", name: "Scientific name", type: "single_line_text_field" },
  { key: "light_requirement", name: "Light requirement", type: "single_line_text_field" },
  { key: "co2_required", name: "CO2 required", type: "boolean" },
  { key: "placement", name: "Placement", type: "single_line_text_field" },
  { key: "growth_rate", name: "Growth rate", type: "single_line_text_field" },
  { key: "max_height_in", name: "Max height (in)", type: "number_integer" },
  { key: "spread_in", name: "Spread (in)", type: "number_integer" },
  { key: "attaches_to_hardscape", name: "Attaches to hardscape", type: "boolean" },
  { key: "snail_safe", name: "Snail safe", type: "boolean" },
  { key: "par_min", name: "PAR min", type: "number_integer" },
  { key: "par_max", name: "PAR max", type: "number_integer" },
  { key: "fert_demand", name: "Fertilizer demand", type: "single_line_text_field" },
  { key: "temp_min", name: "Min temperature (F)", type: "number_integer" },
  { key: "temp_max", name: "Max temperature (F)", type: "number_integer" },
  { key: "ph_min", name: "Min pH", type: "number_decimal" },
  { key: "ph_max", name: "Max pH", type: "number_decimal" },
  { key: "plant_slug", name: "Plant guide slug", type: "single_line_text_field" },
  // Shared livestock fields
  { key: "tank_size_min", name: "Min tank size (gal)", type: "number_integer" },
  // Invertebrate fields (src/data/inverts/species.json)
  { key: "gh_min", name: "Min GH (dGH)", type: "number_integer" },
  { key: "gh_max", name: "Max GH (dGH)", type: "number_integer" },
  { key: "lifespan_min_years", name: "Min lifespan (years)", type: "number_decimal" },
  { key: "lifespan_max_years", name: "Max lifespan (years)", type: "number_decimal" },
  { key: "max_size_in", name: "Max size (in)", type: "number_decimal" },
  { key: "plant_safe", name: "Plant safe", type: "boolean" },
  { key: "betta_compatible", name: "Betta compatible", type: "single_line_text_field" },
  { key: "population_growth", name: "Population growth", type: "single_line_text_field" },
  { key: "calcium_needs", name: "Calcium needs", type: "single_line_text_field" },
  { key: "temperament", name: "Temperament", type: "single_line_text_field" },
  { key: "roles", name: "Roles (csv)", type: "single_line_text_field" },
  { key: "breeds_in_freshwater", name: "Breeds in freshwater", type: "boolean" },
  { key: "invert_slug", name: "Invert guide slug", type: "single_line_text_field" },
];

const env = loadEnv();
const token = await mintAdminToken(env);

const existing = await adminGraphql(
  env,
  token,
  `{ metafieldDefinitions(ownerType: PRODUCT, namespace: "aquascaping", first: 100) {
      nodes { key access { storefront } }
  } }`,
);
const existingKeys = new Map(existing.metafieldDefinitions.nodes.map((n) => [n.key, n]));

let created = 0, skipped = 0, failed = 0;
for (const def of DEFINITIONS) {
  if (existingKeys.has(def.key)) {
    console.log(`= exists  aquascaping.${def.key} (storefront: ${existingKeys.get(def.key).access?.storefront})`);
    skipped++;
    continue;
  }
  const data = await adminGraphql(
    env,
    token,
    `mutation($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id }
        userErrors { field message code }
      }
    }`,
    {
      definition: {
        name: def.name,
        namespace: "aquascaping",
        key: def.key,
        type: def.type,
        ownerType: "PRODUCT",
        pin: true,
        access: { storefront: "PUBLIC_READ" },
      },
    },
  );
  const errs = data.metafieldDefinitionCreate.userErrors;
  if (errs.length) {
    console.log(`! error   aquascaping.${def.key}: ${JSON.stringify(errs)}`);
    failed++;
  } else {
    console.log(`+ created aquascaping.${def.key} (${def.type})`);
    created++;
  }
}
console.log(`\nDone: ${created} created, ${skipped} already existed, ${failed} failed.`);
if (failed) process.exit(1);
