'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import ThemeRenderer from '@/components/preview/ThemeRenderer';
import SeededLayoutProvider from '@/components/preview/SeededLayoutProvider';
import { useCanvasInteractions, highlightSection, scrollToSection } from '@/hooks/useCanvasInteractions';
import { loadComponentFonts, loadGoogleFont } from '@/utils/googleFont';
import { buildThemeStyle } from '@/utils/themeStyle';
import {
  FRAME_CHILD,
  FRAME_PARENT,
  type FrameColors,
  type FrameFonts,
  type FromFrame,
  type ToFrame,
} from '@/types/frameMessage';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';

interface Content {
  selections: LayoutSelection[];
  pagina: string;
  logo: string;
  selectedUid: string | null;
  isMobile: boolean;
}

/**
 * Documento embutido no iframe da visão mobile do editor.
 *
 * Existe porque os drawers e o mini-cart mobile dos Headers são
 * `position: fixed`: num div de 400px dentro do editor eles escapam do frame e
 * cobrem a tela inteira. Dentro do iframe o viewport é real, então `fixed` e
 * `100dvh` resolvem contra os 375px — como no celular.
 */
export default function FrameClient() {
  const [theme, setTheme] = useState<{
    colors: FrameColors;
    fonts: FrameFonts;
  } | null>(null);
  const [content, setContent] = useState<Content | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const post = (message: FromFrame) => {
    window.parent?.postMessage(message, window.location.origin);
  };
  const postRef = useRef(post);
  postRef.current = post;

  useCanvasInteractions(rootRef, {
    onSelect: uid => postRef.current({ source: FRAME_CHILD, type: 'select', uid }),
    onHover: uid => postRef.current({ source: FRAME_CHILD, type: 'hover', uid }),
  });

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as ToFrame | undefined;
      if (data?.source !== FRAME_PARENT) return;

      switch (data.type) {
        case 'theme':
          setTheme({ colors: data.colors, fonts: data.fonts });
          break;
        case 'content':
          setContent({
            selections: data.selections,
            pagina: data.pagina,
            logo: data.logo,
            selectedUid: data.selectedUid,
            isMobile: data.isMobile,
          });
          break;
        case 'highlight':
          highlightSection(rootRef.current, data.uid);
          break;
        case 'scroll-to':
          scrollToSection(rootRef.current, data.uid);
          break;
      }
    };

    window.addEventListener('message', onMessage);

    // O filho anuncia prontidão: o `load` do iframe dispara antes da hidratação
    // do React, então a primeira mensagem do pai se perderia. O pai só envia
    // depois deste "ready" (e o handler dele é idempotente, porque o
    // StrictMode/HMR dispara isto duas vezes).
    postRef.current({ source: FRAME_CHILD, type: 'ready' });

    return () => window.removeEventListener('message', onMessage);
  }, []);

  // As fontes precisam ser injetadas NESTE documento: os <link> do editor não
  // valem aqui.
  useEffect(() => {
    if (!theme) return;
    const { fontPrimary, fontSecondary, fontTertiary } = theme.fonts;
    [fontPrimary, fontSecondary, fontTertiary].forEach(family =>
      loadGoogleFont(family, document)
    );
  }, [theme]);

  useEffect(() => {
    if (!content) return;
    loadComponentFonts(content.selections, document);
  }, [content]);

  const themeStyle = useMemo(
    () => (theme ? buildThemeStyle(theme.colors, theme.fonts) : undefined),
    [theme]
  );

  const seed = useMemo(
    () => ({ logo: content?.logo ?? '', selections: content?.selections ?? [] }),
    [content?.logo, content?.selections]
  );

  if (!content) return null;

  return (
    <SeededLayoutProvider seed={seed}>
      {/* O wrapper carrega as CSS vars: mudar uma cor re-renderiza só ele, e o
          ThemeRenderer (memo) faz bail-out da árvore de templates. */}
      <div ref={rootRef} className="editor-canvas" style={themeStyle}>
        {/*
          A `key` remonta a árvore ao trocar desktop↔mobile — e isso é
          necessário, não cosmético.

          O iframe muda de largura por CSS, sem recarregar o documento. Os
          Swipers já inicializados guardam larguras de slide e um translate
          calculados na largura ANTERIOR; o ResizeObserver deles corrige a
          largura, mas não o translate, então um carrossel que não estivesse no
          primeiro slide reaparecia deslocado, com slides cortados nas duas
          bordas. Remontar faz cada Swiper inicializar já na largura certa.

          O custo é perder estado transiente na troca (slide atual, drawer
          aberto) — aceitável, e discutível se é sequer indesejado ao mudar de
          viewport. O documento em si não recarrega: as fontes não são
          refetchadas.
        */}
        <ThemeRenderer
          key={content.isMobile ? 'mobile' : 'desktop'}
          selections={content.selections}
          pagina={content.pagina}
          isMobile={content.isMobile}
          selectedUid={content.selectedUid}
        />
      </div>
    </SeededLayoutProvider>
  );
}
