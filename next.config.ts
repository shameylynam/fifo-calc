import type { NextConfig } from "next";

const repoName = "fifo-calc";
const nextConfig: NextConfig = {
  basePath: "/" + repoName,
  assetPrefix: "/" + repoName + "/",
  output: "export", // Enables static export for GitHub Pages
};

export default nextConfig;
