interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function definedTermSchema(term: string, definition: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description: definition,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    image: input.image,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: { "@type": "Person", name: input.author },
    publisher: {
      "@type": "Organization",
      name: "Aquatic Motiv",
    },
  };
}

export function productSchema(input: {
  name: string;
  description: string;
  url: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    brand: { "@type": "Brand", name: input.brand },
    offers: {
      "@type": "Offer",
      price: input.price,
      priceCurrency: "USD",
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: input.rating,
      reviewCount: input.reviewCount,
    },
  };
}

/**
 * Product schema for live Shopify SKUs (plant pages). Unlike productSchema,
 * emits no aggregateRating — we have no review data for these products.
 */
export function plantProductSchema(input: {
  name: string;
  description: string;
  url: string;
  image: string | null;
  price: number;
  inStock: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    brand: { "@type": "Brand", name: "AquaticMotiv" },
    offers: {
      "@type": "Offer",
      price: input.price,
      priceCurrency: "USD",
      url: input.url,
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

/** schema.org Taxon for a plant species page (see PLANT_FINDER_SPEC.md §5). */
export function speciesSchema(input: {
  commonName: string;
  scientificName: string;
  synonyms: string[];
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Taxon",
    name: input.commonName,
    taxonRank: "species",
    scientificName: input.scientificName,
    ...(input.synonyms.length > 0 ? { alternateName: input.synonyms } : {}),
    description: input.description,
    url: input.url,
  };
}

/** CollectionPage with an embedded ItemList — for hub/library pages. */
export function collectionPageSchema(input: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string; position: number }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { "@type": "WebSite", name: "Aquatic Motiv", url: "https://aquaticmotiv.com" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item) => ({
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
