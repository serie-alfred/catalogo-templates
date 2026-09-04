'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { useLayout } from '@/context/LayoutContext';
import {
  FRAME_CHILD,
  FRAME_PARENT,
  type FromFrame,
  type ToFrame,
} from '@/types/frameMessage';

import styles from './index.module.css';

/**
 * O canvas do editor: o tema renderizado dentro de um <iframe>, nas duas
 * visões (desktop em largura total, mobile em 375px).
 *
 * POR QUE IFRAME, E NÃO UM DIV NO DOCUMENTO DO EDITOR
 *
 * Os mini-carts, drawers e overlays de busca dos Headers são
 * `position: fixed` COM alturas em `calc(100vh - N)`. Num div do documento do
 * editor os dois se resolvem contra a janela do editor, então o mini-cart
 * cobria a tela inteira — dock e painel de seções incluídos.
 *
 * Não dá para consertar isso de fora:
 *  - `transform`/`contain` no wrapper corrige a ANCORAGEM (o wrapper passa a
 *    ser containing block do `fixed`), mas `vh` continua resolvendo contra a
 *    viewport. O resultado é um drawer com altura de janela ancorado no topo do
 *    canvas — fora de vista quando a página está rolada. Pior que o bug.
 *  - Mexer no CSS dos templates quebraria a paridade com o `faststore.starter`.
 *
 * Dentro do iframe a viewport É o site: `fixed` e `vh` passam a significar
 * exatamente o que significam na loja publicada. É o que o Shopify faz.
 *
 * Bônus: as `@container` dos templates passam a resolver contra a largura real
 * do frame, e trocar desktop↔mobile é só CSS no host — mesmo documento, sem
 * reload, sem perder estado de Swiper/drawer.
 */
export default function PreviewFrame() {
  const {
    selections,
    selectedPage,
    selectedUid,
    setSelectedUid,
    hoveredUid,
    setHoveredUid,
    isMobileView,
    scrollToSectionRef,
    logo,
    colorPrimary,
    colorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
    colorFooter,
    colorFooterText,
    colorPrimaryText,
    colorSecondaryText,
    fontPrimary,
    fontSecondary,
    fontTertiary,
  } = useLayout();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  /** Último payload de tema pendente, drenado 1× por frame. */
  const pendingThemeRef = useRef<ToFrame | null>(null);
  const rafRef = useRef<number | null>(null);

  const post = useCallback((message: ToFrame) => {
    if (!readyRef.current) return;
    iframeRef.current?.contentWindow?.postMessage(
      message,
      window.location.origin
    );
  }, []);

  /** Coalesce por frame: o color picker dispara a cada movimento do mouse. */
  const postThemeCoalesced = useCallback(
    (message: ToFrame) => {
      pendingThemeRef.current = message;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const pending = pendingThemeRef.current;
        pendingThemeRef.current = null;
        if (pending) post(pending);
      });
    },
    [post]
  );

  const themeMessage = useCallback(
    (): ToFrame => ({
      source: FRAME_PARENT,
      type: 'theme',
      colors: {
        colorPrimary,
        colorSecondary,
        colorTertiary,
        colorPrimaryBackground,
        colorSecondaryBackground,
        colorTertiaryBackground,
        colorFooter,
        colorFooterText,
        colorPrimaryText,
        colorSecondaryText,
      },
      fonts: { fontPrimary, fontSecondary, fontTertiary },
    }),
    [
      colorPrimary,
      colorSecondary,
      colorTertiary,
      colorPrimaryBackground,
      colorSecondaryBackground,
      colorTertiaryBackground,
      colorFooter,
      colorFooterText,
      colorPrimaryText,
      colorSecondaryText,
      fontPrimary,
      fontSecondary,
      fontTertiary,
    ]
  );

  const contentMessage = useCallback(
    (): ToFrame => ({
      source: FRAME_PARENT,
      type: 'content',
      selections,
      pagina: selectedPage,
      logo,
      selectedUid,
      isMobile: isMobileView,
    }),
    [selections, selectedPage, logo, selectedUid, isMobileView]
  );

  // Handshake + eventos vindos do frame.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as FromFrame | undefined;
      if (data?.source !== FRAME_CHILD) return;

      switch (data.type) {
        case 'ready':
          // Idempotente: StrictMode/HMR fazem o filho anunciar duas vezes.
          readyRef.current = true;
          post(themeMessage());
          post(contentMessage());
          break;
        case 'select':
          setSelectedUid(data.uid);
          break;
        case 'hover':
          setHoveredUid(data.uid);
          break;
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [post, themeMessage, contentMessage, setSelectedUid, setHoveredUid]);

  useEffect(() => {
    postThemeCoalesced(themeMessage());
  }, [postThemeCoalesced, themeMessage]);

  useEffect(() => {
    post(contentMessage());
  }, [post, contentMessage]);

  // Hover vindo do painel de seções → contorna a seção dentro do frame.
  useEffect(() => {
    post({ source: FRAME_PARENT, type: 'highlight', uid: hoveredUid });
  }, [post, hoveredUid]);

  // Registra o canal de "rolar até a seção" que o SectionsPanel usa. Só o
  // documento do iframe pode rolar até um elemento seu.
  useEffect(() => {
    scrollToSectionRef.current = (uid: string) =>
      post({ source: FRAME_PARENT, type: 'scroll-to', uid });
    return () => {
      scrollToSectionRef.current = null;
    };
  }, [post, scrollToSectionRef]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return (
    <div className={styles.host}>
      <iframe
        ref={iframeRef}
        src="/gerador/frame-mobile"
        title="Pré-visualização do tema"
        className={isMobileView ? styles.mobile : styles.desktop}
      />
    </div>
  );
}
