# Plant Finder Spec

The Plant Finder is the only interactive feature kept in the simplified care-guides app.
It lives at `/a/careguides/finder` and is designed to support the care-guide hub, not become a full configurator.

## Scope

- Input: experience, goals, tank size, light level, CO2, fertilization, and unheated/coldwater flag.
- Output: ranked plant recommendations from `src/data/plants/species.json` with clear fit reasons and cautions.
- Commerce enrichment: optional live Shopify price/stock from Storefront API; falls back cleanly when unavailable.
- State: URL query params for shareability; no server sessions, auth, or database.

## Architecture

- Page: `src/app/a/careguides/finder/page.tsx`
- UI: `src/components/tools/PlantFinderWizard.tsx`
- Engine: `src/lib/recommender/engine.ts`
- Types: `src/lib/recommender/types.ts`
- Tank presets: `src/data/tanks.ts`

The finder must remain lightweight and crawl-safe. Do not add accounts, saved tanks, dashboards, checkout handoffs, or multi-tool configurator behavior back into this app.
