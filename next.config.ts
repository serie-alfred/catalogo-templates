import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  // O indicador do Next (só em dev) ficava em cima do pé do rail do editor,
  // onde moram o "Sair" e o aviso de login desligado.
  devIndicators: { position: 'bottom-right' },
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
