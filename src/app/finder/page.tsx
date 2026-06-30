import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPlants } from "@/lib/data/plants";
import { FINDER_URL } from "@/lib/data/plant-pages";
import { getAllShopifyProducts } from "@/lib/shopify/cache";
import { PlantFinderWizard, type FinderProductInfo } from "@/components/tools/PlantFinderWizard";

export const metadata: Metadata = {
  title: "Aquarium Plant Finder — Plants Matched to Your Exact Tank",
  description:
    "Answer four questions about your tank — size, light, CO2, and goals — and get ranked aquarium plant recommendations with honest care expectations, from 50+ species.",
  alternates: {
    canonical: FINDER_URL,
  },
};

export default async function PlantFinderPage() {
  const plants = getAllPlants();

  // Live price/stock for plants backed by a real SKU; tolerate Shopify being down.
  const productInfo: Record<string, FinderProductInfo> = {};
  try {
    const products = await getAllShopifyProducts();
    const byHandle = new Map(products.map((p) => [p.handle, p]));
    for (const plant of plants) {
      if (!plant.shopifyHandle) continue;
      const product = byHandle.get(plant.shopifyHandle);
      if (product) {
        productInfo[plant.shopifyHandle] = {
          price: product.price,
          availableForSale: product.availableForSale,
          image: product.image,
          variantId: product.variantId,
        };
      }
    }
  } catch {
    // Finder still works without live commerce data.
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 via-white to-leaf-50">
      <header className="relative overflow-hidden bg-gradient-to-b from-leaf-950 via-leaf-800 to-leaf-700 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 20% 0%, #8fb592 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 80% 10%, #ffd800 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            AquaticMotiv plant finder
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-5xl">
            Find the right plants for your tank
          </h1>
          <p className="mt-4 max-w-xl text-leaf-100">
            Answer four quick questions and get plants matched to your exact setup —
            the ones that thrive, not just survive. Grown across our 190+ tanks and
            shipped with a 100% live-arrival guarantee.
          </p>
        </div>
      </header>
      <Suspense>
        <PlantFinderWizard plants={plants} productInfo={productInfo} />
      </Suspense>
    </div>
  );
}
