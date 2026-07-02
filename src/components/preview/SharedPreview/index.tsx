'use client';

import React, { useEffect, useMemo } from 'react';
import {
  LayoutContext,
  type LayoutContextType,
} from '@/context/LayoutContext';
import type { PreviewSnapshot } from '@/lib/previewStore';
import ThemeRenderer from '../ThemeRenderer';
import PreviewNav from '../PreviewNav';

interface SharedPreviewProps {
  snapshot: PreviewSnapshot;
  /** Página interna a renderizar: "home" | "category" | "product". */
  pagina: string;
  /** ID do preview e slug da URL atual (para o balão de navegação). */
  id: string;
  activeSlug: string;
}

/** Versão visível em fundo branco (mesma regra do editor). */
function colorSafeOnWhite(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return hexColor;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brilho = (r * 299 + g * 587 + b * 114) / 1000;
  return brilho >= 220 ? '#000000' : hexColor;
}

/** Injeta o <link> da fonte do Google (idempotente por família). */
function loadGoogleFont(family: string) {
  if (!family) return;
  const id = `preview-font-${family.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+'
  )}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

export default function SharedPreview({
  snapshot,
  pagina,
  id,
  activeSlug,
}: SharedPreviewProps) {
  // Contexto semeado pelo snapshot — os templates leem `logo` e `selections`
  // daqui (via useLayout), sem depender do estado local do editor.
  const contextValue = useMemo(
    () =>
      ({
        logo: snapshot.logo,
        selections: snapshot.selections,
      }) as unknown as LayoutContextType,
    [snapshot.logo, snapshot.selections]
  );

  useEffect(() => {
    const root = document.documentElement;
    const c = snapshot.colors;

    // Cores globais (mesma lista aplicada pelo useLayoutGenerator no editor).
    root.style.setProperty('--text-primary-color', c.colorPrimary);
    root.style.setProperty('--text-secundary-color', c.colorSecondary);
    root.style.setProperty('--text-tertiary-color', c.colorTertiary);
    root.style.setProperty('--background-primary-color', c.colorPrimaryBackground);
    root.style.setProperty(
      '--background-primary-color-safe',
      colorSafeOnWhite(c.colorPrimaryBackground)
    );
    root.style.setProperty(
      '--background-secundary-color',
      c.colorSecondaryBackground
    );
    root.style.setProperty(
      '--background-tertiary-color',
      c.colorTertiaryBackground
    );
    root.style.setProperty('--background-footer', c.colorFooter);
    root.style.setProperty('--text-color-footer', c.colorFooterText);
    root.style.setProperty('--text-color-base', c.colorPrimaryText);
    root.style.setProperty('--text-color-secundary', c.colorSecondaryText);

    // Fontes globais: forma quotada (como o FontSelector) + carregamento.
    const { fontPrimary, fontSecondary, fontTertiary } = snapshot.fonts;
    root.style.setProperty('--font-primary', `'${fontPrimary}', sans-serif`);
    root.style.setProperty('--font-secundary', `'${fontSecondary}', sans-serif`);
    root.style.setProperty('--font-tertiary', `'${fontTertiary}', sans-serif`);
    [fontPrimary, fontSecondary, fontTertiary].forEach(loadGoogleFont);

    // Fontes por componente: valores no formato `'Família', sans-serif`.
    for (const sel of snapshot.selections) {
      if (!sel.variables) continue;
      for (const value of Object.values(sel.variables)) {
        const match = /^'([^']+)'/.exec(value);
        if (match) loadGoogleFont(match[1]);
      }
    }

    // Favicon do tema.
    if (snapshot.favicon) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = snapshot.favicon;
    }
  }, [snapshot]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <ThemeRenderer selections={snapshot.selections} pagina={pagina} />
      <PreviewNav id={id} activeSlug={activeSlug} />
    </LayoutContext.Provider>
  );
}
