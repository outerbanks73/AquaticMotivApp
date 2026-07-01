# AquaticMotiv SEO Roadmap

Last updated: 2026-07-01.

## Current State

The care-guide hub now lives as a native Shopify page:

`https://aquaticmotiv.com/pages/freshwater-aquatic-planted-tank-guide`

The old `careguides.aquaticmotiv.com` app is removed from this repo. Future work should start with the Shopify page and existing Shopify articles/pages, not a rebuilt app.

## Phase 1: Protect The Hub

- Keep `freshwater-aquatic-planted-tank-guide` in the public URL.
- Keep the Shopify page body source in `shopify/pages/freshwater-aquatic-planted-tank-guide.html`.
- Verify desktop and mobile rendering after every page edit.
- Avoid app-proxy URLs unless a new plan explicitly requires them.

## Phase 2: Internal Linking

- Start with snail content because it already has ranking value.
- Add one or two contextual links from each relevant article/page back to the hub.
- Add a consistent related-article block with three or four suggestions.
- Keep anchor text natural and varied.
- Use `docs/internal-linking/` as the source of truth for link targets, pilot snippets, and batch status.

## Phase 3: Content Expansion

- Improve snail, shrimp, crab, and plant articles in priority order.
- Use answer-first sections, care stats, clear headings, and product/category links.
- Add new content only after the internal-link template is proven.

## Phase 4: Future Tools

Interactive tools, including a Plant Finder, require a separate scope, design, URL plan, QA plan, and rollback plan before implementation.
