import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Um segundo `next dev` (ex.: com o login ligado, ao lado do dev de sempre)
  // precisa de outro diretório: dois servidores no mesmo `.next` se atropelam.
  // NEXT_DIST_DIR=.next-login yarn next dev -p 5512
  distDir: process.env.NEXT_DIST_DIR || '.next',
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
