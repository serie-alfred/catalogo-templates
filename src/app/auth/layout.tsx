import React from 'react';
import '../../styles/editor-tokens.css';
import '../../styles/marca.css';
import { variaveisDaMarca } from '../(home)/fontes-marca';

/**
 * Root layout das telas de acesso fora do /login (/auth/esqueci,
 * /auth/nova-senha, /auth/definir-senha, /auth/confirmar): a mesma casca do
 * /login (src/app/login/layout.tsx) — marca, fontes do site, nada do editor.
 */
export const metadata = {
  title: 'Acesso · E-temas',
  robots: { index: false, follow: false },
};

export default function AuthLayout({
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
