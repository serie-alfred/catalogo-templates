import React from 'react';
import { Inter } from 'next/font/google';
import '../../../styles/globals.css';
// DEPOIS de globals.css: a trava de dark mode precisa vencer por ordem.
import '../../../styles/editor-tokens.css';
import '../../../styles/marca.css';

/**
 * Root layout do painel de contas (`/gerador/contas`). Próprio, e não o do
 * editor, de propósito: o do editor monta o `LayoutProvider`, que hidrata a aba
 * e grava o estado dela — abrir o painel não pode mexer no trabalho da aba.
 * Aqui não há tema de loja, então a Inter pode ir no <body>.
 */
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Contas e acessos · E-temas',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
