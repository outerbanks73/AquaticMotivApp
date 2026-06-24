# Care-Guides Scaling Plan — IA, Tools, and Mobile (to ~500 guides)

> Strategy plan produced 2026-06-24 from 5 research agents (4 strategy + 1 codebase reuse map).
> Companion to [`ROADMAP.md`](./ROADMAP.md) (see §2f). Three open decisions at the bottom are
> unresolved pending Vikram's call: first phase, mobile appetite, hub theme.

## Context

The care-guides hub (`/a/careguides`) renders a **flat, generated `hub.json`** whose cards link OUT to Shopify — a link directory, not browsable navigation. At ~91 cards it already feels long; at 500 it breaks. Goal: navigation that stays **intuitive, easy, and engaging** as we scale, using **3 meta-categories** (Plant Care / Invert Care / Tank Setup & Maintenance), plus evaluation of a **mobile app** (plant-ID + tank management) and **more interactive tools**.

**Decisive finding:** a production-grade **faceted-browse system already exists** — `src/lib/data/plant-facets.ts` (24 facets, `FacetGroup` = light/placement/goal/style), `src/lib/data/invert-facets.ts` (9 facets), each with H1/directAnswer/FAQs/predicate + a `MIN_SPECIES_PER_FACET` thin-content gate + facet-vs-species collision guards, plus A-Z indexes (`SpeciesSearchList`, `TYPE_SECTIONS`), a URL-synced `PlantFinderWizard`, and compatibility + recommender engines. **So the overhaul = promote the existing facet engine to the primary IA, put 3 meta-categories on top as the spine, and demote `hub.json` to a deep-link appendix — not a greenfield build.** Competitor research (Tropica, Buce Plant, Glass Aqua, Seriously Fish, 2Hr Aquarist, Aquasabi, Aquarium Co-Op) confirms placement + 3-tier difficulty as the universal plant axes and shows our opening: **no plant site combines a polished beginner wizard + plant-safe/algae-eating invert facets + tight per-guide commerce.**

---

## Recommended architecture

