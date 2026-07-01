# CLAUDE.md

Load SE Ranking, Shopify MCP connectors, and SEO skills only when a task needs them. Do not load them by default.

## Project Overview

This repo is now a lightweight operations and SEO repository for the Aquatic Motiv care-guide hub. The legacy `careguides.aquaticmotiv.com` Next.js application has been removed.

The active public Shopify surface is:

`https://aquaticmotiv.com/pages/freshwater-aquatic-planted-tank-guide`

The keyword root URL should preserve and redirect to the Shopify page:

`https://aquaticmotiv.com/freshwater-aquatic-planted-tank-guide`

Do not move the care-guide hub back to the app proxy or standalone origin. Do not reintroduce Plant Finder code unless the user explicitly approves a new scoped build plan.

## Source Of Truth

- Static Shopify page body: `shopify/pages/freshwater-aquatic-planted-tank-guide.html`
- SEO and planning notes: `docs/`
- Agent instructions: `AGENTS.md` symlinks to this file.

## Current Scope

- Maintain the native Shopify page.
- Preserve the canonical SEO URL and planted-tank keyword language.
- Plan internal linking and content updates before implementation.
- Keep future changes small, reviewable, and tied to the SEO roadmap.

## Removed Scope

- Standalone Next.js app.
- `careguides.aquaticmotiv.com` PM2 runtime.
- Shopify app-proxy landing page.
- Plant Finder runtime code.
- Species pages, recommender code, JSON data loaders, app sitemap, and `llms.txt` route.
- Docker/Caddy/deploy wrappers for the old app.

## Validation

For page-body edits, verify the rendered Shopify page on desktop and mobile. There is no local Next.js build or lint step in this repo after the cleanup.

## Response Length

Every response must be no more than 3 paragraphs before pausing and explicitly asking the user to continue.
