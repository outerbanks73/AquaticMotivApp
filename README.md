# AquaticMotiv Care Guides

This repo now tracks the Shopify-hosted care guide landing page and supporting SEO planning notes. The legacy `careguides.aquaticmotiv.com` Next.js app has been decommissioned.

## Source Of Truth

- Live Shopify page: `https://aquaticmotiv.com/pages/freshwater-aquatic-planted-tank-guide`
- SEO redirect target: `https://aquaticmotiv.com/freshwater-aquatic-planted-tank-guide`
- Editable page body source: `shopify/pages/freshwater-aquatic-planted-tank-guide.html`
- Internal-linking workflow: `docs/internal-linking/`

The Shopify page, not a standalone app or app proxy route, is the current production surface. Keep `freshwater-aquatic-planted-tank-guide` in the public URL and page copy.

## Current Scope

- Maintain the static Shopify landing page.
- Preserve the canonical planted-tank guide URL.
- Keep existing SEO notes for future scoped work.
- Plan future work before rebuilding interactive tools.

## Removed

- Next.js app routes and components.
- PM2, Caddy, Docker, and deploy wrappers for `careguides.aquaticmotiv.com`.
- Plant Finder runtime code.
- JSON data loaders, recommender code, Storefront enrichment, sitemap, and `llms.txt` app routes.

## Working Rules

Use small, explicit changes. Do not reintroduce app-proxy routing, standalone app hosting, or Plant Finder code without a written scope and rollout plan.
