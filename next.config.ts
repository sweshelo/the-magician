import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coj.sega.jp',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/tickets' }];
  },
};

export default nextConfig;
