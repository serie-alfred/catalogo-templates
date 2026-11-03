import React from 'react';
import '../../styles/templates.css';
import '../../styles/globals.css';
import '../../styles/storefront.css';
import '../../styles/preview.css';
// Só para o balão de navegação (PreviewNav): tokens com prefixo, que a loja
// não lê, e as fontes do site como variável — nunca no <body>, que é da loja.
import '../../styles/marca.css';
import { variaveisDaMarca } from '../(home)/fonts';

export const metadata = {
  title: 'Preview do tema',
  description: 'Pré-visualização navegável do tema de e-commerce.',
  // Nenhuma superfície deste app deve aparecer na busca: a home é vitrine
  // interna, o /gerador é ferramenta de time e o /p expõe temas de clientes
  // em URLs de adivinhação barata. O `noindex` vai na META de cada layout, e
  // NÃO como `Disallow` no robots.txt — bloquear o rastreamento impediria o
  // Google de LER este noindex, e a URL continuaria indexada sem descrição.
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={variaveisDaMarca}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
