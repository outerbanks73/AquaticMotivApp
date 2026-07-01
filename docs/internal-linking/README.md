# Internal Linking Workflow

Use this workflow to connect Shopify blog posts and pages to the care-guide hub without rebuilding an app.

## Source Of Truth

- Hub URL: `https://aquaticmotiv.com/pages/freshwater-aquatic-planted-tank-guide`
- Link map: `docs/internal-linking/snail-invert-link-map.csv`
- Manual pilot snippets: `docs/internal-linking/snail-pilot-snippets.md`

## Rules

- Add one natural contextual body link back to the hub.
- Add one product or collection link when the article has clear buying intent.
- Add one `Related Care Guides` block with three or four curated links.
- Keep anchors descriptive and varied.
- Do not use automated keyword replacement.
- Do not add links that do not help the reader choose the next useful page.
- Do not publish duplicate temporary review copies.

## Manual Pilot

Edit the first five rows marked `pilot` in the link map by hand in Shopify Admin.

For each article:

1. Open the original article in Shopify Admin.
2. Copy the original HTML into a local note or doc before editing.
3. Add the suggested hub sentence near the lower third of the article.
4. Add the suggested collection link where it reads naturally.
5. Add the related-guides block near the end of the article body.
6. Preview desktop and mobile.
7. Confirm every link opens the intended page.
8. Publish only after the page looks clean.
9. Mark the row `manual_published` in the link map.

## Batch Workflow

After the pilot is approved, process batches of five.

1. Export the original HTML for each source page.
2. Create an unpublished Shopify copy named `TEMP REVIEW - [Original Title]`.
3. Apply the mapped edits to the temporary copy.
4. Add the temporary review URL to the link map.
5. Review the batch in Shopify.
6. After approval, apply the same edits to the original pages.
7. Verify the originals.
8. Delete the temporary copies.
9. Mark the originals `published` in the link map.

Temporary copies must stay hidden from navigation and deleted after review. If a temporary copy cannot be kept unindexed, use a local HTML snapshot instead.

## Acceptance Checks

- Hub link exists and uses a natural anchor.
- Commercial link points to the right collection or product.
- Related block has three or four relevant links.
- No broken links or redirect chains.
- No repeated exact-match anchor pattern across every article.
- No article has duplicate related blocks.
- The article renders cleanly on mobile.
- Temporary copies are deleted after originals are updated.
