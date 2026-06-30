import type { MetadataRoute } from "next";
import { CARE_BASE } from "@/lib/data/plant-pages";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${CARE_BASE}/sitemap.xml`,
  };
}
