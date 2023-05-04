const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import("next").NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: false,
  images: {
    // needed to be able to run `next export`
    unoptimized: true
  },
  trailingSlash: true,
});
