'use client';

import React, { useEffect, useMemo } from 'react';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';
import { loadComponentFonts, loadGoogleFont } from '@/utils/googleFont';
import { buildThemeStyle } from '@/utils/themeStyle';
import ThemeRenderer from '../ThemeRenderer';
import SeededLayoutProvider from '../SeededLayoutProvider';

interface SeededStorefrontProps {
  selections: LayoutSelection[];
  colors: FrameColors;
  fonts: FrameFonts;
  logo: string;
  /** Página interna a renderizar: "home" | "category" | "product". */
  pagina: string;
  isMobile?: boolean;
}

/**
 * A loja renderizada FORA do editor, a partir de um estado pronto: o preview
 * compartilhável (`/p`, via SharedPreview) e a vitrine de templates
 * (`/templates/<NN>/<página>/frame`). Sem navegação nem "Editar" — quem quiser
 * isso põe por fora.
 */
export default function SeededStorefront({
  selections,
  colors,
  fonts,
  logo,
  pagina,
  isMobile = false,
}: SeededStorefrontProps) {
  // Contexto semeado — os templates leem `logo` e `selections` daqui (via
  // useLayout), sem depender do estado local do editor.
  const seed = useMemo(() => ({ logo, selections }), [logo, selections]);

  const themeStyle = useMemo(
    () => buildThemeStyle(colors, fonts),
    [colors, fonts]
  );

  // Os <link> das fontes do Google não dá pra pôr inline. As variáveis já
  // estão aplicadas no wrapper (abaixo).
  useEffect(() => {
    const { fontPrimary, fontSecondary, fontTertiary } = fonts;
    [fontPrimary, fontSecondary, fontTertiary].forEach(family =>
      loadGoogleFont(family)
    );
    loadComponentFonts(selections);
  }, [fonts, selections]);

  return (
    <SeededLayoutProvider seed={seed}>
      <div style={themeStyle}>
        <ThemeRenderer
          selections={selections}
          pagina={pagina}
          isMobile={isMobile}
        />
      </div>
    </SeededLayoutProvider>
  );
}
