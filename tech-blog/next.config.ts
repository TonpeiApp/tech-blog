import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tompedia-tech.assets.newt.so',
      },
    ],
  },
};

export default nextConfig;
