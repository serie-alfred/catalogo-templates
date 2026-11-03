import React from 'react';
import '../../styles/editor-tokens.css';
import '../../styles/marca.css';
import { variaveisDaMarca } from '../(home)/fonts';

/**
 * Root layout do /login: os tokens da marca e as fontes do site (o login é a
 * porta do editor, mas tem a cara do E-temas). Nada de globals.css (é o CSS
 * das lojas, com o `:focus` sem contorno) nem do LayoutProvider — o login não
 * roda o editor. Os tokens `--ed-` ficam para o vermelho do erro.
 */
export const metadata = {
  title: 'Entrar · E-temas',
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={variaveisDaMarca}>
      <body style={{ margin: 0, background: '#17130c' }}>{children}</body>
    </html>
  );
}
