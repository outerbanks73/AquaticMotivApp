import type { NextConfig } from "next";

// Production can pin Next.js assets and image optimizer requests to the
// standalone care-guides origin. Unset in dev.
const assetOrigin = process.env.ASSET_ORIGIN;

const nextConfig: NextConfig = {
  output: "standalone",
  ...(assetOrigin ? { assetPrefix: assetOrigin } : {}),
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
      {
        protocol: "https",
        hostname: "aquaticmotiv.com",
        pathname: "/cdn/**",
      },
      {
        protocol: "https",
        hostname: "www.aquaticmotiv.com",
        pathname: "/cdn/**",
      },
    ],
  },
};

export default nextConfig;
