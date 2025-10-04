import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
      },
      {
        hostname: "kajj8808.com",
      },
      { hostname: "media.themoviedb.org" },
    ],
  },
};

export default nextConfig;
