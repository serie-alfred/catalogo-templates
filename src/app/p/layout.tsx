import React from 'react';
import '../../styles/templates.css';
import '../../styles/globals.css';
import '../../styles/storefront.css';
import '../../styles/preview.css';

export const metadata = {
  title: 'Preview do tema',
  description: 'Pré-visualização navegável do tema de e-commerce.',
};

export default function PreviewLayout({
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
