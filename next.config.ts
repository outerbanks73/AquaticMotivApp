import type { NextConfig } from "next";

// When pages are served through the Shopify app proxy (aquaticmotiv.com/a/careguides/*),
// /_next/* asset paths would resolve against aquaticmotiv.com and 404. Building with
// ASSET_ORIGIN=https://careguides.aquaticmotiv.com makes assets and the image
// optimizer load directly from the origin host instead. Unset in dev.
const assetOrigin = process.env.ASSET_ORIGIN;

const nextConfig: NextConfig = {
  output: "standalone",
  ...(assetOrigin ? { assetPrefix: assetOrigin } : {}),
  // careguides.aquaticmotiv.com is the care-guides origin/staging host. Its root and the
  // retired SaveAFishWorks content-site routes (legacy dead code) should land on the hub.
  // /a/careguides/* is left intact so the Shopify App Proxy keeps working. App-functional
  // routes (/admin, /dashboard, /api, /auth) are untouched. Temporary (307) during the
  // restructure — revisit to 308 once the layout is finalized.
  async redirects() {
    const toHub = (source: string) => ({ source, destination: "/a/careguides", permanent: false });
    return [
      toHub("/"),
      ...["fish", "guides", "products", "best", "compare", "glossary", "examples", "for", "configurator"].flatMap(
        (base) => [toHub(`/${base}`), toHub(`/${base}/:path*`)],
      ),
    ];
  },
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["@prisma/client"],
  images: {
    ...(assetOrigin ? { path: `${assetOrigin}/_next/image` } : {}),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
  },
};

export default nextConfig;