### Taxonomy — 3 meta-categories (validated)
- **Plant Care** · **Invert Care** · **Tank Setup & Maintenance**. No 4th category (the 15 free-text fish records are off-mission; betta already lives as `betta-tank`/`betta-safe-tankmates` facets). **Troubleshooting/algae = a prominent sub-hub inside Setup**, not a peer (keeps the maintenance cluster's link authority intact).
- Each meta-category is a **faceted hub** reusing the existing facet engine. Facet values (every one an indexable landing page, per Glass Aqua / programmatic-SEO):
  - **Plant Care:** placement (primary: carpet/foreground/midground/background/floating/epiphyte/moss) · care-level (easy/intermediate/advanced) · light · CO2 · tech-level (low/high) · color (incl. **red** — high-demand) · growth-rate · **botanical genus** (Anubias/Buce/Crypt/Rotala/Ludwigia/ferns/mosses — *new* facet group, strong SEO clusters).
  - **Invert Care:** type (snail/shrimp/crab/crayfish/clam) · **algae-eating** · **plant-safe** (differentiator) · temperament · difficulty · param ranges · shrimp color/grade.
  - **Tank Setup:** organized by **topic** (getting-started · substrate · lighting · CO2 · fertilization · filtration · algae/troubleshooting · maintenance/trimming · aquascaping styles · cycling) — requires a new `topic` enum on setup guides.
- Two cross-cutting facets: **tank-size suitability** (nano/standard/large) and **beginner-friendly** — these also feed the finder wizard.

### Navigation UX at 500 guides
Hub landing + **faceted browse** + a click-activated **mega-menu** (full-screen accordion on mobile: mobile-first, 44px targets, `clamp()` type). Client-side **autocomplete search** (common + scientific names + facet synonyms) — essential past ~150 guides. **A-Z index** (reuse `SpeciesSearchList`). 3-level breadcrumbs (`Hub › Meta › Guide`/`Facet`). **Sibling-facet chips** + **related-guide blocks** auto-generated from the existing `relatedGuides`/`relatedFish`/`relatedProducts` arrays (cheapest GEO/dwell win). Numbered crawlable pagination.

### Engagement layer
- **"My Tank"** favorites/stocking list (localStorage → "add all to cart").
- **Side-by-side comparison** tool (auto-built from JSON spec data).
- **"Best for…" comparison hubs** (2Hr pattern): best carpet plants for nano, best algae-eating plant-safe inverts, etc. — hub-and-spoke, high-intent + LLM-citable.
- **Find-My-Plant / Find-My-Invert** wizard (extend the existing `PlantFinderWizard` + recommender engine).

---

## Phase 0 — Critical fixes FIRST (de-risk, S)
Care-guides-scoped issues to fix before scaling (verified against the code 2026-06-24):
- **Broken `snail-safe` facet:** `snailSafe` is `true` on **all 102** plants in `src/data/plants/species.json` (0 false) → the facet matches everything. Fix the data or retire the facet.
- **Duplicate predicate:** `attach-to-wood` and `attach-to-stone` share an identical predicate (`p.attachesToHardscape`) in `src/lib/data/plant-facets.ts` — differentiate or merge.
- **Sub-gate invert types:** crab/crayfish/clam sit below `MIN_SPECIES_PER_FACET`, so they won't generate facet pages until backfilled.
- **Faceted-SEO indexation control:** add a `robots`/noindex mechanism in the **care-guide `[slug]` route metadata** so curated single facets index and multi-facet/sort pages are `noindex,follow`.

> **Correction (was wrong in the first draft):** `learn.aquaticmotiv.com` is **dead legacy**, hardcoded only in retired content-site code (`metadata.ts`, `breadcrumbs.ts`, `sitemap.ts`, `robots.ts`, the `/fish`·`/products`·`/guides` templates, configurator) — all routes already 301'd to `/a/careguides`. The care-guide pages do **not** use `generatePageMetadata`/`buildBreadcrumbs`; their canonicals already point to `aquaticmotiv.com/a/careguides` via `plant-pages.ts`. This is **not** a care-guides bug — optional legacy cleanup at most.

---

## Interactive tools — prioritized roadmap
Most are **data-light reuse** of the existing species DB + compatibility/recommender engines. Copy AqAdvisor's link-bait mechanic: every tool emits a **shareable permalink + embeddable widget**.
1. **Stocking/bioload calculator** (backlink + GEO magnet; AqAdvisor is dated).
2. **Pairwise compatibility pages** (programmatic; engine already exists — GEO gold).
3. **Build-my-tank bundle configurator** (highest conversion — multi-item cart).
4. **EI/CO2/dosing calculator** (names the exact SKU we sell).
5. **Volume/weight/glass calculator** (cheap, evergreen, ranks fast).
6. **Aquascape-style quiz** (most shareable; reuses personas + templates).
7. **Tank Doctor** (algae/deficiency diagnosis → sells the remedy).
Sleepers: **snail/shrimp/crab-safe plant & tank checker** (owns our niche), **CO2 drop-checker color→ppm coach**.

---

## Mobile track — PWA-first
- **Next.js PWA, Capacitor-wrap for app stores later** — NOT a React Native rewrite. Reuses `src/data/` JSON, `src/lib/data/`, species photos, and SEO templates almost entirely; PWA push works iOS 16.4+/Android; commerce stays web-native (no IAP tax on physical goods).
- **Management-first MVP** (multi-tank profiles, parameter logging + trends, recurring maintenance reminders, the calculators) — ships value even if ML lags.
- **Plant-ID = "Best Match" top-3 + confirm**, never "guaranteed ID": Pl@ntNet (free) re-ranked against our catalog → care guide → shop link; harvest every confirmation as a labeled real-tank photo; fine-tune an on-device model in v2. Submerged-plant ID is genuinely hard (top-1 ~40-65%, top-3 ~75-85%).
- **Phase 0 for mobile = audit the species photo set** (count images/species, emersed vs submerged) — that fact decides the ML path.
- Business case = retention → repeat fert/plant orders (consumables LTV) + camera as discovery funnel; risk = ML over-promise.

---

## Phased roadmap
- **Phase 0 (S):** data-facet fixes + faceted-SEO indexation control (above).
- **Phase 1 (M):** re-spine `/a/careguides` → 3 meta-categories + mega-menu + faceted hub; demote `hub.json` to a deep-link appendix surfaced within each meta.
- **Phase 2 (M):** facet-as-landing-page SEO (index curated single facets, `noindex,follow` multi-facet/sort), sitemap split, hub-and-spoke cluster linking, GEO schema hardening.
- **Phase 3 (L):** Setup content 6 → ~120 articles (add `topic` enum; lead with the algae/troubleshooting cluster for GEO).
- **Phase 4 (M):** engagement — "My Tank", comparison tool, Find-My-X wizard polish, "best for…" hubs.
- **Tools track (parallel):** ship #1–#3 first.
- **Mobile track (later/parallel per appetite):** photo audit → management MVP → Best Match camera.

---

## Critical files (reuse map — extend, don't rebuild)
- `src/components/tools/CareGuidesHub.tsx` + `src/data/guides/hub.json` + `scripts/gen_careguides_hub.py` — add a meta-category grouping field; demote to appendix.
- `src/lib/data/plant-facets.ts` / `invert-facets.ts` — extend facets (genus, type-fields), fix broken predicates.
- `src/app/a/careguides/plants/page.tsx` (+ `inverts/page.tsx`) — the **reference template** for the meta-hub faceted layout.
- Care-guide `[slug]` route metadata (`src/app/a/careguides/plants/[slug]` + `inverts/[slug]`) — add `robots`/noindex control for faceted SEO. (NOT the legacy `metadata.ts`/`breadcrumbs.ts`, which the care guides don't use.)
- `src/app/a/careguides/sitemap.xml/route.ts` — add meta + facet URLs; split by type.
- `src/lib/seo/schema.ts` — reuse `breadcrumbSchema`/`itemListSchema`/`collectionPageSchema`/`speciesSchema`.
- New: a `topic` enum for setup guides (`src/types` + `src/lib/data`); tool routes under `src/app/a/careguides/tools/*`.
- Theme note: hub uses `leaf`/`gold` (storefront), facet pages use `aqua`/`ocean` — unify (open decision).

## Verification
After each phase: `ASSET_ORIGIN=… npm run build` (host-guarded) + copy static + `pm2 restart careguides`; verify meta-hub + facet pages render and paginate; Lighthouse mobile (nav, 44px targets, no horizontal scroll); validate JSON-LD (Rich Results); confirm canonicals point to `aquaticmotiv.com/a/careguides`; check no facet crawl-traps (curated facets indexed, multi-facet `noindex`); SE Ranking technical audit (orphans, click-depth ≤3).

## Open decisions (unresolved — pending Vikram)
1. First implementation phase / priority. 2. Mobile-app appetite & timing. 3. Visual theme for the unified hub.
