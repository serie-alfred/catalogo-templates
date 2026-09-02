'use client';

import React, { useEffect, useMemo } from 'react';
import type { PreviewSnapshot } from '@/lib/previewStore';
import { loadComponentFonts, loadGoogleFont } from '@/utils/googleFont';
import { buildThemeStyle } from '@/utils/themeStyle';
import ThemeRenderer from '../ThemeRenderer';
import PreviewNav from '../PreviewNav';
import SeededLayoutProvider from '../SeededLayoutProvider';

interface SharedPreviewProps {
  snapshot: PreviewSnapshot;
  /** Página interna a renderizar: "home" | "category" | "product". */
  pagina: string;
  /** ID do preview e slug da URL atual (para o balão de navegação). */
  id: string;
  activeSlug: string;
}

export default function SharedPreview({
  snapshot,
  pagina,
  id,
  activeSlug,
}: SharedPreviewProps) {
  // Contexto semeado pelo snapshot — os templates leem `logo` e `selections`
  // daqui (via useLayout), sem depender do estado local do editor.
  const seed = useMemo(
    () => ({ logo: snapshot.logo, selections: snapshot.selections }),
    [snapshot.logo, snapshot.selections]
  );

  const themeStyle = useMemo(
    () => buildThemeStyle(snapshot.colors, snapshot.fonts),
    [snapshot.colors, snapshot.fonts]
  );

  // Efeitos que NÃO dá pra fazer inline: injetar os <link> das fontes do Google
  // e o favicon. As variáveis já estão aplicadas no wrapper (acima).
  useEffect(() => {
    const { fontPrimary, fontSecondary, fontTertiary } = snapshot.fonts;
    [fontPrimary, fontSecondary, fontTertiary].forEach(family =>
      loadGoogleFont(family)
    );
    loadComponentFonts(snapshot.selections);

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
    <SeededLayoutProvider seed={seed}>
      <div style={themeStyle}>
        <ThemeRenderer selections={snapshot.selections} pagina={pagina} />
      </div>
      <PreviewNav id={id} activeSlug={activeSlug} />
    </SeededLayoutProvider>
  );
}
