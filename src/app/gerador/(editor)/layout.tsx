import React from 'react';
import { Inter } from 'next/font/google';
import '../../../styles/templates.css';
import '../../../styles/globals.css';
import '../../../styles/storefront.css';
import '../../../styles/editor-canvas.css';
// DEPOIS de globals.css: a trava de dark mode precisa vencer por ordem.
import '../../../styles/editor-tokens.css';
import { LayoutProvider } from '@/context/LayoutContext';

/**
 * Fonte do CHROME do editor (Figma). Exposta SÓ como custom property
 * (`inter.variable`), nunca como `inter.className`.
 *
 * A regra "sem next/font no gerador" vale para as fontes do TEMA, que o usuário
 * escolhe em runtime. Mas o Inter também não pode ir no <body>: o ExportStage
 * monta o ThemeRenderer neste mesmo documento e nenhum template declara
 * `font-family` própria, então a classe do next/font (0,1,0) venceria
 * `body { font-family: var(--font-family) }` (0,0,1) e os PNGs exportados
 * sairiam com outra tipografia, em silêncio. A família é aplicada no `.ed-shell`.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'E-temas',
  description:
    'Gere e personalize temas de e-commerce de forma rápida e intuitiva. Escolha, edite e lance sua loja virtual com templates profissionais prontos para vender mais.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={``} suppressHydrationWarning>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
