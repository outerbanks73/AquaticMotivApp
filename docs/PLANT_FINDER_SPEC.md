# Plant Finder & Knowledge Graph — Specification (Option A)

> **RESCOPE (2026-06-12, owner direction):** (1) Scope is **plants AND invertebrates**
> (snails/shrimp/clams/crabs — the store's volume business; 91 snail SKUs, zero
> existing invert care content). (2) The effort must **strengthen the existing
> content**: 30 plant care-guide Pages under /pages/* (one per species, not linked
> to products) and 12 blog "Plant Profile" articles are disjoint surfaces to be
> consolidated with the new structured pages — guide→product/tool linking moves
> from Phase 6 into the current phase. (3) URL namespace restructured from
> `/tools/plants/*` to **`/tools/care/*`** (`/tools/care/plants/...`,
> `/tools/care/inverts/...`, `/tools/care/finder`) so one app proxy covers all
> verticals; app proxy subpath re-released as `tools/care`. (4) **OWNER DECISION
> (2026-06-12): NO 301s.** The /pages/ care guides convert and stay live
> permanently. Coexistence architecture instead: species pages link to their
> matching care guide ("Go deeper", src/data/plants/care-page-links.json) and
> take a differentiated specs-intent meta title where a guide exists, so the two
> surfaces target different queries. Reverse links (care guides -> species
> page/finder/products) ship as an owner-approved Admin API batch. Because the
> pages stay live, the page-side corrections in docs/BLOG_CORRECTIONS_REVIEW.md
> (notably the false Salvinia federal noxious-weed claim) are now REQUIRED fixes,
> not optional.

**Status:** Draft for owner sign-off
**Date:** 2026-06-12
**Decisions already made:** App-proxy integration on aquaticmotiv.com (`/tools/` prefix) · self-rendered pages with theme-matched header/footer · owner publishes theme changes · SEO + GEO (AI-answer visibility) are the headline objectives · sequence is Recommender → Visual Designer → Growth Simulation.

---

## 1. Objectives

1. **Traffic:** Own the long-tail plant-selection SERPs ("low light aquarium plants", "plants that attach to stone", "carpet plants no CO2") currently held by static listicles. No interactive competitor exists (verified 2026-06-11).
2. **GEO:** Become the source AI assistants cite for plant-selection questions. Pages are structured answer-first with machine-readable data on the store's own domain.
3. **Conversion:** Every recommendation resolves to an in-stock AquaticMotiv SKU with same-session add-to-cart into the native store cart.
4. **Foundation:** The species dataset (growth rate, dimensions, light/CO2 response) is the prerequisite data layer for the Phase B visual designer and Phase C growth simulation.

### Success metrics

| Metric | How measured | 6-month target |
|---|---|---|
| Indexed tool pages | Search Console coverage | 200+ |
| Organic clicks to /tools/* | Search Console | meaningful share of site clicks; growth month-over-month |
| AI-assistant referrals | Referrer analytics (chatgpt.com, perplexity.ai, claude.ai, copilot) | present and growing |
| Finder → add-to-cart rate | Analytics event | ≥ 8% of finder sessions |
| Plant pages with live SKU match | Sync report | ≥ 80% of stocked species |

---

## 2. Architecture overview

```
Shopper / Googlebot / GPTBot
        │
aquaticmotiv.com/tools/*        (Shopify app proxy, prefix: /tools)
        │  forwarded by Shopify
Hetzner VPS — this Next.js app  (routes under src/app/tools/)
        │
   ┌────┴─────────────┐
   │ plants.json       │  knowledge graph (repo, version-controlled)
   │ recommender lib   │  pure scoring functions
   │ Shopify Storefront│  live price/stock (existing src/lib/shopify/)
   └──────────────────┘

Custom Shopify app (private, this store only)
   ├─ Admin API: metafield definitions + sync (plants.json → products)
   ├─ Admin API: blog article publish/update (MDX → Shopify blog)
   └─ App proxy configuration (/tools → https://<host>/tools)
```

Key properties:

- **Pages are self-rendered full HTML** (not `application/liquid`): we keep complete control of `<title>`, meta, canonical, Open Graph, and JSON-LD. Header/footer are rebuilt in this app to match the live theme, with nav links pointing at real store URLs.
- **Stateless by design.** Shopify strips `Set-Cookie` from proxied responses, so no server sessions, no NextAuth behind the proxy. Finder state lives in URL query params (shareable links) and `localStorage` (same pattern the configurator already uses).
- **Cart is the store's own cart.** Client-side `POST /cart/add.js` is same-origin on aquaticmotiv.com, so items land in the theme's cart drawer and normal checkout. No Storefront-API cart, no checkout handoff.
- **Assets:** `assetPrefix` set to the Hetzner host's absolute URL so `/_next/*` resources load directly (those paths aren't proxied). Page HTML comes through the proxy; static assets come from our host.
- **Canonical discipline:** every page emits `<link rel="canonical" href="https://aquaticmotiv.com/tools/...">`. Requests hitting the Hetzner hostname directly get `X-Robots-Tag: noindex` middleware so the origin never competes with the proxied URLs.

---

## 3. The plant knowledge graph

### 3.1 Storage and shape

Follows the repo's content-type conventions: JSON data + types + data-access module.

- `src/data/plants/species.json` — the dataset (~200 species at launch)
- `src/types/plants.ts` — types below
- `src/lib/data/plants.ts` — `getAllPlants()`, `getPlantBySlug()`, `getPlantSlugs()`, `getPlantsByFacet()`

```ts
interface PlantSpecies {
  slug: string;                    // 'java-fern'
  commonName: string;
  scientificName: string;
  synonyms: string[];              // search aliases, old taxonomy
  type: 'stem' | 'rosette' | 'rhizome' | 'moss' | 'carpet' | 'floating' | 'bulb';
  difficulty: 'easy' | 'medium' | 'advanced';

  // Light — both bucket (UI) and PAR (data credibility, GEO)
  light: 'low' | 'medium' | 'high';
  parMin?: number;                 // µmol PAR at substrate
  parMax?: number;

  co2: 'none' | 'beneficial' | 'required';
  fertDemand: 'low' | 'medium' | 'high';

  // Dimensions & growth — also feeds Phase C growth simulation
  maxHeightIn: number;
  spreadIn?: number;
  growthRate: 'slow' | 'medium' | 'fast';

  placement: ('foreground' | 'midground' | 'background' | 'floating' | 'epiphyte')[];
  attachesToHardscape: boolean;
  snailSafe: boolean;              // survives common snail/shrimp grazing
  styles: ('iwagumi' | 'nature' | 'dutch' | 'jungle' | 'biotope')[];

  temperatureF: { min: number; max: number };
  ph: { min: number; max: number };

  color: 'green' | 'red' | 'orange' | 'variegated';
  trimming: 'minimal' | 'regular' | 'frequent';
  propagation: string;             // short prose

  careSummary: string;             // 2–3 sentence answer-first paragraph
  faqs: { question: string; answer: string }[];   // 2–4 per species

  shopifyHandle?: string;          // live SKU match; null = not stocked
  relatedGuides: string[];         // existing cross-reference convention
  relatedFish: string[];
}
```

### 3.2 Compilation plan

- ~200 species bootstrapped by Claude from public horticultural knowledge. Facts (light needs, dimensions, temperature ranges) are not copyrightable; **no text is copied from Tropica, Flowgrow, or retailer sites** — `careSummary`/`faqs` are original prose.
- Batched for owner review (~25 species per batch) as PRs. Vikram is the domain reviewer; his corrections are the moat (this dataset is what no competitor licensed either).
- Priority order: (1) every plant AquaticMotiv currently stocks (~stocked catalog first → maximizes SKU-matched pages), (2) top community-requested species, (3) long tail.
- `shopifyHandle` matching: automated pass matches `scientificName`/`commonName` against live product titles/handles; ambiguous matches flagged for review.

---

## 4. Shopify custom app

Private custom app on the store (Settings → Apps → Develop apps). **This supersedes PRD NFR-16 ("no write access to aquaticmotiv.com")** — write access is now required and scoped narrowly.

- **Scopes:** `read_products`, `write_products` (metafields only), `read_content`, `write_content` (blog), `read_themes` (verification only).
- **Token storage:** `SHOPIFY_ADMIN_TOKEN` in `.env.local`, never committed (existing convention).

### 4.1 Metafield definitions

Extends PRD §5.1 (namespace `aquascaping`). New plant fields:

| Key | Type | Source |
|---|---|---|
| `growth_rate` | single_line_text | species.json |
| `max_height_in` | integer | species.json |
| `spread_in` | integer | species.json |
| `attaches_to_hardscape` | boolean | species.json |
| `snail_safe` | boolean | species.json |
| `par_min` / `par_max` | integer | species.json |
| `fert_demand` | single_line_text | species.json |
| `plant_slug` | single_line_text | back-reference to /tools/plants/[slug] |

All definitions created **with storefront visibility enabled** so (a) the theme editor can render them via dynamic sources (product-page badges) and (b) the existing Storefront API pipeline can query them.

### 4.2 Sync script

`scripts/sync-plant-metafields.ts` (run manually or in CI): reads `species.json`, matches `shopifyHandle`, writes metafields via Admin GraphQL `metafieldsSet` (25 per mutation, rate-limit aware). Produces a report: matched / unmatched / drifted. Idempotent.

### 4.3 Storefront query extension

`src/lib/shopify/queries.ts` currently fetches only `category` + `care_level` metafields. Extend to the full `aquascaping` namespace; `normalize.ts` maps them onto `ShopifyProduct`. This closes the long-standing gap where live products carry no attributes — and makes the existing compatibility engine work against live data instead of sample IDs.

### 4.4 App proxy

- **As built (2026-06-12, current = app version `v6-a-careguides-path`):** Shopify proxies claim `prefix + one subpath` from the fixed prefix set (apps|a|community|tools). Final claim: `a/careguides` → `https://careguides.aquaticmotiv.com/a/careguides`. Public URLs are `aquaticmotiv.com/a/careguides/...` (owner wanted "careguides" visible in URLs and "tools" gone; a root-level `/careguides/` is impossible without replatforming). Origin host `careguides.aquaticmotiv.com` is a noindexed backend subdomain pointing at the Hetzner VPS `178.156.192.155`; saveafish.org is no longer used anywhere. Owner's DNS action: A record `careguides.aquaticmotiv.com → 178.156.192.155`.
- **Auth as built:** the legacy admin custom-app flow no longer exists; the app lives in the Shopify Dev Dashboard (SaveAFish, client ID `ae48c1233dac1c69db7fc9c8345d924c`, installed on the store 2026-06-12). Scripts authenticate via the **client credentials grant** — `SHOPIFY_APP_CLIENT_ID`/`SHOPIFY_APP_CLIENT_SECRET` in `.env.local` mint a 24h admin token per run (`scripts/lib/shopify-admin.mjs`). Supersedes the static-token plan.
- Signature verification middleware (HMAC of query params with app secret) on any route with side effects; public pages tolerate unsigned direct hits (they're noindexed, §2).

---

## 5. Pages & URLs

All under `aquaticmotiv.com/tools/`, implemented in `src/app/tools/`, statically generated (`generateStaticParams`) and revalidated on deploy. One namespace `/tools/plants/[slug]` serves both facets and species; facet slugs are a reserved list and the build fails on collision.

| Page | URL | Count | Notes |
|---|---|---|---|
| Finder wizard | `/tools/plant-finder` | 1 | Stateless; state in query params |
| Plants hub | `/tools/plants` | 1 | A–Z + facet directory |
| Species profiles | `/tools/plants/java-fern` | ~200 | Profile, specs table, buy block, FAQs |
| Facet pages | `/tools/plants/low-light` | ~25 | One per reserved facet slug |
| Two-facet combos | `/tools/plants/low-light/no-co2` | ~15–30 | **Gated: generated only if ≥ 6 species match**; curated allowlist of sensible pairs |
| Sitemap | `/tools/sitemap.xml` | 1 | Submitted in Search Console; referenced from `robots.txt.liquid` |

Launch facet slugs: `low-light`, `medium-light`, `high-light`, `no-co2`, `attach-to-stone`, `attach-to-wood`, `carpet`, `foreground`, `midground`, `background`, `floating`, `under-3-inches`, `nano-tank`, `snail-safe`, `shrimp-safe`, `red`, `fast-growing`, `slow-growing`, `low-maintenance`, `iwagumi`, `dutch-style`, `jungle-style`, `beginner`, `betta-tank`, `cold-water`.

### Page anatomy (species + facet pages)

1. **H1 phrased as the query** ("Aquarium plants that grow in low light") + one-paragraph direct answer (extractable by AI).
2. Ranked/structured data: spec table (species) or sortable ranked list (facets) with the attributes visible as text, not just UI.
3. Buy block: live price/stock via existing Storefront pipeline; out-of-stock → nearest in-stock alternatives.
4. FAQs (3–5) rendered + `faqSchema()`.
5. JSON-LD via existing `src/lib/seo/schema.ts`: `productSchema` (species w/ SKU), `itemListSchema` (facets), `faqSchema`, `breadcrumbSchema`. Add one new generator: `speciesSchema` (schema.org `Taxon`/`Thing` with scientific name).
6. Cross-links: related guides, related fish, sibling facets, finder CTA.

---

## 6. Recommender engine

`src/lib/recommender/` — pure functions, no I/O (mirrors `src/lib/compatibility/` architecture).

- **Inputs:** tank (gallons or L×W×H), light (bucket, or fixture wattage→bucket heuristic), CO2 (none/liquid/pressurized), fertilization (none/root-tabs/liquid/EI), goals (multi-select: carpet, attach-to-hardscape, background wall, red accents, snail-safe, low-maintenance), experience level.
- **Pipeline:** hard filters (height vs tank height, CO2 requirement, temperature) → weighted scoring (light fit, fert fit, difficulty vs experience, goal matches, in-stock bonus) → ranked results, each with a generated **"why this fits"** explanation (drives trust, and gives AI assistants quotable reasoning).
- Output type includes the scoring breakdown so the UI and tests can inspect it.
- The existing compatibility engine gains plant checks (light mismatch, plant height vs tank, plant-eating livestock) in Phase 6.

---

## 7. Storefront integration deliverables

| Deliverable | Mechanism | Who publishes |
|---|---|---|
| Nav item "Plant Finder" | Theme editor menu change | Vikram (5 min) |
| Product-page care badges | Theme editor blocks bound to metafields (dynamic sources) — no code | Claude provides field map + walkthrough; Vikram publishes |
| Blog "plants in this guide" block + finder CTA | One Liquid snippet added to the article template; activates per-post via tags (`tool-plants`, species tags) | Claude writes snippet on duplicated theme; Vikram reviews & publishes |
| robots.txt | `robots.txt.liquid`: add `Sitemap: https://aquaticmotiv.com/tools/sitemap.xml` (verified 2026-06-11: `/tools/` not disallowed; no AI-crawler blocks) | Claude writes; Vikram publishes |
| Add-to-cart | Client `POST /cart/add.js` + theme cart-drawer refresh event | In-app code |

---

## 8. Blog publishing pipeline

- `scripts/publish-guide.ts`: MDX (repo) → HTML → Admin API `article` create/update on the store blog, with species links and tags applied. Repo remains the source of truth; re-publish is idempotent (keyed by handle).
- **Retrofit:** script inventories existing blog articles, proposes species-link insertions and tags per post (match by plant names in body), outputs a review file; nothing is written to a live article without Vikram approving the batch.

---

## 9. GEO checklist

- Answer-first H1 + direct-answer paragraph on every page (§5).
- FAQPage / ItemList / Product / Breadcrumb JSON-LD everywhere applicable.
- Attributes present as crawlable text and tables, not only interactive UI.
- Stable canonical URLs on the brand domain; entity consistency ("AquaticMotiv Plant Finder").
- `/tools/llms.txt` describing the dataset and page index for AI crawlers.
- robots.txt verified open to GPTBot/ClaudeBot/PerplexityBot (no changes needed beyond the Sitemap line).
- Quotable original data points (PAR ranges, height limits) — assistants cite specifics.
- Monitor: Search Console + referrer segments for AI domains.

---

## 10. Build order

| Phase | Deliverable | Depends on |
|---|---|---|
| 0 | Custom app created (Vikram, in admin) · metafield definitions · proxy prefix verified | — |
| 1 | Dataset: types, first 100 species (stocked catalog first), review batches · handle matching | — (parallel w/ 0) |
| 2 | Metafield sync script + run · Storefront query extension · product-page badge walkthrough | 0, 1 |
| 3 | Recommender engine + finder wizard UI (works standalone on Hetzner host) | 1 |
| 4 | Species + facet pages, JSON-LD, sitemap, llms.txt | 1 |
| 5 | Proxy go-live: app proxy config, assetPrefix, theme-matched header/footer, robots.txt edit, Search Console submission | 3, 4 |
| 6 | Blog snippet + publishing pipeline + retrofit batch · configurator re-ranking + plant compatibility checks · remaining 100 species | 5 |

Phases 0–2 also deliver standalone value (enriched product pages) even before the tool launches.

## 11. Out of scope (this release)

- Visual designer canvas, AI composition critique (Phase B), growth simulation (Phase C — but the dataset deliberately captures its inputs).
- User accounts behind the proxy (cookie stripping); saved-results features stay on localStorage until Phase B.
- Public App Store distribution of the custom app.
- Replacing the §5.2 metaobject template system.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Proxy latency on every page view | Static generation + aggressive cache headers; assets bypass proxy via assetPrefix |
| Proxy prefix conflict with box-builder | Verify in admin before Phase 0 completes |
| Theme redesign breaks visual parity | Header/footer isolated in one component pair; documented update procedure |
| Thin-content risk on combo pages | ≥ 6 species gate + curated pair allowlist |
| Dataset errors damage credibility | Owner review batches; corrections tracked in git |
| Duplicate indexing of origin host | noindex middleware on non-proxied hostname + canonicals |
