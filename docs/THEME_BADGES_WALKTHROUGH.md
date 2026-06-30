# Product-page care badges — theme editor walkthrough

The `aquascaping` metafields are now live on 25 plant products (and growing as
the knowledge graph expands). The theme can render them natively — no app code.
This is a one-time setup in the theme editor; ~10 minutes.

## Steps (Online Store → Themes → Customize)

1. Open the theme editor on a **duplicate** of the live theme (Themes → ⋯ → Duplicate),
   so you can preview before publishing.
2. Top-center template picker → **Products → Default product**.
   To preview with real data, pick "Java Fern (Microsorum pteropus) Pot" as the
   preview product — it has all fields populated.
3. In the left panel, inside the product information section, click **Add block**.
   Depending on the theme, the right block type is one of:
   - **Icon with text** / **Text** rows, one per attribute, or
   - **Collapsible row** (e.g. labelled "Care guide") for a tidy spec table.
4. For each row, click the field's **dynamic source** icon (⌁ / database symbol)
   and pick the metafield. Suggested rows, in order:

   | Label | Metafield (namespace: aquascaping) |
   |---|---|
   | Light | Light requirement |
   | CO2 required | CO2 required |
   | Placement | Placement |
   | Growth rate | Growth rate |
   | Max height (in) | Max height (in) |
   | Care level | Care level |
   | Attaches to hardscape | Attaches to hardscape |
   | Snail safe | Snail safe |
   | Temperature (°F) | Min temperature (F) + Max temperature (F) |
   | pH | Min pH + Max pH |

   All 19 definitions are pinned, so they appear at the top of the picker.
5. Blocks bound to a metafield auto-hide when a product has no value, so
   non-plant products are unaffected. Verify by previewing a hardscape product.
6. Save, preview, then **Publish** the duplicated theme.

## Notes

- Boolean fields render as "true"/"false" in most themes. If that looks rough,
  either rename labels to read naturally ("CO2 required: false" → acceptable),
  or wait for the standalone plant pages which render these properly.
- The "Plant guide slug" field (`plant_slug`) is plumbing for the upcoming
  finder pages — no need to display it.
- Definitions and values are managed from the repo:
  `node scripts/setup-metafield-definitions.mjs` and
  `node scripts/sync-plant-metafields.mjs`. Manual edits in the admin will be
  overwritten on the next sync for synced products.
