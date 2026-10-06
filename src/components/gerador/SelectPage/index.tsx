'use client';

import React from 'react';

import Dropdown from './Dropdown';

interface SelectPageProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Contexto aberto no canvas.
 *
 * As QUATRO entradas continuam: "Todas as páginas" (`common`) parece supérflua
 * ao lado das três páginas reais, mas é a única visão em que o Card de Produto
 * aparece como seção — `belongsToPage` só o exibe ali (utils/previewRender.ts).
 * Tirá-la do menu tornaria o card inalcançável.
 */
const PAGES = [
  { key: 'common', name: 'Todas as páginas' },
  { key: 'home', name: 'Homepage' },
  { key: 'category', name: 'Página de Categoria' },
  { key: 'product', name: 'Página de Produto' },
];

export default function SelectPage({
  selectedPage,
  setSelectedPage,
}: SelectPageProps) {
  return (
    <Dropdown
      options={PAGES}
      value={selectedPage}
      onChange={setSelectedPage}
      ariaLabel="Página"
      fallback={PAGES[1]}
    />
  );
}
