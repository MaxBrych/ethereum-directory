/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@thirdweb-dev/react",
    "@thirdweb-dev/sdk",
    "@thirdweb-dev/chains",
    "ethers",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" }, // logos
      { protocol: "https", hostname: "image.thum.io" },     // thumbnails
      { protocol: "https", hostname: "**" },                // (optional) catch-all
    ],
  },
  webpack: (config: any ) => {
    // MIME-type issue fix
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: { fullySpecified: false },
    });

    // Polyfills
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      zlib: require.resolve("browserify-zlib"),
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      ...config.resolve.fallback,
    };

    const { ProvidePlugin } = require("webpack");
    config.plugins.push(
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      })
    );

    return config;
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

module.exports = nextConfig;