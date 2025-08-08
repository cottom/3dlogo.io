import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for OpenNext.js Cloudflare deployment
  // The adapter will handle the edge runtime configuration

  // Disable image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
