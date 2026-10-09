'use client';

import React from 'react';

import type { Platform } from '@/types/platform';
import { plataformaTemLanding } from '@/utils/previewRender';

import Dropdown from './Dropdown';

interface SelectPageProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
  platform: Platform | null;
}

/**
 * Contexto aberto no canvas.
 *
 * As QUATRO entradas continuam: "Todas as páginas" (`common`) parece supérflua
 * ao lado das três páginas reais, mas é a única visão em que o Card de Produto
 * aparece como seção — `belongsToPage` só o exibe ali (utils/previewRender.ts).
 * Tirá-la do menu tornaria o card inalcançável.
 *
 * "LPs" é a quinta: a página em que a LP de campanha entra INTEIRA, com o
 * header e o footer comuns da loja. Só aparece na plataforma que tem LP no
 * catálogo (hoje Wake e VTEX) — na Tray ela abriria um modal vazio.
 */
const PAGES = [
  { key: 'common', name: 'Todas as páginas' },
  { key: 'home', name: 'Homepage' },
  { key: 'category', name: 'Página de Categoria' },
  { key: 'product', name: 'Página de Produto' },
];

const LANDING = { key: 'landing', name: 'LPs' };

export default function SelectPage({
  selectedPage,
  setSelectedPage,
  platform,
}: SelectPageProps) {
  const options = plataformaTemLanding(platform) ? [...PAGES, LANDING] : PAGES;
  return (
    <Dropdown
      options={options}
      value={selectedPage}
      onChange={setSelectedPage}
      ariaLabel="Página"
      fallback={PAGES[1]}
    />
  );
}
