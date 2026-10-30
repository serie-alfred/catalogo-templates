import React from 'react';

import type { Metadata } from 'next';
import '../../styles/globals.css';

export const metadata: Metadata = {
  title: 'E-temas',
  description:
    'Gere e personalize temas de e-commerce de forma rápida e intuitiva. Escolha, edite e lance sua loja virtual com templates profissionais prontos para vender mais.',
  // Nenhuma superfície deste app deve aparecer na busca: a home é vitrine
  // interna, o /gerador é ferramenta de time e o /p expõe temas de clientes
  // em URLs de adivinhação barata. O `noindex` vai na META de cada layout, e
  // NÃO como `Disallow` no robots.txt — bloquear o rastreamento impediria o
  // Google de LER este noindex, e a URL continuaria indexada sem descrição.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
