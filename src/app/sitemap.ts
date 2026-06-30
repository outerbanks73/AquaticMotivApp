import type { MetadataRoute } from "next";
import { CARE_BASE, FINDER_URL, PLANTS_BASE, plantUrl } from "@/lib/data/plant-pages";
import { getActiveFacets } from "@/lib/data/plant-facets";
import { getPlantSlugs } from "@/lib/data/plants";
import { INVERTS_BASE, invertUrl } from "@/lib/data/invert-pages";
import { getActiveInvertFacets } from "@/lib/data/invert-facets";
import { getInvertSlugs } from "@/lib/data/inverts";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    CARE_BASE,
    PLANTS_BASE,
    FINDER_URL,
    INVERTS_BASE,
    `${CARE_BASE}/tank-setup`,
    ...getActiveFacets().filter((f) => !f.noindex).map((f) => plantUrl(f.slug)),
    ...getPlantSlugs().map((slug) => plantUrl(slug)),
    ...getActiveInvertFacets().filter((f) => !f.noindex).map((f) => invertUrl(f.slug)),
    ...getInvertSlugs().map((slug) => invertUrl(slug)),
  ];

  return urls.map((url) => ({
    url,
    lastModified: today,
    changeFrequency: "weekly",
    priority: url === CARE_BASE ? 1 : 0.7,
  }));
}
