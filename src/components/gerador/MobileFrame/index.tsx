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
 * Visão mobile do editor: o tema renderizado dentro de um iframe de 375px.
 *
 * Por que iframe e não um div de 375px: os drawers e o mini-cart mobile dos
 * Headers são `position: fixed`. Num div do documento do editor eles se
 * ancoram na JANELA e cobrem tudo, painel e dock incluídos. A saída óbvia
 * (`contain` no wrapper) é justamente o que os Headers documentam que quebra
 * `fixed`. Dentro do iframe o viewport é real e `fixed`/`100dvh` resolvem
 * contra os 375px.
 *
 * O iframe fica MONTADO mesmo escondido: remontar custaria o reload do
 * documento e o refetch das fontes a cada toggle desktop/mobile, e perderia o
 * estado dos Swipers e drawers.
 */
interface MobileFrameProps {
  /** Escondido (não desmontado) quando o editor está em desktop. */
  hidden: boolean;
}

export default function MobileFrame({ hidden }: MobileFrameProps) {
  const {
    selections,
    selectedPage,
    selectedUid,
    setSelectedUid,
    hoveredUid,
    setHoveredUid,
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
  const postThemeCoalesced = useCallback((message: ToFrame) => {
    pendingThemeRef.current = message;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const pending = pendingThemeRef.current;
      pendingThemeRef.current = null;
      if (pending) post(pending);
    });
  }, [post]);

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
    }),
    [selections, selectedPage, logo, selectedUid]
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

  // Hover vindo do painel → contorna a seção dentro do frame.
  useEffect(() => {
    post({ source: FRAME_PARENT, type: 'highlight', uid: hoveredUid });
  }, [post, hoveredUid]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return (
    <div className={styles.host} hidden={hidden}>
      <iframe
        ref={iframeRef}
        src="/gerador/frame-mobile"
        title="Pré-visualização mobile"
        className={styles.frame}
      />
    </div>
  );
}
