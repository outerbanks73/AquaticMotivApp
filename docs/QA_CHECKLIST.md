# Care Guides — QA checklist (for employees)

The new care-guides system is built and running. It is **not yet visible to
customers** on aquaticmotiv.com (no nav links, no homepage section). This is the
QA window — please review thoroughly and log anything wrong or worth tweaking.

## Where to QA

**Primary QA surface (use this):**
`https://careguides.aquaticmotiv.com/a/careguides`

This serves the complete system (all ~159 pages), is search-engine-hidden, and is
safe to click around freely. It is identical to what customers will eventually see
on `aquaticmotiv.com/a/careguides/...` **except** the "Add to cart" button — the
native store cart only works on the real store domain (see note at bottom).

Key entry points:
- Plant database hub: `/a/careguides/plants`
- Invertebrate hub: `/a/careguides/inverts`
- Plant finder (the quiz): `/a/careguides/finder`

## Priority 1 — species data accuracy (the most important QA)

This is the part only you can verify. For the species you know best, open the
profile page and check the **Care specifications** table against your real-world
experience:

- Light level, CO2 requirement, temperature range, pH
- Max size / height, growth rate, placement
- For inverts: GH (hardness), calcium needs, adult size, tank-size minimum
- "Plant safe", "Betta compatible", "Will it overrun the tank" (population growth)
- The "Get [species]" buy block links to the correct product

**Please scrutinize these flagged judgment calls first** (we were least certain):
- Inverts: spixi snail marked plant-UNsafe; rabbit snail plant-safe (with a Java
  fern caveat); ramshorn plant-safe; mystery snail + cherry shrimp betta = "caution"
- "Dwarf Lily" — we assumed species *Nymphaea stellata*; confirm against your supplier
- Plants needing CO2: dwarf baby tears, Rotala macrandra, downoi, Ammannia
  senegalensis, Ludwigia 'Cuba' — confirm "required" is fair
- Any species currently out of stock (their buy block shows in-stock alternatives)

If a number is wrong, note the species + field + correct value. We fix it in one
place and it updates everywhere (page, finder, product metafield).

## Priority 2 — the plant finder

Run `/a/careguides/finder` as a few real customer scenarios:
- Low-tech 10g betta tank, no CO2 → should rank Anubias/Java fern/crypts/floaters,
  should NOT recommend demanding carpets or plants too tall for the tank
- High-tech 20g with CO2, carpet goal → should rank carpeting plants
- Coldwater / unheated → should rank hornwort, anacharis, etc.
Check that the "why this fits" reasons and cautions read sensibly.

## Priority 3 — content & links

- Care summaries and FAQs: accurate, on-brand, no awkward phrasing?
- Facet pages (e.g. `/a/careguides/plants/low-light`,
  `/a/careguides/inverts/best-algae-eaters`): right species listed?
- "Go deeper" links on species pages point to the correct existing care guide /
  blog post?
- Anything factually wrong, or tone you'd change?

## How to log issues

List them however is easiest (doc / sheet / email), grouped as:
- **Data fix** — species, field, correct value
- **Content tweak** — page URL, what to change
- **Bug** — page URL, what's broken
- **Feature/looks** — what you'd like different

Send the list back and changes get batched in.

## Known / not-yet-done (no need to report these)

- "Add to cart" inert on the QA surface — works once live on the store domain.
- No nav link / homepage entry yet — that's the deliberate final step (owner does
  the theme edits after QA).
- Product-page care badges not turned on yet (separate theme step).
- A few published care-guide pages have factual errors already catalogued for
  correction (see docs/BLOG_CORRECTIONS_REVIEW.md) — pending owner approval.

---
**Note on cart-flow QA:** the store's primary domain is currently set to
`aquaticmotiv.myshopify.com` (see the open domain question with Vikram). Until that
is resolved, full add-to-cart/checkout QA should be done on the live store domain,
not the QA surface above. Content/data/finder QA does not depend on it.
