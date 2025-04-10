import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coj.sega.jp",
      },
    ],
  },
};

export default nextConfig;
