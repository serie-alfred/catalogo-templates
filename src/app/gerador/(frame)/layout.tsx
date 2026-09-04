import React from 'react';
import '../../../styles/templates.css';
import '../../../styles/globals.css';
import '../../../styles/storefront.css';
/* O frame também mostra o contorno de hover/seleção das seções. */
import '../../../styles/editor-canvas.css';
import './frame.css';

/**
 * Root layout do documento embutido no iframe da visão mobile do editor.
 *
 * Isolado de propósito: SEM gerador.css (a chrome do editor não existe aqui) e
 * SEM LayoutProvider — o contexto é semeado pelo FrameClient a partir do que o
 * editor manda por postMessage. Rodar useLayoutGenerator aqui hidrataria o
 * localStorage e o frame passaria a ter estado próprio, divergindo do editor.
 */
export const metadata = {
  title: 'Pré-visualização mobile',
  robots: { index: false, follow: false },
};

export default function FrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
