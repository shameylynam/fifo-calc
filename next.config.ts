import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling the Anthropic SDK — load it from
  // node_modules at runtime so all its internal dynamic imports work.
  serverExternalPackages: ["@anthropic-ai/sdk"],
};

export default nextConfig;
