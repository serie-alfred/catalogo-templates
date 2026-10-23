import React from 'react';
import { Inter } from 'next/font/google';
import '../../styles/editor-tokens.css';

/**
 * Root layout do /login: só os tokens do editor e o Inter do chrome. Nada de
 * globals.css (é o CSS das lojas, com o `:focus` sem contorno) nem do
 * LayoutProvider — o login não roda o editor.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
    <html lang="pt-BR" className={inter.variable}>
      <body style={{ margin: 0, background: 'var(--ed-bg-01)' }}>
        {children}
      </body>
    </html>
  );
}
