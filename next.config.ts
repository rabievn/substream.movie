import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/styles")],
    // Abstracts (variables, mixins, functions) are available in every SCSS module.
    additionalData: `@use "abstracts" as *;`,
  },
};

export default nextConfig;
