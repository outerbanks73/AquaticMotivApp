# AquaticMotiv — Care-Guides SEO/GEO Hub Plan

> **Durable handoff doc.** CLI/desktop/cloud Claude sessions don't share memory and the
> operator works in tmux (can't scroll back). This file is the source of truth for the
> care-guides organic-content initiative — pick it up cold from here.
>
> - **Created:** 2026-06-18
> - **Owner:** Vikram (build) → Francisco (operate once live)
> - **Status:** PLAN — research complete, nothing built yet
> - **Lives in:** `eCom-Tools/docs/` alongside [`STRATEGY.md`](../../../eCom-Tools/docs/STRATEGY.md) / [`ROADMAP.md`](../../../eCom-Tools/docs/ROADMAP.md)
> - **Data source:** SE Ranking MCP (project `aquaticmotiv.com`, site_id **10335776**), pulled 2026-06-18

---

## TL;DR

Build a **care-guides content hub** on aquaticmotiv.com targeting the informational long-tail
for the livestock + plant species the store sells. Two reasons this is high-ROI right now:

1. **Livestock is NOT advertised on paid** (see [Cross-session context](#cross-session-context)).
   The Google Merchant feed deliberately **excludes all livestock** — snails, crabs, clams. So for
   that entire category, **organic search is the only acquisition channel**. Care guides are the
   growth lever for the species that already rank well commercially (nerite #3, rabbit #1, clams #1).
2. **The niche is GEO-soft.** Nearly every informational keyword triggers Google **AI Overview
   (`sge`)** + People-Also-Ask, and keyword **difficulty is 4–13** (very low). FAQPage schema +
   answer-first structure = **+40% AI-citation visibility** (per the seo-geo skill). Low effort,
   high capture.

There is also one **active ranking regression to fix first**: `assassin snail` (12,100/mo, buying
intent) is being carried by a *blog post*, not a product collection, and it slipped 3→6 in the last
30 days. See [Assassin-snail diagnosis](#assassin-snail-diagnosis).

This plan = the start of **STRATEGY.md priority #5 ("Content marketing strategy — not established")**.

---

## Cross-session context

This initiative does not stand alone. Other Claude sessions are actively working the same business.
Factor these in:

| Workstream | Repo / doc | How it relates to care guides |
|---|---|---|
| **Google Merchant feed / PPC feed ownership** | [`GoogleMerchant/README.md`](../../../GoogleMerchant/README.md) | **Livestock (43 SKUs) was REMOVED from the ad feed.** Custom-label taxonomy advertises **Plant(152) / Equipment(111) / Hardscape(57)** only. ⇒ Snail/crab/clam care guides feed a category with **zero paid coverage** — organic is everything. Plant care guides *complement* paid (PMax-Plants). |
| **Paid ads (Google PMax / Search / AI Max)** | [`PPCAdvisor/README.md`](../../../PPCAdvisor/README.md), [`PPCAdvisor/CLAUDE.md`](../../../PPCAdvisor/CLAUDE.md) | Live on AM account `5353106913`. Paid covers **plants**; brand voice lives in PPCAdvisor's "Brand & Copy" settings — **reuse that same brand voice** for guide copy so paid + organic are consistent. |
| **KPI Portal** | [`../CLAUDE.md`](../../../eCom-Tools/CLAUDE.md), [`ROADMAP.md`](../../../eCom-Tools/docs/ROADMAP.md) | Measures revenue by channel/SKU. After guides ship, watch organic-attributed Shopify revenue + the collection pages the guides link to. |
| **Strategy** | [`STRATEGY.md`](../../../eCom-Tools/docs/STRATEGY.md) | Content marketing is **priority #5, "not established."** This is that work. Platform thesis: build the care-guide template once at AM, replicate to NatureAquatica + future aquarium acquisitions. |
| **Customer sentiment / support** | `SentimentService/`, `HelpDesk/` | Repeated support questions ("why are my nerite eggs everywhere?") are FAQ fodder — mine tickets for real customer language to seed guide FAQs. |

**Operator constraint:** Francisco must be able to *maintain* guides once the template + process
exist (he maintains, doesn't build from scratch). Build a repeatable template + a checklist he can
follow, not bespoke one-offs.

---

## How to resume this in another session

1. **Load the SE Ranking MCP tools** (they're deferred — load via ToolSearch):
   ```
   ToolSearch "select:mcp__se-ranking__PROJECT_getSummary,mcp__se-ranking__PROJECT_getPositionHistory,
   mcp__se-ranking__PROJECT_getKeywordStats,mcp__se-ranking__DATA_getSimilarKeywords,
   mcp__se-ranking__DATA_getKeywordQuestions,mcp__se-ranking__DATA_getDomainOverviewHistory"
   ```
2. **Project:** `aquaticmotiv.com`, **site_id = `10335776`**. Guest dashboard (no login):
   [SE Ranking guest link](https://online.seranking.com/guest.html?site_id=10335776&hv=0&hash=e6c01037&sections%5B0%5D=rankings&sections%5B1%5D=analytics&sections%5B2%5D=competitors).
3. **MCP caveat:** the SE Ranking API rejects **concurrent** keyword calls (`500 / "too many
   requests"`). **Call keyword tools one at a time**, not in parallel batches.
4. **Region:** use `source=us` for keyword data. The position-tracking project tracks Google
   USA (NJ 07105), Google Mobile USA, and Bing USA.
5. All keyword data needed to start writing is **embedded below** — you don't need to re-pull to
   begin Phase 1.
6. **Load the GEO skill:** `seo-geo` (refs at `~/.claude/skills/seo-geo/references/`).

---

## 30-day traffic snapshot (May 19 – Jun 18, 2026)

**Verdict: healthy, trending up.** Rankings improved through early June; estimated organic traffic
on pace to beat May.

| Metric (tracked project) | Value |
|---|---|
| Avg position (all engines) | **~33** (improved from ~40 mid-May) |
| Visibility % | **22.1%** (up from ~18%) |
| Keywords in Top 10 | **29** · Top 5: 27 · Top 30: 34 |
| Domain Trust | 24 · Google-indexed pages: ~1,470 |
| Weak channel | **Bing** (visibility ~6–8%, avg pos ~47) — underexploited |

**Estimated organic traffic (whole-domain, SE Ranking US DB — *not* GA actuals):**

| Month | Est. organic visits | Est. traffic value |
|---|---:|---:|
| Mar 2026 | 7,776 | $1,475 |
| Apr 2026 | 4,954 | $707 |
| May 2026 | 8,058 | $2,160 |
| **Jun 2026 (to 18th)** | **6,510** | $1,179 |

June pro-rates to ~10,800 → would be the best month of 2026. Connect **Google Search Console** in
the SE Ranking project for true click data (`PROJECT_getGoogleSearchConsole`).

---

## Assassin-snail diagnosis

**The one active regression — fix first.** Every other commercial term is won by a `/collections/`
product page. But `assassin snail` (12,100/mo, buying intent) ranks via a **blog care guide**, and
it dropped **3→6** in 30 days because Google favors transactional pages for transactional queries.

- Ranking URL today: `https://aquaticmotiv.com/blogs/news/assassin-snail-care-guide-care-diet-behavior-parameters-habitat-health`
- **Fix:** build/strengthen a **`/collections/assassin-snails`** product page to own the commercial
  query; keep the care guide for `assassin snail care` (informational) and cross-link them. One page
  is currently doing two jobs and losing both.
- This is the thesis of the whole hub: **separate commercial (collections) from informational (guides).**

---

## Tracked-keyword opportunities (Google, by volume)

| Keyword | Vol/mo | Pos | 30d | Ranking page | Note |
|---|---:|---:|---:|---|---|
| aquarium plants | 40,500 | — | — | *none* | **Biggest gap — unranked.** Plant collections weak. |
| aquatic plant | 18,100 | 21 | ▲ new | /collections/all-plants | Just entered; needs links + on-page. |
| nerite snail(s) | 18,100 | **3** | ▲ | /collections/nerite-snails | Strong; own the care queries too. |
| aquarium plant | 14,800 | — | — | /collections/plant-packs | Unranked. |
| vampire crab | 14,800 | 16 | ▲6 | /collections/crabs | **Top single opportunity** — #16, big upside. |
| assassin snail(s) | 12,100 | 4 / 6 | ▼3 | /blogs/news/assassin-snail-care-guide… | See diagnosis above. |
| rabbit snail(s) | 8,100 | **1–2** | = | /collections/rabbit-snails | Dominant. |
| live aquatic plants | 5,700 | — | — | *none* | Unranked. |
| freshwater clam(s) (+ "for sale") | 3,600 +1.7k | **1–2** | = | /collections/clams | Dominant. |

---

## Hub architecture decision

### Shopify URL reality check
You can't get a clean root-level `/care-guides` on Shopify. Options:
- **`/blogs/care-guides/<article>`** — a *blog* named `care-guides`; clean topical spoke URLs, native listing.
- **`/pages/care-guides`** — a *Page* you fully design as the hub; spokes still live under `/blogs/`.

### Recommendation: **do both**
- Designed **`/pages/care-guides`** pillar hub (layout + conversion control), grouped into
  **Snails · Plants · Crabs & Clams**.
- Migrate guides into a dedicated **`/blogs/care-guides/`** blog (out of generic `/blogs/news/`).
- ⚠️ **301-redirect the existing assassin-snail guide** when moved, or its #4–6 ranking is lost.

### Intent-routing rule (the whole point)
| Query type | Lands on | Example |
|---|---|---|
| Commercial / "buy" | `/collections/*` | `assassin snail`, `nerite snails for sale` |
| Informational | `/care-guides` spoke | `assassin snail care`, `what do vampire crabs eat` |

**Cross-link bidirectionally:** every guide → "Shop [species]" CTA to its collection; every
collection → "📖 Care guide" link. Captures the full funnel; kills the assassin-snail cannibalization.

**Internal-link authority flow:** your strongest pages (`/collections/nerite-snails` #3,
`/collections/rabbit-snails` #1) link *into* the hub and relevant guides → free authority to new content.

---

## Keyword maps — first 5 spokes

All KD (difficulty) on 0–100; everything below is single-digit to low-teens = winnable fast.
`✅` = triggers Google AI Overview (`sge`) ⇒ prioritize answer-first + FAQ schema.

### 🐌 Spoke 1 — Assassin Snail (build the `/collections/assassin-snails` page first, then this guide)
| H2 / section | Target keyword | Vol | KD | SGE |
|---|---|---:|---:|:--:|
| **Diet** (lead) | do assassin snails eat shrimp | **590** | 6 | ✅ |
| | do assassin snails eat algae | 260 | 5 | ✅ |
| | do assassin snails eat mystery snails / each other | 140 / 90 | 6–7 | ✅ |
| | assassin snail diet / food | 170 / 110 | 8 | ✅ |
| **Care basics** | assassin snail care | 140 | 7 | ✅ |
| **Breeding** | assassin snail breeding / reproduction / mating | 210 / 170 / 70 | 8–15 | ✅ |
| **Lifespan** | assassin snail lifespan | 110 | 7 | ✅ |
| **Overview** | what is an assassin snail | 140 | 12 | ✅ |
| ➡️ to collection | assassin snails (14,800) · where can i buy assassin snails (210) · petco/petsmart (nav) | | | |

### 🐌 Spoke 2 — Nerite Snail
| H2 / section | Target keyword | Vol | KD |
|---|---|---:|---:|
| **Stocking** | how many nerite snails per gallon | 390 | 5 |
| **Diet** | nerite snail food | 480 | 6 |
| **Care basics** | nerite snail care | 390 | 5 |
| **Water params** | nerite snail temperature | 390 | 8 |
| **The egg problem** ⭐ | nerite snail eggs / nerite snails eggs | 180 / 260 | 8–9 |
| **Breeding** | breeding nerite snails | 390 | 8 |
| **Tankmates** | nerite snail and betta | 390 | 6 |
| **Fresh vs salt** | nerite snails saltwater / freshwater | 260 | 10–12 |
| **Varieties** (→ products) | black / olive / zebra / batik / king koopa nerite | 210–590 ea | 4–8 |

> Lead with "the white spots are unfertilized eggs, harmless, here's how to remove them" — it's the
> #1 post-purchase frustration and a perfect answer-first hook. Mine `HelpDesk/` tickets for phrasing.

### 🐌 Spoke 3 — Rabbit Snail
| H2 / section | Target keyword | Vol | KD |
|---|---|---:|---:|
| **Care basics** | rabbit snail care | 320 | 5 |
| **Eggs / breeding** | rabbit snail eggs / breeding / how do rabbit snails reproduce | 320 / 260 / 90 | 5–6 |
| **Lifespan** | rabbit snail lifespan | 140 | 5 |
| **Colors / varieties** ⭐ | rabbit snail colors + gold / orange / blue / chocolate / yellow / poso | 110–390 ea | 3–5 |

> Color variants double as product variant pages → ideal guide→collection cluster.

### 🦀 Spoke 4 — Vampire Crab (HIGHEST VALUE — collection #16 with most room to climb)
| H2 / section | Target keyword | Vol | KD |
|---|---|---:|---:|
| **Tank setup** (lead) | vampire crab setup / tank setup | 480 / 320 | 6 |
| **Diet** | what do vampire crabs eat / vampire crab food | 480 / 210 | 5–6 |
| **Habitat** (paludarium!) | vampire crab habitat | 260 | 5 |
| **Lifespan** | vampire crab lifespan | 210 | 4 |
| **Breeding** | vampire crab breeding | 90 | 7 |
| **Varieties** | disco / red / purple vampire crab | 90–140 | 4 |

> Vampire crabs need **brackish water + a land area (paludarium)** — most buyers don't know this. An
> authoritative setup guide is a real differentiator and the strongest internal-link support to push
> `/collections/crabs` from #16 into the top 10.

### 🌿 Spoke 5 — Aquarium Plants care (pillar-adjacent; feeds the unranked 40,500 term; complements paid PMax-Plants)
| H2 / section | Target keyword | Vol | KD |
|---|---|---:|---:|
| **Troubleshooting** ⭐ | why are my aquarium plants dying | 260 | 6 |
| **Algae on plants** | how to get algae off / clean aquarium plants | 320 / 210 | 8 |
| **Setup** | how to set up / start a planted aquarium | 260 | 9–13 |
| **Keeping alive** | how to keep aquarium plants alive | 210 | 13 |
| **Care basics** | how to care for aquarium plants | 210 | 10 |
| **Species (java fern)** | how to plant java fern in aquarium | 210 | 0 |
| ➡️ to collection | where to buy aquarium plants (480 ×3, Local/Transactional) | | |

---

## GEO/AEO playbook (seo-geo skill — ordered by visibility lift)

Refs: [`geo-research.md`](file:///home/voxly/.claude/skills/seo-geo/references/geo-research.md) ·
[`schema-templates.md`](file:///home/voxly/.claude/skills/seo-geo/references/schema-templates.md) ·
[`platform-algorithms.md`](file:///home/voxly/.claude/skills/seo-geo/references/platform-algorithms.md)

1. **FAQPage schema on every guide (+40% AI visibility).** Turn each question keyword into a
   `<Question>`/`<Answer>` pair. Biggest single lever given SGE saturation. Add `Article` +
   `BreadcrumbList`; hub uses `CollectionPage`/`ItemList`.
2. **Answer-first structure.** Open each guide and each H2 with a 1–2 sentence direct answer before
   prose. Add a **"Quick Care Stats" box** at the top (tank size, temp, pH, diet, lifespan,
   difficulty) — highly extractable by AI Overview + featured snippets.
3. **Statistics Addition (+37%).** Hard numbers: *"Assassin snails reach ~1 inch, live ~2 years"*,
   *"1 nerite per 5 gallons"*, *"vampire crabs need 75–82°F + ~25% land area."* Parameter tables get
   lifted verbatim.
4. **Cite sources / authoritative tone (+25–40%).**
5. **E-E-A-T / experience signal.** Author bio (you keep/breed these species), **real tank photos**.
   Pet-care is welfare-adjacent → Google rewards first-hand experience.
6. **Easy-to-understand + fluency.** Short paragraphs, bullets, clear H1→H2→H3. **Avoid keyword
   stuffing — it's the one tactic that *hurts* (−10%).**

### Schema + technical checklist (per guide)
- [ ] `Article` + `FAQPage` + `BreadcrumbList` JSON-LD (hub: `CollectionPage`/`ItemList`)
- [ ] Quick Care Stats box at top; answer-first H2 openers
- [ ] Water-parameters table; species/variety images with descriptive alt text
- [ ] "Shop [species]" CTA → collection; collection links back to guide
- [ ] Self-canonical; breadcrumbs Home › Care Guides › Snails › [Species]
- [ ] Validate: [Rich Results Test](https://search.google.com/test/rich-results) ·
      [Schema validator](https://validator.schema.org/)

### AI-bot access
Confirm [`aquaticmotiv.com/robots.txt`](https://aquaticmotiv.com/robots.txt) allows: **GPTBot,
OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot.** (No crawl = no
citation. Shopify default is usually open — verify.) Per the skill, Claude uses **Brave Search**
indexing and Copilot needs **Bing** indexing — Bing is also your weakest tracked channel, so don't
neglect it.

---

## Execution plan (phased, checkboxed)

### Phase 0 — Fix the regression + set up structure (do first)
- [ ] Build/strengthen **`/collections/assassin-snails`** product page (targets the commercial term).
- [ ] Create the **`/blogs/care-guides/`** blog + **`/pages/care-guides`** hub shell (Snails / Plants / Crabs & Clams sections).
- [ ] Check `robots.txt` for AI-bot access; fix if any are blocked.
- [ ] Connect **Google Search Console** to the SE Ranking project for real click data.

### Phase 1 — Pilot guide = repeatable template
- [ ] Write the **Assassin Snail care guide** end-to-end as the template (answer-first + Quick Care
      Stats + FAQ from the Spoke-1 questions). 301-redirect the old `/blogs/news/...` URL → new.
- [ ] Generate its JSON-LD (Article + FAQPage + BreadcrumbList); validate.
- [ ] Wire bidirectional links to `/collections/assassin-snails`.
- [ ] **Document the template as a checklist Francisco can follow** for future species.

### Phase 2 — Build out the cluster (priority order, compounding existing momentum)
- [ ] **Nerite snail** guide (own care queries on top of #3 commercial rank)
- [ ] **Vampire crab** guide (highest upside — supports #16 collection)
- [ ] **Rabbit snail** guide (+ color-variant cluster)
- [ ] **Aquarium plant care** guide (feeds the unranked 40,500 term; complements PMax-Plants)
- [ ] Add freshwater clam guide (you're #1–2 commercially)

### Phase 3 — Expand + measure
- [ ] Add the hub to site nav; submit updated sitemap.
- [ ] Pull a fresh SE Ranking position check after ~30 days; track movement on the spoke keywords.
- [ ] Add tracked keywords for the new informational terms in the SE Ranking project
      (`PROJECT_addKeywords`, site_id 10335776) so they show in position tracking.
- [ ] Mine `HelpDesk/` tickets + `SentimentService` for new FAQ questions and additional species to cover.
- [ ] Replicate the template to NatureAquatica when that store onboards (platform thesis).

---

## Links & references

**Live store / dashboards**
- Store: https://aquaticmotiv.com · Shopify admin: `aquaticmotiv.myshopify.com`
- SE Ranking guest dashboard: [project 10335776](https://online.seranking.com/guest.html?site_id=10335776&hv=0&hash=e6c01037&sections%5B0%5D=rankings&sections%5B1%5D=analytics&sections%5B2%5D=competitors)
- Ranking pages to cross-link: `/collections/nerite-snails` · `/collections/rabbit-snails` ·
  `/collections/clams` · `/collections/crabs` · `/collections/all-plants`

**Validators / tools**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [aquaticmotiv.com/robots.txt](https://aquaticmotiv.com/robots.txt)

**Skill references**
- seo-geo skill: `~/.claude/skills/seo-geo/` (`references/geo-research.md`, `schema-templates.md`, `platform-algorithms.md`)
- Related skills available: `seo-audit`, `programmatic-seo`, `schema-markup`

**Related cross-session docs**
- [`STRATEGY.md`](../../../eCom-Tools/docs/STRATEGY.md) — content marketing = priority #5
- [`ROADMAP.md`](../../../eCom-Tools/docs/ROADMAP.md) — KPI Portal roadmap
- [`GoogleMerchant/README.md`](../../../GoogleMerchant/README.md) — feed taxonomy; **livestock excluded from paid**
- [`PPCAdvisor/README.md`](../../../PPCAdvisor/README.md) — paid ads; reuse brand voice

---

## Appendix — data provenance & raw keyword pulls

All data pulled from SE Ranking MCP on **2026-06-18**, `source=us`, via
`DATA_getSimilarKeywords` / `DATA_getKeywordQuestions` (seeds: nerite snail, assassin snail, rabbit
snail, vampire crab, aquarium plants) and `PROJECT_getKeywordStats` / `getPositionHistory` /
`getSummary` / `getDomainOverviewHistory` for site_id 10335776. To refresh, re-run those tools
(remember: **sequential calls only** — concurrent = 429).

**Schema reminders**
- `getKeywordStats` returns per-engine arrays; engine `413908` = Google USA (NJ 07105) desktop,
  `413911` = Google Mobile USA, `413914` = Bing USA. Each keyword has `name`, `volume`, `cpc`,
  `landing_pages`, and a `positions[]` time series.
- Large `getKeywordStats` responses overflow the tool-result limit and get saved to a session
  `tool-results/*.txt` file — parse with python/jq, not Read.
