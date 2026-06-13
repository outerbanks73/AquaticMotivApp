// Sitemap for the proxied /a/careguides/* namespace only.
// Served at https://aquaticmotiv.com/a/careguides/sitemap.xml via the app
// proxy; referenced from the store's robots.txt.liquid.

import { getPlantSlugs } from "@/lib/data/plants";
import { getActiveFacets } from "@/lib/data/plant-facets";
import { PLANTS_BASE, FINDER_URL, plantUrl } from "@/lib/data/plant-pages";
import { getInvertSlugs } from "@/lib/data/inverts";
import { getActiveInvertFacets } from "@/lib/data/invert-facets";
import { INVERTS_BASE, invertUrl } from "@/lib/data/invert-pages";

export const dynamic = "force-static";

// Build-time constant; pages are statically generated, so build date = lastmod.
const LASTMOD = new Date().toISOString().slice(0, 10);

function urlEntry(loc: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </url>`;
}

export async function GET() {
  const urls = [
    PLANTS_BASE,
    FINDER_URL,
    INVERTS_BASE,
    ...getActiveFacets().map((f) => plantUrl(f.slug)),
    ...getPlantSlugs().map((slug) => plantUrl(slug)),
    ...getActiveInvertFacets().map((f) => invertUrl(f.slug)),
    ...getInvertSlugs().map((slug) => invertUrl(slug)),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(urlEntry).join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
