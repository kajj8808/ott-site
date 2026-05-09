import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {},
  images: {
    remotePatterns: [
      { hostname: "image.tmdb.org" },
      { hostname: "media.kajj8808.com" },
    ],
  },
};

export default nextConfig;
