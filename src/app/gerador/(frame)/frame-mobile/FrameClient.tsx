'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import ThemeRenderer from '@/components/preview/ThemeRenderer';
import SeededLayoutProvider from '@/components/preview/SeededLayoutProvider';
import {
  useCanvasInteractions,
  highlightSection,
  scrollToSection,
} from '@/hooks/useCanvasInteractions';
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
    // O canvas só existe depois do primeiro `content`.
    enabled: !!content,
    onSelect: uid =>
      postRef.current({ source: FRAME_CHILD, type: 'select', uid }),
    onHover: uid =>
      postRef.current({ source: FRAME_CHILD, type: 'hover', uid }),
    onDuplicate: uid =>
      postRef.current({
        source: FRAME_CHILD,
        type: 'section-action',
        action: 'duplicate',
        uid,
      }),
    onRemove: uid =>
      postRef.current({
        source: FRAME_CHILD,
        type: 'section-action',
        action: 'remove',
        uid,
      }),
  });

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as ToFrame | undefined;
      if (data?.source !== FRAME_PARENT) return;

      switch (data.type) {
        // O pai chegou depois de nós: reanuncia, que o `ready` do mount se
        // perdeu no vazio.
        case 'hello':
          postRef.current({ source: FRAME_CHILD, type: 'ready' });
          break;
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
        case 'zoom':
          // A camada de controles (badges e rótulo de hover) é filha do <body>
          // DESTE documento, então ela escala junto com o tema. A 0,4 um badge
          // de 24px vira 9px. O CSS divide as medidas por este fator para que
          // eles fiquem do mesmo tamanho na tela, em qualquer escala.
          document.documentElement.style.setProperty(
            '--frame-escala',
            String(data.escala || 1)
          );
          break;
        case 'scroll-to':
          scrollToSection(rootRef.current, data.uid);
          break;
      }
    };

    window.addEventListener('message', onMessage);

    // Repassa desfazer/refazer ao editor: o foco dentro do iframe deixaria o
    // atalho fora do alcance do documento pai.
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      const el = event.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.isContentEditable)
      ) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key !== 'z' && key !== 'y') return;
      event.preventDefault();
      postRef.current({
        source: FRAME_CHILD,
        type: 'shortcut',
        action: key === 'y' || event.shiftKey ? 'redo' : 'undo',
      });
    };
    document.addEventListener('keydown', onKeyDown);

    // O filho anuncia prontidão: o `load` do iframe dispara antes da hidratação
    // do React, então a primeira mensagem do pai se perderia. O pai só envia
    // depois deste "ready" (e o handler dele é idempotente, porque o
    // StrictMode/HMR dispara isto duas vezes).
    //
    // Se o pai ainda não estiver escutando, este anúncio cai no vazio — é para
    // isso que existe o `hello` no sentido contrário.
    postRef.current({ source: FRAME_CHILD, type: 'ready' });

    return () => {
      window.removeEventListener('message', onMessage);
      document.removeEventListener('keydown', onKeyDown);
    };
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
    () => ({
      logo: content?.logo ?? '',
      selections: content?.selections ?? [],
    }),
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
