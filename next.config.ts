import type { NextConfig } from "next";

// Production pins Next.js assets and image optimizer requests to the
// standalone origin while public pages canonicalize to the Shopify app proxy.
const assetOrigin = process.env.ASSET_ORIGIN;

const nextConfig: NextConfig = {
  output: "standalone",
  ...(assetOrigin ? { assetPrefix: assetOrigin } : {}),
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      { source: "/a/freshwater-aquatic-planted-tank-guide", destination: "/" },
      { source: "/a/freshwater-aquatic-planted-tank-guide/:path*", destination: "/:path*" },
    ];
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
