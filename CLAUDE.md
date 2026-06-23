# CLAUDE.md

Load the SE Ranking and Shopify MCP connectors per task — when a task needs them — rather than every session. Same for SEO skills: load the relevant skill(s) for the task at hand.

## Project Overview

This is the official SEO/GEO project for Aquatic Motiv.  There are two main objectives:

1) Develop and operationalize the application (caled 'SaveAFish' in the ShopifyAdmin)  the goal of 
the application is to generate, manage and maintain a set of careguides for Freshwater Planted Aquariums.
It should be renamed - we can do that if needed.

The app will follow SEO best practices and optimize us for inclusion in AI responses.  The careguides 
will follow these guidelines:

    - Interlink the content that is ranking for snails / shrimps / crabs etc. to the hub of the care
    guide (at this url: https://aquaticmotiv.com/freshwater-aquatic-planted-tank-guide) and it will
    display content from here (https://careguides.aquaticmotiv.com/a/careguides) 

2) Provide generalized SEO guidance and insights into AquaticMotiv and help to implement fixes.  

    - Identify trends and make recommendations on how to improve SEO
    - Track competitors in their rankings and provide insights on how to stay competitve
    - Audit the website regularly and provide actionable fixes 


### Data Flow

All content lives as **JSON files** in `src/data/` (8 data sources: fish, guides, products, curation lists, comparisons, glossary, personas, examples). Data access functions in `src/lib/data/` load these JSON files synchronously and export query functions (`getAll*`, `get*BySlug`, `get*Slugs`, `get*sByCategory`). Guides additionally have MDX content files in `src/data/guides/content/`.

Every content type cross-references others via slug arrays (`relatedGuides`, `relatedFish`, `relatedProducts`, etc.).

`src/data/sampleProducts.ts` provides 40+ sample aquascaping products across 11 categories for dev/testing when Shopify API is unavailable.

### Configurator Architecture

### Component Organization

- `src/components/templates/` — One page template per content type (8 total)
- `src/components/layout/` — Header, Footer, Breadcrumbs
- `src/components/ui/` — Reusable primitives (Badge, Card, Rating)
- `src/components/seo/` — JsonLd schema generation
- `src/components/fish/`, `ecommerce/`, `content/` — Domain-specific components
- `src/components/configurator/` — Configurator components (TankSetup, CategorySidebar, ShopifyProductGrid, ShopifyProductCard, ConfigurationSummary, ConfiguratorShell, MobileFooter)

### SEO Infrastructure

- `src/app/sitemap.ts` — Programmatic sitemap built from all data sources
- `src/app/robots.ts` — Robots.txt config
- `src/lib/seo/` — Centralized `generatePageMetadata()` helper and schema generators
- `src/components/seo/JsonLd.tsx` — Schema.org markup (FAQPage, Article, Product, BreadcrumbList, DefinedTerm, ItemList)
- `src/lib/linking/` — Breadcrumb path builders

### Custom Theme

Tailwind is configured in `src/app/globals.css` (not tailwind.config) using Tailwind v4's `@theme inline` syntax. Custom color palettes: `aqua-*` (teal/accent), `ocean-*` (blue/primary), `coral-*`, `sand-*`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Adding New Content

To add a new content **type**: create the JSON data file, TypeScript types in `src/types/`, data access module in `src/lib/data/`, template component in `src/components/templates/`, and route pages under `src/app/`. Update `sitemap.ts` to include the new type.

## Response Length (STRICT — applies to EVERY session / window)

- **Environment:** Every session runs inside a **TMUX pane on this Linux VPS**. Vikram connects by SSH from a MacBook using iTerm2.
- **Hard rule:** Craft every response to output **no more than 3 paragraphs** before pausing and explicitly asking the user to continue.
- **No deviations.** This must be adhered to strictly in every window. Ignoring it reduces productivity and creates frustration for the end user.
