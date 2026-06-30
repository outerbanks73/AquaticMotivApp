import { unstable_cache } from "next/cache";
import type { ShopifyProduct, StorefrontProductsResponse } from "@/types/shopify";
import { shopifyFetch, hasShopifyCredentials } from "./client";
import { PRODUCTS_QUERY } from "./queries";
import { normalizeProduct } from "./normalize";

async function loadSeedProducts(): Promise<ShopifyProduct[]> {
  const seed = await import("@/data/shopify-seed.json");
  return seed.default as ShopifyProduct[];
}

async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  if (!hasShopifyCredentials()) {
    return loadSeedProducts();
  }

  try {
    const products: ShopifyProduct[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const res: StorefrontProductsResponse = await shopifyFetch<StorefrontProductsResponse>(PRODUCTS_QUERY, {
        first: 250,
        after: cursor,
      });

      const edges = res.data.products.edges;
      products.push(...edges.map(normalizeProduct));

      hasNextPage = res.data.products.pageInfo.hasNextPage;
      cursor = res.data.products.pageInfo.endCursor;
    }

    return products;
  } catch {
    return loadSeedProducts();
  }
}

export const getAllShopifyProducts = unstable_cache(
  fetchAllProducts,
  ["shopify-products"],
  { revalidate: 86400 },
);

export async function getShopifyProductsByCategory(
  category: string,
): Promise<ShopifyProduct[]> {
  const all = await getAllShopifyProducts();
  return all.filter((p) => p.category === category);
}

export async function getShopifyCategories(): Promise<
  Array<{ name: string; count: number }>
> {
  const all = await getAllShopifyProducts();
  const counts = new Map<string, number>();

  for (const p of all) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
