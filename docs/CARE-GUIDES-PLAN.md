# Care-Guides Plan (Simple)

**Last updated:** 2026-06-27 · Supersedes the old "Scaling Plan — IA, Tools, Mobile."

## What we're building (one sentence)

One clean, mobile-friendly **hub page** that links out to all our existing Shopify
blogs/guides **plus** the new articles we write (optimized for AI/LLM answers), with the
**planted-tank quiz** as the *only* interactive feature — then we plug the hub into the
Shopify store at the real URL.

## The two URLs (don't confuse them)

- **Canonical public hub — the SEO target:**
  `https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide`
  This is what Google/AI should index and what ranking snail/shrimp/plant content links into. The `/a` segment is required by Shopify app proxy routing.
- **Build origin — where we work, not the canonical:**
  `https://careguides.aquaticmotiv.com`
  The live Next.js app on the VPS (`careguides` in PM2), used as the app-proxy render origin.

## In scope

- The **hub page** — links out to existing Shopify guides/blogs + our new articles.
- The **plant + invert species pages** — care content / SEO landing pages (102 plants, 25 inverts).
- The **planted-tank quiz** (Plant Finder).
- **New AI/LLM-optimized articles** — the real growth work.

## Out of scope — erased

Everything tool-shaped except the quiz: stocking/bioload calculator, pairwise compatibility
pages, build-my-tank configurator, dosing/EI calculators, "My Tank" favorites, comparison tool,
Tank Doctor, aquascape quiz — **and the entire mobile-app / PWA track.**
*Reason: keep it simple and reliable; complex tooling has been unstable. The quiz is the one
interactive feature we keep.*

## The plan — 5 plain steps

1. **Strip it down** — remove tool framing/references from the page, code, and docs.
   Keep hub + species pages + quiz. *(done 2026-06-27)*
2. **Fix the links** — make sure the hub links out correctly to **all** existing Shopify
   guides/blogs + our articles. No dead ends, no orphans.
3. **Make it beautiful + mobile** — redesign the hub to current frontend-design standards so it
   renders correctly on a phone (44px touch targets, no horizontal scroll, fluid type).
4. **Write the content** — expand the AI/LLM-optimized articles: front-loaded self-contained
   answer blocks (~134–167 words), question-style headings, visible publish/updated dates, cited
   sources. (The app is already server-rendered, which AI crawlers require.)
5. **Go live on Shopify** — wire the hub to the canonical URL after QA.

## Always

- Honor SEO best practices; **load the SEO + frontend-design skills before doing the work.**
- Everything **mobile-first**.
