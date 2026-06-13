// Structured plant attributes sourced from `aquascaping` metafields
// (populated by scripts/sync-plant-metafields.mjs from the knowledge graph)
export interface PlantAttributes {
  scientificName: string | null;
  light: string | null;
  co2Required: boolean | null;
  placement: string[];
  growthRate: string | null;
  maxHeightIn: number | null;
  spreadIn: number | null;
  attachesToHardscape: boolean | null;
  snailSafe: boolean | null;
  parMin: number | null;
  parMax: number | null;
  fertDemand: string | null;
  tempMinF: number | null;
  tempMaxF: number | null;
  phMin: number | null;
  phMax: number | null;
  /** Slug of the matching knowledge-graph entry (src/data/plants/species.json) */
  plantSlug: string | null;
}

// Normalized product shape used throughout the app
export interface ShopifyProduct {
  id: string;
  variantId: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  imageAlt: string | null;
  availableForSale: boolean;
  tags: string[];
  careLevel: string | null;
  /** Present when the product carries aquascaping plant metafields */
  plantAttributes: PlantAttributes | null;
}

// Cart types
export interface ShopifyCartLine {
  merchandiseId: string; // variant GID
  quantity: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
}

// Raw Storefront API response types
export interface StorefrontProductEdge {
  node: {
    id: string;
    handle: string;
    title: string;
    description: string;
    vendor: string;
    productType: string;
    tags: string[];
    availableForSale: boolean;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
    variants: {
      edges: Array<{
        node: {
          id: string;
        };
      }>;
    };
    metafields: Array<{
      key: string;
      value: string;
    } | null>;
  };
}

export interface StorefrontProductsResponse {
  data: {
    products: {
      edges: StorefrontProductEdge[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

export interface StorefrontCartCreateResponse {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}
