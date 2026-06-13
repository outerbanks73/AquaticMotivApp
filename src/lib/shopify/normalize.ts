import type { ShopifyProduct, StorefrontProductEdge } from "@/types/shopify";

/**
 * Canonical product categories for the configurator.
 * Consolidates Shopify's 35+ raw productType values into a clean taxonomy.
 */
export const PRODUCT_CATEGORIES = [
  "Plants",
  "Fish",
  "Invertebrates",
  "Rocks",
  "Driftwood",
  "Substrate",
  "CO2",
  "Lighting",
  "Fertilizers",
  "Tools",
  "Filtration",
  "Heaters",
  "Food",
  "Water Care",
  "Decor",
  "Botanicals",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/** Categories to exclude from the configurator (shipping supplies, gift cards) */
const EXCLUDED_TYPES = new Set([
  "heat/ice packs",
  "gift card",
]);

/** Direct mapping from raw productType (lowercased) → canonical category */
const TYPE_MAP: Record<string, ProductCategory> = {
  // Plants
  "plants": "Plants",
  "aquatic plants": "Plants",
  "aquarium plants": "Plants",
  "floating plants": "Plants",

  // Invertebrates
  "snail": "Invertebrates",
  "shrimp": "Invertebrates",
  "crabs": "Invertebrates",
  "mini crayfish": "Invertebrates",
  "clams": "Invertebrates",

  // Fish
  "bettas": "Fish",
  "guppy": "Fish",

  // Hardscape
  "rocks": "Rocks",
  "aquarium rock": "Rocks",
  "driftwood": "Driftwood",
  "aquarium gravel & substrates": "Substrate",
  "aquarium substrate": "Substrate",

  // Equipment
  "co2 equipment": "CO2",
  "co2 diffuser": "CO2",
  "co2 kit": "CO2",
  "aquarium lighting": "Lighting",
  "lighting": "Lighting",
  "sponge filter": "Filtration",
  "air pump": "Filtration",
  "ferts": "Fertilizers",

  // Accessories
  "tools": "Tools",
  "aquarium fish nets": "Tools",
  "aquarium water treatments": "Water Care",
  "aquarium test strips": "Water Care",

  // Decor
  "cave": "Decor",
  "aquarium decor": "Decor",
};

/**
 * Title-based keyword rules for classifying untagged products.
 * Checked in order — first match wins.
 */
const TITLE_RULES: Array<{ pattern: RegExp; category: ProductCategory }> = [
  // CO2 — check before tools (CO2 diffusers have "stainless steel" in name)
  { pattern: /\bco2\b|diffuser|bubble counter/i, category: "CO2" },

  // Lighting — vendor-heavy, check titles
  { pattern: /\bled\b.*light|light.*\bled\b|spectrum.*light|plant.*light|lamp|shades?.*led|hanging kit|bluetooth module/i, category: "Lighting" },

  // Fertilizers
  { pattern: /\bflourish\b|fertiliz|root tab|leaf zone|co2 booster|iron supplement|\beca\b.*iron|plant pack.*fundamental/i, category: "Fertilizers" },
  { pattern: /\b(envy|premier|propel|synthesis)\b/i, category: "Fertilizers" },

  // Water Care / Test Kits
  { pattern: /test (kit|strip)|ph (test|check|alert)|ammonia alert|alert combo|\bprime\b|\bstability\b|betta basics|water changer/i, category: "Water Care" },

  // Food
  { pattern: /algae\s*wafer|fish food|\bflakes\b|fry starter|invertebrate.*crustacean|new life spectrum/i, category: "Food" },

  // Botanicals (leaves, pods)
  { pattern: /\bleaves\b|\bpods?\b|botanicals? starter|catappa/i, category: "Botanicals" },

  // Heaters
  { pattern: /\bheater\b/i, category: "Heaters" },

  // Filtration
  { pattern: /\bfilter\b|lily pipe/i, category: "Filtration" },

  // Decor (coconut huts, etc.)
  { pattern: /coconut (hut|palm|petal|stem)|display stand/i, category: "Decor" },

  // Tools (scissors, forceps, shears, nets, glue, magnet cleaner, thermometer)
  { pattern: /tool kit|scissors|forceps|shears|\bnet\b|plant glue|flourish glue|magnet cleaner|thermometer/i, category: "Tools" },

  // Snails / Invertebrates (untagged snails, crabs)
  { pattern: /\bsnail|nerite|crab\b/i, category: "Invertebrates" },

  // Plants (catch remaining plant names)
  { pattern: /\brotala\b|pogostemon|riccia|banana plant|nymphoides/i, category: "Plants" },
];

/** Vendor-based fallback for lighting brands with untagged products */
const LIGHTING_VENDORS = new Set([
  "ledstar",
  "week aqua",
  "marggoo",
  "netlea",
]);

/**
 * Resolves a canonical category from raw Shopify productType, title, and vendor.
 * Priority: metafield → productType map → title keywords → vendor → "Other"
 */
function resolveCategory(
  metafieldCategory: string | null,
  productType: string,
  title: string,
  vendor: string,
): ProductCategory | null {
  // 1. Metafield override (if store has aquascaping/category set)
  if (metafieldCategory) {
    const normalized = metafieldCategory.trim();
    if (PRODUCT_CATEGORIES.includes(normalized as ProductCategory)) {
      return normalized as ProductCategory;
    }
  }

  const typeLower = productType.toLowerCase().trim();

  // 2. Exclude non-configurator products
  if (EXCLUDED_TYPES.has(typeLower)) {
    return null;
  }

  // 3. Direct productType mapping
  if (typeLower && typeLower in TYPE_MAP) {
    return TYPE_MAP[typeLower];
  }

  // 4. Title-based keyword matching (for untagged products)
  for (const rule of TITLE_RULES) {
    if (rule.pattern.test(title)) {
      return rule.category;
    }
  }

  // 5. Vendor-based fallback for lighting brands
  if (LIGHTING_VENDORS.has(vendor.toLowerCase().trim())) {
    return "Lighting";
  }

  return null;
}

function buildPlantAttributes(
  metafields: StorefrontProductEdge["node"]["metafields"],
): ShopifyProduct["plantAttributes"] {
  const get = (key: string) =>
    metafields?.find((m) => m?.key === key)?.value ?? null;
  const num = (key: string) => {
    const v = get(key);
    return v === null ? null : Number(v);
  };
  const bool = (key: string) => {
    const v = get(key);
    return v === null ? null : v === "true";
  };

  // Only build the object when plant-specific fields are actually present
  if (get("light_requirement") === null && get("plant_slug") === null) {
    return null;
  }

  return {
    scientificName: get("scientific_name"),
    light: get("light_requirement"),
    co2Required: bool("co2_required"),
    placement: get("placement")?.split(",").map((p) => p.trim()) ?? [],
    growthRate: get("growth_rate"),
    maxHeightIn: num("max_height_in"),
    spreadIn: num("spread_in"),
    attachesToHardscape: bool("attaches_to_hardscape"),
    snailSafe: bool("snail_safe"),
    parMin: num("par_min"),
    parMax: num("par_max"),
    fertDemand: get("fert_demand"),
    tempMinF: num("temp_min"),
    tempMaxF: num("temp_max"),
    phMin: num("ph_min"),
    phMax: num("ph_max"),
    plantSlug: get("plant_slug"),
  };
}

export function normalizeProduct(edge: StorefrontProductEdge): ShopifyProduct {
  const node = edge.node;

  const categoryMetafield = node.metafields?.find((m) => m?.key === "category");
  const careLevelMetafield = node.metafields?.find((m) => m?.key === "care_level");

  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtRaw = parseFloat(node.compareAtPriceRange.minVariantPrice.amount);
  const compareAtPrice = compareAtRaw > price ? compareAtRaw : null;

  const category = resolveCategory(
    categoryMetafield?.value ?? null,
    node.productType,
    node.title,
    node.vendor,
  ) ?? "Other";

  return {
    id: node.id,
    variantId: node.variants.edges[0]?.node.id ?? "",
    handle: node.handle,
    title: node.title,
    description: node.description,
    vendor: node.vendor,
    productType: node.productType,
    category,
    price,
    compareAtPrice,
    image: node.featuredImage?.url ?? null,
    imageAlt: node.featuredImage?.altText ?? null,
    availableForSale: node.availableForSale,
    tags: node.tags,
    careLevel: careLevelMetafield?.value ?? null,
    plantAttributes: buildPlantAttributes(node.metafields),
  };
}
