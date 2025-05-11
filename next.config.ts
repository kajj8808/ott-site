import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {},
  images: {
    remotePatterns: [
      { hostname: "image.tmdb.org" },
      { hostname: "kajj8808.com" },
    ],
  },
};

export default nextConfig;
