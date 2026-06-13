export const PRODUCTS_QUERY = `
  query AllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          title
          description
          vendor
          productType
          tags
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
          metafields(identifiers: [
            { namespace: "aquascaping", key: "category" },
            { namespace: "aquascaping", key: "care_level" },
            { namespace: "aquascaping", key: "scientific_name" },
            { namespace: "aquascaping", key: "light_requirement" },
            { namespace: "aquascaping", key: "co2_required" },
            { namespace: "aquascaping", key: "placement" },
            { namespace: "aquascaping", key: "growth_rate" },
            { namespace: "aquascaping", key: "max_height_in" },
            { namespace: "aquascaping", key: "spread_in" },
            { namespace: "aquascaping", key: "attaches_to_hardscape" },
            { namespace: "aquascaping", key: "snail_safe" },
            { namespace: "aquascaping", key: "par_min" },
            { namespace: "aquascaping", key: "par_max" },
            { namespace: "aquascaping", key: "fert_demand" },
            { namespace: "aquascaping", key: "temp_min" },
            { namespace: "aquascaping", key: "temp_max" },
            { namespace: "aquascaping", key: "ph_min" },
            { namespace: "aquascaping", key: "ph_max" },
            { namespace: "aquascaping", key: "plant_slug" }
          ]) {
            key
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
