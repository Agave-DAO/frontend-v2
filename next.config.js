const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import("next").NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      "tokens.1inch.io",
      "ethereum-optimism.github.io",
      "assets.coingecko.com",
      "raw.githubusercontent.com",
      "elk.finance",
      "api.rubic.exchange",
      "daodkp.oss-ap-southeast-1.aliyuncs.com",
      "cloudstorage.openocean.finance",
    ]
  }
});
