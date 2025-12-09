import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
  },
  reactCompiler: true,
  experimental: {
    // Force specific routes to be dynamic
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip static generation for account pages
  async headers() {
    return [
      {
        source: '/account/:path*',
        headers: [
          {
            key: 'x-prerender-bypass',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
