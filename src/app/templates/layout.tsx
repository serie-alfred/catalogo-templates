import React from 'react';
import { Inter } from 'next/font/google';
import '../../styles/templates.css';
import '../../styles/globals.css';
import '../../styles/storefront.css';
// O documento é um storefront claro, como o /p: mesmas regras de documento.
import '../../styles/preview.css';
// A barra da vitrine reusa o seletor de página e o Desktop/Mobile do editor,
// que leem os tokens `--ed-`. DEPOIS de globals.css, como no editor.
import '../../styles/editor-tokens.css';

/**
 * Root layout da vitrine de templates: a barra (`/templates/<NN>/<página>`) e o
 * documento da loja que ela embute (`…/frame`). Os dois são públicos — a regra
 * do middleware só fecha o `/gerador`.
 *
 * O Inter vai só como custom property, aplicada na barra (`.ed-shell`): no
 * `<body>` ele venceria a fonte do tema dentro do frame — o mesmo cuidado do
 * layout do editor.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Templates · E-temas',
  description: 'Templates completos de e-commerce do E-temas, para visualizar.',
  // Nenhuma superfície deste app deve aparecer na busca: a home é vitrine
  // interna, o /gerador é ferramenta de time e o /p expõe temas de clientes
  // em URLs de adivinhação barata. O `noindex` vai na META de cada layout, e
  // NÃO como `Disallow` no robots.txt — bloquear o rastreamento impediria o
  // Google de LER este noindex, e a URL continuaria indexada sem descrição.
  robots: { index: false, follow: false },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
