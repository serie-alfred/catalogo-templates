import React from 'react';
import '../../styles/globals.css';
import '../../styles/gerador.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
