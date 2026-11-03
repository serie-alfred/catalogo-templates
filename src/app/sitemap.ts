import type { MetadataRoute } from 'next';

/** As duas páginas indexáveis do app (ver app/robots.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.e-temas.com.br/', priority: 1 },
    { url: 'https://www.e-temas.com.br/privacidade', priority: 0.2 },
  ];
}
