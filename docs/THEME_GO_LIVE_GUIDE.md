# Customer-facing go-live — theme edits (owner-performed)

Everything else is already in place: pages live on aquaticmotiv.com via the app
proxy, indexable, sitemap submitted in Search Console. These edits are what
makes the system *visible to customers* on the store. Do them in any order,
whenever you're ready. None are required for SEO indexing (already handled).

## 1. Main navigation (5 min)
Online Store → Navigation → Main menu:
- Add item: **Plant Finder** → URL `/a/careguides/finder`
- Optional second item (or nest under Plants): **Care Center** → `/a/careguides`

## 2. Homepage section (10 min)
Online Store → Themes → Customize → Homepage → Add section (banner / image-with-text):
- Heading: `Not sure what survives in your tank?`
- Body: `Answer 4 questions — get plants ranked for your exact light, CO2, and goals. 100+ species, honest care data.`
- Button: `Try the Plant Finder` → `/a/careguides/finder`
- Optional row of 3 links: Plant database (`/a/careguides/plants`) · Snail & invert
  guides (`/a/careguides/inverts`) · Care guides (`/pages/care-guides`, unchanged)

## 3. robots.txt sitemap line (5 min — belt-and-suspenders; GSC submission already covers discovery)
Online Store → Themes → ⋯ → Edit code → Add a new template → robots.txt
(if `robots.txt.liquid` doesn't exist yet). Append at the end:

```liquid
{%- comment -%} Care guides & finder sitemap (app proxy) {%- endcomment -%}
Sitemap: https://aquaticmotiv.com/a/careguides/sitemap.xml
```

## 4. Product-page care badges (10 min)
Already documented in detail: see `docs/THEME_BADGES_WALKTHROUGH.md`.
All 127 synced products (102 plants + 25 inverts) carry the metafields.

## 5. Care-guides hub page (optional, 5 min)
Online Store → Pages → "Care Guides": add links at the top to
`/a/careguides/plants`, `/a/careguides/inverts`, and `/a/careguides/finder`
so the hub becomes the bridge between the classic guides and the new system.

## What stays mine (no action needed from you)
- Blog/pages corrections + reverse links: applied via Admin API **only after
  your approval** of docs/BLOG_CORRECTIONS_REVIEW.md
- Server, app proxy, sitemap, Search Console monitoring
