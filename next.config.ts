import type { NextConfig } from "next";

// When pages are served through the Shopify app proxy (aquaticmotiv.com/a/careguides/*),
// /_next/* asset paths would resolve against aquaticmotiv.com and 404. Building with
// ASSET_ORIGIN=https://careguides.aquaticmotiv.com makes assets and the image
// optimizer load directly from the origin host instead. Unset in dev.
const assetOrigin = process.env.ASSET_ORIGIN;

const nextConfig: NextConfig = {
  output: "standalone",
  ...(assetOrigin ? { assetPrefix: assetOrigin } : {}),
  async redirects() {
    return [
      { source: "/", destination: "/a/careguides", permanent: false },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    ...(assetOrigin ? { path: `${assetOrigin}/_next/image` } : {}),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
