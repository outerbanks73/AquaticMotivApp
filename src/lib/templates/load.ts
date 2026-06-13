import type { AquascapeTemplate } from "@/data/templates";
import type { ConfiguratorState } from "@/types/configurator";
import type { ShopifyProduct } from "@/types/shopify";
import { TANK_SIZES } from "@/data/tanks";
import { getProductById } from "@/data/sampleProducts";

export function loadTemplate(
  template: AquascapeTemplate,
  availableProducts: ShopifyProduct[]
): ConfiguratorState {
  const tank = TANK_SIZES.find((t) => t.id === template.tankId) ?? null;

  const items = template.productIds
    .map((productId) => {
      // Try to find in the available Shopify products first
      const shopifyProduct = availableProducts.find((p) => p.id === productId);
      if (shopifyProduct) {
        return { product: shopifyProduct, quantity: 1 };
      }

      // Fall back to sample product data (create a minimal ShopifyProduct)
      const sampleProduct = getProductById(productId);
      if (sampleProduct) {
        const firstVariant = sampleProduct.variants[0];
        const product: ShopifyProduct = {
          id: sampleProduct.id,
          variantId: firstVariant?.id ?? sampleProduct.id,
          handle: sampleProduct.id,
          title: sampleProduct.title,
          description: sampleProduct.description,
          vendor: sampleProduct.vendor,
          productType: sampleProduct.category,
          category: sampleProduct.category,
          price: firstVariant?.price ?? 0,
          compareAtPrice: firstVariant?.compareAtPrice ?? null,
          image: sampleProduct.images[0] ?? null,
          imageAlt: sampleProduct.title,
          availableForSale: firstVariant?.available ?? true,
          tags: sampleProduct.tags,
          careLevel: sampleProduct.careLevel
            ? sampleProduct.careLevel.charAt(0).toUpperCase() +
              sampleProduct.careLevel.slice(1)
            : null,
          plantAttributes: null,
        };
        return { product, quantity: 1 };
      }

      return null;
    })
    .filter(
      (item): item is { product: ShopifyProduct; quantity: number } =>
        item !== null
    );

  return {
    tank,
    tankDimensions: null,
    style: template.style,
    items,
    activeCategory: null,
    configurationName: template.name,
  };
}
