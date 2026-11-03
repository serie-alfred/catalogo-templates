import React from 'react';

import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';

import MotionRoot from '@/components/motion/MotionRoot';
import { SCRIPT_DA_INTRO } from '@/components/home/Intro';
import Rastreamento from '@/components/site/Rastreamento';

import { variaveisDasFontes } from './fonts';

import 'lenis/dist/lenis.css';
import '../../styles/globals.css';
import '../../styles/site.css';

const DESCRICAO =
  'Templates completos de loja para VTEX FastStore, Wake e Tray. Escolha o seu, a gente aplica a sua marca e entrega a loja montada na plataforma que você já usa.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.e-temas.com.br'),
  title: 'E-temas · Templates de loja para VTEX FastStore, Wake e Tray',
  description: DESCRICAO,
  // A home e a /privacidade são as ÚNICAS superfícies indexáveis do app: o
  // /gerador é ferramenta de time e o /p expõe temas de clientes, e cada um
  // desses layouts mantém o seu `noindex` (ver app/robots.ts).
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'E-temas',
    title: 'Prove uma loja nova · E-temas',
    description: DESCRICAO,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#17130c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // O script da intro marca o <html> antes da hidratação: o atributo a mais
    // é esperado, daí o suppressHydrationWarning.
    <html lang="pt-BR" data-tier="alto" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_DA_INTRO }} />
      </head>
      <body className={`site ${variaveisDasFontes}`} suppressHydrationWarning>
        {children}
        <MotionRoot />
        <Rastreamento />
        <Analytics />
      </body>
    </html>
  );
}
