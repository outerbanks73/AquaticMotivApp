# AquaticMotiv — Care-Guides SEO Action Plan

> **Action checklist for consolidation.** Pure tasks, prioritized. Strategy, keyword maps, and
> rationale live in [`SEO-CARE-GUIDES-PLAN.md`](./SEO-CARE-GUIDES-PLAN.md). This file is the
> "what to actually do" list — portable into a master tracker.
>
> - **Created:** 2026-06-18 · **Owner:** Vikram (build) → Francisco (operate)
> - **Domain:** aquaticmotiv.com (Shopify) · **SE Ranking site_id:** 10335776
> - **Why now:** Livestock is excluded from paid ads → organic is the *only* channel for
>   snails/crabs/clams. Difficulty 4–13, AI-Overview-saturated → fast, cheap wins.

---

## Prioritized actions

Priority: **P0** = do first / unblocks others · **P1** = high impact · **P2** = expand.
Effort: S (<1h) · M (half-day) · L (1–2 days).

| # | Action | P | Effort | Impact | Depends on | Status |
|---|---|:--:|:--:|---|---|:--:|
| 1 | Build/strengthen **`/collections/assassin-snails`** product page (own the 12,100/mo commercial term; fixes the 3→6 drop) | P0 | M | High | — | ☐ |
| 2 | Create **`/blogs/care-guides/`** blog + **`/pages/care-guides`** hub shell (Snails / Plants / Crabs & Clams) | P0 | M | Med | — | ☐ |
| 3 | Audit **`robots.txt`** for AI-bot access (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot) | P0 | S | Med | — | ☐ |
| 4 | Connect **Google Search Console** to SE Ranking project 10335776 (real click data) | P0 | S | Med | — | ☐ |
| 5 | Write **Assassin Snail guide** as the repeatable template; **301-redirect** old `/blogs/news/...` URL | P1 | L | High | 1, 2 | ☐ |
| 6 | Generate + validate **JSON-LD** (Article + FAQPage + BreadcrumbList) for guide #5 | P1 | S | High | 5 | ☐ |
| 7 | Wire **bidirectional links** (guide ↔ collection) for assassin snail | P1 | S | Med | 1, 5 | ☐ |
| 8 | **Document the per-guide template as a checklist** Francisco can follow | P1 | S | High | 5 | ☐ |
| 9 | Write **Nerite Snail guide** (own care queries on top of #3 commercial rank) | P1 | L | High | 8 | ☐ |
| 10 | Write **Vampire Crab guide** (supports #16 collection — biggest ranking upside) | P1 | L | High | 8 | ☐ |
| 11 | Write **Rabbit Snail guide** (+ color-variant cluster) | P2 | L | Med | 8 | ☐ |
| 12 | Write **Aquarium Plant care guide** (feeds unranked 40,500/mo term; complements PMax-Plants) | P2 | L | High | 8 | ☐ |
| 13 | Write **Freshwater Clam guide** (you're #1–2 commercially) | P2 | M | Low | 8 | ☐ |
| 14 | Add hub to **site nav** + submit updated **sitemap** | P2 | S | Med | 2, 5 | ☐ |
| 15 | Add new informational keywords to SE Ranking tracking (`PROJECT_addKeywords`, site_id 10335776) | P2 | S | Low | 9–12 | ☐ |
| 16 | Re-pull SE Ranking positions after ~30 days; measure spoke-keyword movement | P2 | S | Med | 9–12 | ☐ |
| 17 | Mine `HelpDesk/` tickets + `SentimentService` for FAQ questions + new species to cover | P2 | M | Med | 8 | ☐ |
| 18 | Replicate template to **NatureAquatica** when that store onboards (platform thesis) | P2 | L | Med | 8 | ☐ |

---

## Per-guide repeatable checklist (template — task #8 codifies this)

For each species guide:

- [ ] **Intent split:** commercial keyword → `/collections/*`; this guide owns informational only
- [ ] **Quick Care Stats box** at top (tank size, temp, pH, diet, lifespan, difficulty)
- [ ] **Answer-first** opener on the guide and on every H2 (1–2 sentences before prose)
- [ ] H2s mapped to the keyword cluster (see PLAN.md keyword maps); FAQ block from question keywords
- [ ] **Statistics** (hard numbers) + **water-parameters table** (AI lifts these verbatim)
- [ ] Real **tank photos** + author bio (E-E-A-T / experience signal); descriptive alt text
- [ ] **JSON-LD:** Article + FAQPage + BreadcrumbList → validate (Rich Results + schema.org)
- [ ] **"Shop [species]" CTA** → collection; add "📖 Care guide" link back on the collection
- [ ] Self-canonical; breadcrumbs Home › Care Guides › [Group] › [Species]
- [ ] No keyword stuffing (it *hurts* visibility −10%)

---

## Guide build order (by demand already proven)

1. **Assassin snail** — fixes the live regression; becomes the template
2. **Nerite snail** — #3 commercial, own the care cluster
3. **Vampire crab** — #16 collection, most ranking upside (brackish/paludarium angle = differentiator)
4. **Rabbit snail** — color-variant cluster
5. **Aquarium plant care** — feeds the 40,500/mo gap
6. **Freshwater clam** — round out livestock

---

## Cross-session dependencies (consolidation notes)

- **Brand voice:** reuse PPCAdvisor's "Brand & Copy" settings so organic copy matches paid — see [`PPCAdvisor/README.md`](../../../PPCAdvisor/README.md).
- **Feed:** livestock excluded from ads — confirm in [`GoogleMerchant/README.md`](../../../GoogleMerchant/README.md); plants ARE advertised (don't duplicate-target paid plant terms with thin content).
- **Strategy slot:** this is [`STRATEGY.md`](../../../eCom-Tools/docs/STRATEGY.md) priority #5 (content marketing).
- **Measurement:** track organic-attributed revenue + linked collections in the KPI Portal.

---

## Quick reference

| Item | Value |
|---|---|
| SE Ranking project | site_id **10335776** ([guest dashboard](https://online.seranking.com/guest.html?site_id=10335776&hv=0&hash=e6c01037&sections%5B0%5D=rankings&sections%5B1%5D=analytics&sections%5B2%5D=competitors)) · `source=us` · **sequential MCP calls only** (429 on concurrent) |
| Validators | [Rich Results](https://search.google.com/test/rich-results) · [Schema.org](https://validator.schema.org/) · [robots.txt](https://aquaticmotiv.com/robots.txt) |
| GEO skill | `~/.claude/skills/seo-geo/` |
| Full plan | [`SEO-CARE-GUIDES-PLAN.md`](./SEO-CARE-GUIDES-PLAN.md) |
