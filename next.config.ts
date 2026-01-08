import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
