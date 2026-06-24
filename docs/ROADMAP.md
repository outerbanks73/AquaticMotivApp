# AquaticMotiv — Master SEO Checklist (Definitive Guide)

> 📍 **This is the project roadmap.** It replaces the former Save A Fish *configurator* roadmap
> (archived in git history) — the active workstream is the care-guides content engine + organic/GEO,
> tracked below. The canonical copy now lives here at `docs/ROADMAP.md`.

> **Single source of truth** for organic + GEO work on aquaticmotiv.com. Consolidates and dedupes
> [`SEO-FIXES.md`](./seo/SEO-FIXES.md) (technical audit), [`SEO-CARE-GUIDES-PLAN.md`](./seo/SEO-CARE-GUIDES-PLAN.md)
> (content strategy), [`SEO-CARE-GUIDES-ACTIONS.md`](./seo/SEO-CARE-GUIDES-ACTIONS.md) (task list), and the
> **live verification done 2026-06-21**. Where this doc conflicts with the source docs, **this doc wins** —
> it reflects newer data and on-page verification the June-18 docs predate.
>
> - **Domain:** aquaticmotiv.com (Shopify) · **SE Ranking project:** site_id **10335776** (`source=us`)
> - **Owner model:** **Vikram builds/decides → Francisco operates** once documented. Build repeatable
>   templates + checklists, not bespoke one-offs (Francisco maintains, doesn't build from scratch).
> - **Effort:** S (<1h) · M (half-day) · L (1–2 days).
> - **Care guides** are now built natively in this repo (**AquaticMotivApp**) at `/a/careguides` — see Tier 2.

---

## 0. Live verification corrections (2026-06-21) — read before acting

The June-18 docs were built on the SE Ranking audit alone. Direct on-page + API checks on 2026-06-21
changed or added these. **Do not action items the source docs imply but this section retires.**

| Topic | June-18 docs implied | Verified 2026-06-21 | Action |
|---|---|---|---|
| **Structured data** | (gap implied in some discussions) | **SEO King ships full JSON-LD** sitewide — Organization, WebSite+SearchAction, Product, **Offer + aggregateRating (your 12,493 reviews ARE fed to Google)**, Breadcrumb. | ✅ **No "add schema" work for the storefront.** Don't duplicate it. (Care-guide *FAQPage/Article* schema is still net-new — Tier 2.) |
| **robots.txt AI-bot access** | "audit it" (open P0) | **Verified OPEN** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. not blocked (only Nutch blocked, Ahrefs rate-limited). | ✅ **Closed.** No change needed. |
| **`aquatic plant` (18,100/mo)** | pos 21, "just entered, needs links" | **Dropped 21 → not ranking** (Google). | 🔴 Fragile win lost in 3 days → prioritize internal links to `/collections/all-plants` (Tier 1/3). |
| **`vampire crab` (14,800/mo)** | pos 16, "top opportunity, ▲6" | **Slipped 14→18 (Google); Bing 98→NR.** | 🟠 Reversed — the vampire-crab guide (Tier 2) is now urgent, not just upside. |
| **Visibility / top-5** | 22.1% / 27 in top-5 | **20.33% / 25 in top-5.** | Monitor — slight erosion; consistent with the two slips above. |
| **Engine read** | "3rd engine weaker/volatile" | Confirmed **E3 = Bing USA** (E1 Google NJ desktop, E2 Google Mobile). Recent gains are concentrated on **Bing (weakest channel)** while Google slips. | Weight Google moves higher than blended averages suggest. |
| **llms.txt** | not analyzed | Present (SEO King), **over-built** (32KB), with a **wrong "Brands Carried" list** + an MCP-endpoint **domain mismatch**. No major AI search consumes llms.txt (Mueller/Illyes/SE-Ranking evidence). | Low priority polish only — Monitor section. |
| **Agentic commerce (UCP)** | not covered | **Live** — Shopify Universal Commerce Protocol (cart→checkout→order over MCP, Google Pay + Shop Pay wired). | Informational; owned by Shopify. Monitor section. |
| **`<title>` rendering** | n/a | Raw `curl` returned `Kindly agree` on every page (SE Ranking crawler saw normal titles → likely JS-set/consent interstitial). | ⚠️ Verify before the 419-title rewrite (Tier 1 #4) — confirm Googlebot gets real titles via URL Inspection. |

---

## 1. Tier 1 — Quick technical wins (days) · Owner: Francisco

Real, actionable items from the audit (the "1,265 errors" are mostly template-counted noise: `extcss345xx`
1,212 = one CSS redirect per page; JS/CSS-not-minified = notices; CWV passes in the field).

- [ ] **1. Repoint internal links hitting 3XX redirects** (1,080 flagged, but **template-scoped** — a few nav/footer links to redirected handles). High: recovers crawl budget + equity. `S`
- [ ] **2. Fix 18 broken (4XX) images** — concentrated in Week Aqua / Ledstar / Hygger **lighting** SKUs (high-ticket; hurts conversion). `S`
- [ ] **3. Internally link orphaned content** (~12 real orphans): the 2 already-written posts `top-10-easy-aquarium-plants-for-beginners` + `top-5-best-foreground-carpet-plants-for-beginners`, and orphan collections `/collections/inverts`, `/snail-food`, `/water-lettuce`, `/lobsters-crayfish`, `/terrariums`, `/wysiwyg-bettas`. **Dedupe with the care-guides internal-link plan (Tier 2) so collections aren't linked twice.** `M`
- [ ] **4. Templated rewrite of 419 over-length titles** (doubles as keyword placement). ⚠️ **First verify the `<title>` rendering anomaly** (§0). `M`
- [ ] **5. Fix 193 duplicate / 19 missing meta descriptions** (templated). `M`
- [ ] **6. Resolve cannibalization (merged workstream):**
  - `mystery snail` (22,200) ranks at both a collection (#7) and a product (#16) → consolidate signals to the collection.
  - `assassin snail` (12,100) ranks via a **blog guide**, not a collection, and slipped 3→6 → **build/strengthen `/collections/assassin-snails`** to own the commercial query; keep the guide for `assassin snail care`. (This is also Tier 2 P0 — same fix.) `M`

> **Skip (verified done / not needed):** add storefront schema; audit robots AI-bot access. See §0.

---

## 2. Tier 2 — Care-guides content engine (the strategic thrust) · Vikram build → Francisco operate

**Why this is the priority:** livestock (snails/crabs/clams — 43 SKUs) is **excluded from paid ads**
(GoogleMerchant feed: Plant/Equipment/Hardscape only), so **organic is the ONLY acquisition channel** for
the category you already win commercially (nerite #3, rabbit #1, clams #1). The niche is **GEO-soft**: most
informational queries trigger Google AI Overview (SGE) at **difficulty 4–13**. Plant guides *complement* paid
PMax-Plants (don't thin-content-duplicate paid plant terms).

**Architecture principle:** separate **commercial → `/collections/*`** from **informational → care guide**,
cross-linked bidirectionally ("Shop [species]" ↔ "📖 Care guide"). Strongest pages
(`/collections/nerite-snails` #3, `/collections/rabbit-snails` #1) link into the hub to pass authority.

### 2a. Foundation (P0)
- [ ] **Build/strengthen `/collections/assassin-snails`** (owns the 12,100/mo commercial term; fixes the 3→6 drop). `M`
- [ ] **Official care-guides hub** — public canonical URL **`https://aquaticmotiv.com/freshwater-aquatic-planted-tank-guide`**
  (per the CLAUDE.md directive), **powered by the app content at `https://careguides.aquaticmotiv.com/a/careguides`**.
  Surfaces guide cards across **all 3 stores** (app species guides + Shopify care *Pages* + Shopify *blog*
  guides — **no 301s on the converting Shopify guides, they stay live**) + native tools (Plants A–Z, Inverts
  A–Z, Plant Finder). **Full hub-and-spoke spec in §2e.** *(Landing-page redesign tracked in
  [`../THEME_GO_LIVE_GUIDE.md`](./THEME_GO_LIVE_GUIDE.md).)* `L`
- [ ] **Connect Google Search Console** to SE Ranking project 10335776 (real click data vs estimates). `S`

### 2b. Pilot = repeatable template (P1)
- [ ] **Assassin Snail guide** end-to-end as the template (answer-first + Quick Care Stats box + FAQ from the
  question cluster). If moved off `/blogs/news/...`, **301-redirect** the old URL or lose the rank. `L`
- [x] **JSON-LD per guide:** `Article` + `FAQPage` + `BreadcrumbList` (hub: `CollectionPage`/`ItemList`).
  Validate (Rich Results + schema.org). This is **net-new** (distinct from SEO King's commerce schema). `S`
  ✅ Shipped on all 127 native guides (102 plants + 25 inverts): each detail page emits
  `BreadcrumbList` + `Taxon` + `Article` + `FAQPage` (+ `Product` when in catalog); hub emits
  `CollectionPage`/`ItemList`. `Article` byline = **Francisco Fernandes** (E-E-A-T, §2d #5). All blocks
  parse as valid JSON-LD (validated locally 2026-06-23). *Still TODO: paste a sample into Google's Rich
  Results Test once live to confirm eligibility.*
- [ ] **Document the per-guide checklist** Francisco can follow (codifies the template). `S`

### 2c. Cluster build-out — priority order by proven demand (P1→P2)
1. [ ] **Nerite Snail** — lead with the egg FAQ ("white spots are unfertilized eggs, harmless"); mine HelpDesk tickets. `L`
2. [ ] **Vampire Crab** — 🔴 now *urgent* (slipped, §0); differentiator = brackish + paludarium/land area; supports `/collections/crabs`. `L`
3. [ ] **Rabbit Snail** — color-variant cluster (gold/orange/blue/chocolate/yellow/poso) doubles as product pages. `L`
4. [ ] **Aquarium Plant care** — feeds the unranked 40,500/mo term; complements PMax-Plants. `L`
5. [ ] **Freshwater Clam** — round out livestock (you're #1–2 commercially). `M`

### 2d. GEO/AEO playbook (apply to every guide, ordered by lift)
1. **FAQPage schema (+40% AI visibility)** — each question keyword → Question/Answer pair.
2. **Answer-first** — 1–2 sentence direct answer opening the guide and each H2; **Quick Care Stats box** (tank size, temp, pH, diet, lifespan, difficulty).
3. **Statistics (+37%)** — hard numbers + water-parameter tables (AI lifts these verbatim).
4. **Cite sources / authoritative tone (+25–40%).**
5. **E-E-A-T** — author bio (you keep/breed these), real tank photos.
6. **Fluency** — short paragraphs, clear H1→H2→H3. **Do NOT keyword-stuff (−10%, the one tactic that hurts).**
7. Reuse **PPCAdvisor "Brand & Copy"** voice (tone/value-props/preferred+avoided words) so organic matches paid.

### 2e. Hub & internal-linking architecture (the CLAUDE.md directive) · P0

> **Directive (CLAUDE.md):** *"Interlink the content that is ranking for snails / shrimps / crabs etc.
> to the hub of the care guide (at this url: `https://aquaticmotiv.com/freshwater-aquatic-planted-tank-guide`)
> and it will display content from here (`https://careguides.aquaticmotiv.com/a/careguides`)."*

**The model = one hub, many spokes.** The hub is the destination that accrues authority and gets cited by
LLMs; every piece of ranking care content links **up** to it; the hub links **out** to everything worth
surfacing. Content stays in its 3 stores by authoring mode (JSON = app-generated, Shopify Pages + Blogs =
human-written) — **we do not consolidate; we interlink.** The only hard external constraint is a **clean URL
structure**.

**Inventory the architecture must cover (verified 2026-06-23):**
- **App / JSON (`/a/careguides/*`):** 162 live URLs — 102 plant + 25 invert species, ~31 filter pages, 4 hubs.
- **Shopify Pages (`/pages/*`):** 55 total ≈ **~30 plant care-guide pages** + ~22 operational/policy + the
  duplicate hubs below.
- **Shopify Blog articles (`/blogs/news/*`):** 69 — incl. **~15 snail guides, Neocaridina shrimp, Betta**,
  plant profiles, and how-to/science. *(2 empty blog containers = cruft to delete.)*

**Problem 1 — hub fragmentation (resolve first).** Four URLs currently compete to be "the hub":
`/a/careguides` (app), `/pages/care-guides`, `/pages/freshwater-aquarium-plant-care-guides` (both live Shopify),
and the directive's `/freshwater-aquatic-planted-tank-guide` (404, doesn't exist yet).
- [ ] **Create the canonical hub** at `aquaticmotiv.com/freshwater-aquatic-planted-tank-guide`, served by the
  app `/a/careguides` content (App Proxy / theme). `L`
- [ ] **301-redirect** the two duplicate Shopify hub pages (`/pages/care-guides`,
  `/pages/freshwater-aquarium-plant-care-guides`) into the canonical hub — kills cannibalization, keeps URLs clean. `S`

**Problem 2 — the hub under-links (it only lists blogs today).** `src/data/guides/hub.json` references only
`/blogs/news/plant-profile-*` and **misses the ~30 plant care *Pages* and all invert/shrimp *blog* guides.**
- [ ] **Hub links OUT to all 3 sources** — app species guides + Shopify care Pages + Shopify blog guides
  (esp. snails/shrimp/crabs), grouped by category. `M`

**Problem 3 — spokes don't link back up (hub-and-spoke incomplete).** Best-practice per spoke, *regardless of
source*:
- [ ] **Up-link:** every ranking care guide (blog/page/app) links **to the hub**. For Shopify blogs/pages this
  means a templated "Part of the Freshwater Planted Tank Guide →" link; for app guides, a template backlink. `M`
- [ ] **Product link:** each guide links to its individual **product/collection** page ("Shop [species]"). `M`
- [ ] **Sibling links:** related guides cross-link (e.g. snail ↔ snail, plant ↔ plant). `M`
- [ ] **Build the missing bridge maps:** **`src/data/inverts/article-links.json` + `care-page-links.json`
  (currently zero)** mapping each invert to its Shopify blog/page; extend plant maps (today only 12/102 blog,
  30/102 page). `M`

**Problem 4 — validate it's sound for rankings + LLMs.**
- [ ] **SE Ranking technical audit** (project 10335776) post-change: confirm no orphan hub spokes, internal-link
  depth ≤3 clicks to hub, no 4XX/redirect chains, anchor-text distribution sane. `S`
- [ ] **GEO check:** hub + spokes pass the §2d playbook (answer-first, FAQPage, stats) so the cluster is
  citable in AI Overviews / ChatGPT / Perplexity. `S`

**Sequence:** create canonical hub → redirect duplicate hubs → complete hub out-links → add spoke up-links +
bridge maps → SE Ranking audit → QA → flip public. Owner: Vikram builds/decides → Francisco operates.

### 2f. Hub IA, interactive tools & mobile at scale (~500 guides) · planning

Full strategy in [`CARE-GUIDES-SCALING-PLAN.md`](./CARE-GUIDES-SCALING-PLAN.md) (2026-06-24). Summary:
promote the **existing faceted-browse engine** (`plant-facets.ts`/`invert-facets.ts`) to the primary IA
under **3 meta-categories** (Plant Care · Invert Care · Tank Setup & Maintenance), demote `hub.json` to a
deep-link appendix; add mega-menu + search + A-Z; ship interactive tools (stocking calc, compatibility
pages, build-my-tank); evaluate a **PWA** (management-first; plant-ID as a "best match" assist).
**Phase 0 fixes:** broken `snail-safe` facet (true on all 102 plants), duplicate attach predicate,
sub-gate invert types, faceted-SEO noindex control. **3 open decisions pending Vikram:** first phase,
mobile appetite, hub theme.

---

## 3. Tier 3 — Plant & invert expansion (2–10 weeks) · Vikram → Francisco

**Key insight:** even the plant leaders sit on page 2–4 for the biggest head terms — *no one owns them*, and
the closest-ranking competitor (tropica) does it with **guide URLs, not collection pages**.

- [ ] **Extend the invertebrate moat (highest confidence)** — adjacent terms a competitor wins and you don't:
  cherry shrimp (27,100, KD 78, currently #25), neocaridina shrimp (14,800, KD 61), bladder snails (10,800,
  KD 65), trumpet/malaysian trumpet snails (6,600 / 3,600), scuds (2,900). Build pages + care guides. `L`
- [ ] **Push 5 mid-page-1 snail terms to top-3** (nerite, nerite snail, aquarium snails, mystery, assassin) via content depth + internal links + review schema — steep CTR gains near the top. `M`
- [ ] **Stand up "for sale" pages** (snails-for-sale / freshwater snails) for transactional intent already half-won. `M`
- [ ] **"Best Aquarium Plants" pillar guide** — the only realistic path into `aquarium plants` (40,500/mo). `L`
- [ ] **Plant species long-tail layer** (each = product page + care guide), validated by 2–3 competitors:
  java moss (10,800), bucephalandra (3,600), purple waffle (1,900), subwassertang (720), hydrocotyle (610),
  crypt beckettii/spiralis (590 ea), myriophyllum mattogrossense (590), mayaca (590), marsilea (590). `L`
- [ ] **Commercial "plant store/shop" landing pages** — aquarium plants store (590, KD 31), aquatic plant store (590, KD 24), aquarium plants shop (590, KD 21) — pure buyer intent a store should own. `M`
- [ ] **Beginner + troubleshooting cluster** (getting-started, low-light/easy plants, algae, water chemistry). `L`

---

## 4. Tier 4 — Merchandising decisions (gating) · Vikram

- [ ] **Shrimp catalog depth** — *recommended yes* (cherry shrimp 27,100 + neocaridina 14,800 are the highest-volume on-thesis gaps; livestock is the wheelhouse).
- [ ] **Water-lily / lotus / pond** — *flag* (large demand but pond-skewed, not aquarium; high-difficulty).
- [ ] **Houseplant / terrarium crossover** — *flag* (high volume but tangential to aquariums).

---

## 5. Monitor / informational (not urgent)

- [ ] **Bing is the weakest channel** (~6–8% visibility) and Copilot indexes via Bing — submit/monitor Bing Webmaster.
- [ ] **`<title>` rendering** — confirm Googlebot receives real titles (URL Inspection), not `Kindly agree` (§0).
- [ ] **llms.txt polish (low value)** — fix the wrong "Brands Carried" list + the MCP-endpoint domain mismatch (llms.txt advertises `aquaticmotiv.com/api/ucp/mcp`; canonical discovery is `aquaticmotiv.myshopify.com/...`). These are SEO King app settings. No AI-search ROI; fix only for the agentic-commerce path.
- [ ] **Agentic commerce (UCP)** — live and Shopify-owned (cart→checkout→order over MCP, Google Pay + Shop Pay). `agents.md` claims "no-auth browsing" but the MCP endpoint gates on agent profile — verify there's a real anonymous read path. Google Pay `auth_jwt` is empty — verify not an incomplete config.
- [ ] **JS/CSS minification & the `extcss345xx` CSS-redirect asset** — real headroom but CWV passes; cosmetic.
- [ ] **Re-pull SE Ranking positions ~30 days after guides ship**; add the new informational keywords to tracking (`PROJECT_addKeywords`, 10335776). Mine HelpDesk/SentimentService for FAQ language + new species.
- [ ] **Platform replication** — once the template + hub work at AM, replicate to NatureAquatica (the platform thesis).

---

## 6. Cross-workstream dependencies

| Dependency | Detail |
|---|---|
| **Feed exclusion → guide priority** | Livestock excluded from paid ([`../../../GoogleMerchant/README.md`](../../GoogleMerchant/README.md)) ⇒ snail/crab/clam guides are the *only* acquisition channel; plant guides merely complement PMax-Plants. |
| **Brand voice → guide copy** | Reuse PPCAdvisor "Brand & Copy" settings ([`../../../PPCAdvisor/README.md`](../../PPCAdvisor/README.md)) for paid/organic consistency. |
| **Strategy slot** | Care guides = STRATEGY.md priority #5 "Content marketing" ([`../../../eCom-Tools/docs/STRATEGY.md`](../../eCom-Tools/docs/STRATEGY.md)). |
| **Measurement** | After guides ship, watch organic-attributed Shopify revenue + linked collections in the KPI Portal ([`../../../eCom-Tools/docs/ROADMAP.md`](../../eCom-Tools/docs/ROADMAP.md)). |
| **Cannibalization** | Mystery-snail AND assassin-snail are one merged workstream (Tier 1 #6 = Tier 2a P0). |

## 7. Source docs

- [`SEO-FIXES.md`](./seo/SEO-FIXES.md) — full technical audit + organic strategy (June 18, 2026).
- [`SEO-CARE-GUIDES-PLAN.md`](./seo/SEO-CARE-GUIDES-PLAN.md) — care-guides strategy, keyword maps, GEO playbook.
- [`SEO-CARE-GUIDES-ACTIONS.md`](./seo/SEO-CARE-GUIDES-ACTIONS.md) — original P0–P2 task list.

> **Data caveat:** SE Ranking volumes/difficulty are US estimates, directional. Rankings are primary-engine
> (Google NJ). Connect GSC for true click data. Live-verified items (§0) reflect 2026-06-21.
