import React from 'react';
import '../../styles/gerador.css';
import '../../styles/templates.css';
import '../../styles/globals.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  variable: '--font-primary',
  subsets: ['latin'],
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
    <html lang="en">
      <body className={`${roboto.variable}`}>{children}</body>
    </html>
  );
}
