const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import("next").NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  output: "export",
  experimental: { cpus: 1 },
  images: {
    // Static hosting does not run the Next.js image server.
    unoptimized: true
  },
  trailingSlash: true,
});
