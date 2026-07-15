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

  // Variáveis de tema como estilo INLINE num wrapper — aplicadas já no 1º paint
  // (SSR), sem esperar um useEffect. Custom properties são herdadas por todos os
  // descendentes, então isso substitui o antigo setProperty no :root e elimina o
  // flash de cores default (azul/branco) ao abrir o preview.
  const themeStyle = useMemo(() => {
    const c = snapshot.colors;
    const f = snapshot.fonts;
    return {
      '--text-primary-color': c.colorPrimary,
      '--text-secundary-color': c.colorSecondary,
      '--text-tertiary-color': c.colorTertiary,
      '--background-primary-color': c.colorPrimaryBackground,
      '--background-primary-color-safe': colorSafeOnWhite(
        c.colorPrimaryBackground
      ),
      '--background-secundary-color': c.colorSecondaryBackground,
      '--background-tertiary-color': c.colorTertiaryBackground,
      '--background-footer': c.colorFooter,
      '--text-color-footer': c.colorFooterText,
      '--text-color-base': c.colorPrimaryText,
      '--text-color-secundary': c.colorSecondaryText,
      '--font-primary': `'${f.fontPrimary}', sans-serif`,
      '--font-secundary': `'${f.fontSecondary}', sans-serif`,
      '--font-tertiary': `'${f.fontTertiary}', sans-serif`,
    } as React.CSSProperties;
  }, [snapshot.colors, snapshot.fonts]);

  // Efeitos que NÃO dá pra fazer inline: injetar os <link> das fontes do Google
  // e o favicon. As variáveis já estão aplicadas no wrapper (acima).
  useEffect(() => {
    const { fontPrimary, fontSecondary, fontTertiary } = snapshot.fonts;
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
      <div style={themeStyle}>
        <ThemeRenderer selections={snapshot.selections} pagina={pagina} />
      </div>
      <PreviewNav id={id} activeSlug={activeSlug} />
    </LayoutContext.Provider>
  );
}
