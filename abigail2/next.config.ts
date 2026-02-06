import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: {
    unoptimized: true, // for development with missing images
  },
};

export default nextConfig;


