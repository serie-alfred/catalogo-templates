'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { useLayout } from '@/context/LayoutContext';
import type { CaixaDoFrame } from '@/hooks/useCanvasZoom';
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
 * Bônus: trocar desktop↔mobile é só CSS no host — mesmo documento, sem reload,
 * sem perder estado de Swiper/drawer.
 *
 * A largura do frame é LÓGICA e fixa (1440 desktop, 375 mobile); o que muda com
 * o tamanho da janela é a escala. Antes ele era `width: 100%`, e o tema
 * renderizava com a largura que sobrasse da coluna: 576px numa tela de 1440.
 * Com 60 dos 69 CSS de template tendo media query abaixo de 1200, o preview
 * "Desktop" mostrava layout de celular.
 */
export default function PreviewFrame({ caixa }: { caixa: CaixaDoFrame }) {
  const {
    selections,
    selectedPage,
    selectedUid,
    selectSection,
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
    undo,
    redo,
    duplicateSection,
    removeSection,
  } = useLayout();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  /* Em refs para não recriar o listener de mensagens a cada mudança de
     histórico — ele já é reinstalado com frequência suficiente. */
  const undoRef = useRef(undo);
  undoRef.current = undo;
  const redoRef = useRef(redo);
  redoRef.current = redo;
  const duplicateRef = useRef(duplicateSection);
  duplicateRef.current = duplicateSection;
  const removeRef = useRef(removeSection);
  removeRef.current = removeSection;
  /* Lido só no handshake, para mandar a seleção inicial. Ref e não dep: entrar
     na lista do efeito faria o listener de `message` ser remontado a cada
     clique de seleção. Mesmo padrão dos refs acima. */
  const selectedUidRef = useRef(selectedUid);
  selectedUidRef.current = selectedUid;
  /* Um slot pendente POR TIPO de mensagem, drenado 1× por frame.
     Era um slot só, quando só `theme` passava por aqui. Com `content` entrando
     no mesmo rAF, um slot único faria os dois se atropelarem: a última escrita
     do quadro venceria e a outra mensagem sumiria. */
  const pendentesRef = useRef<Map<ToFrame['type'], ToFrame>>(new Map());
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Envia sem esperar o handshake. Só o `hello` usa isto. */
  const postRaw = useCallback((message: ToFrame) => {
    iframeRef.current?.contentWindow?.postMessage(
      message,
      window.location.origin
    );
  }, []);

  const post = useCallback(
    (message: ToFrame) => {
      if (!readyRef.current) return;
      postRaw(message);
    },
    [postRaw]
  );

  /**
   * Coalesce por frame, por tipo: o color picker dispara a cada movimento do
   * mouse (react-colorful escuta `mousemove` cru, sem rAF nem throttle).
   *
   * `content` PRECISA passar por aqui, e não só `theme`. Ele carrega o array
   * `selections` inteiro, e no frame isso reconcilia toda a árvore de templates
   * — medido: 12 cliques de seleção geravam 22 mensagens `content`, cada uma
   * pagando a árvore completa. Num arraste eram 60–120 por segundo, e o custo
   * escala com o número de seções da página. Era a causa do editor "travado".
   */
  const postCoalescido = useCallback(
    (message: ToFrame) => {
      pendentesRef.current.set(message.type, message);
      if (rafRef.current != null || timerRef.current != null) return;

      const drenar = () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        if (timerRef.current != null) clearTimeout(timerRef.current);
        rafRef.current = null;
        timerRef.current = null;
        const pendentes = [...pendentesRef.current.values()];
        pendentesRef.current.clear();
        pendentes.forEach(post);
      };

      /* DOIS gatilhos em corrida, e o timer NÃO é redundância defensiva: o
         browser SUSPENDE `requestAnimationFrame` quando a aba está em segundo
         plano ou escondida. Só com o rAF, a fila ficava presa e o canvas
         congelava — o preview parava de refletir qualquer edição até a aba
         voltar ao primeiro plano. Medido: zero mensagens entregues com o painel
         oculto. Quem disparar primeiro drena e cancela o outro. */
      rafRef.current = requestAnimationFrame(drenar);
      timerRef.current = setTimeout(drenar, 32);
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
      isMobile: isMobileView,
    }),
    /* `selectedUid` SAIU daqui: mudar a seleção não pode custar uma republicação
       do tema inteiro. Vai no canal `selected`, aplicado imperativamente. */
    [selections, selectedPage, logo, isMobileView]
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
          post({
            source: FRAME_PARENT,
            type: 'selected',
            uid: selectedUidRef.current,
          });
          break;
        case 'select':
          // `selectSection` e não `setSelectedUid`: clicar a seção no canvas
          // tem que expandir a linha dela na lista, igual a clicar no nome.
          // Com os dois caminhos discordando, o painel mostraria uma seção
          // selecionada e recolhida ao mesmo tempo.
          selectSection(data.uid);
          break;
        case 'hover':
          setHoveredUid(data.uid);
          break;
        case 'shortcut':
          if (data.action === 'undo') undoRef.current();
          else redoRef.current();
          break;
        case 'section-action':
          if (data.action === 'duplicate') duplicateRef.current(data.uid);
          else removeRef.current(data.uid);
          break;
      }
    };

    window.addEventListener('message', onMessage);

    // Sonda de presença. O <iframe> está no HTML servido, então o browser
    // começa a baixar o documento filho antes de o bundle do editor terminar de
    // hidratar; com bundles grandes o filho hidrata primeiro e o `ready` dele
    // cai no vazio, deixando o canvas em branco até algo remontar o iframe.
    // Enviar `hello` daqui faz o filho reanunciar. Se ele ainda não hidratou,
    // este `hello` é que se perde — e aí vale o `ready` do mount dele.
    if (!readyRef.current) {
      postRaw({ source: FRAME_PARENT, type: 'hello' });
    }

    return () => window.removeEventListener('message', onMessage);
  }, [
    post,
    postRaw,
    themeMessage,
    contentMessage,
    selectSection,
    setHoveredUid,
  ]);

  // Os badges de duplicar/remover e o rótulo de hover são criados DENTRO do
  // documento do iframe, então escalam junto com o tema: a 0,4 um badge de 24px
  // vira 9px e fica inclicável — justamente nas telas em que a escala existe.
  // O frame usa este fator para contra-escalar só a camada de controles.
  useEffect(() => {
    post({ source: FRAME_PARENT, type: 'zoom', escala: caixa.escala });
  }, [post, caixa.escala]);

  useEffect(() => {
    postCoalescido(themeMessage());
  }, [postCoalescido, themeMessage]);

  useEffect(() => {
    postCoalescido(contentMessage());
  }, [postCoalescido, contentMessage]);

  /* Canal próprio da seleção. Coalescido junto com os outros: um arraste sobre
     as seções pode trocar a seleção várias vezes no mesmo quadro. */
  useEffect(() => {
    postCoalescido({
      source: FRAME_PARENT,
      type: 'selected',
      uid: selectedUid,
    });
  }, [postCoalescido, selectedUid]);

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
      if (timerRef.current != null) clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <div className={styles.host}>
      {/* Duas caixas, de propósito. O `.stage` carrega o tamanho VISUAL — é o
          que o layout enxerga — e o `<iframe>` carrega o tamanho LÓGICO, que é
          o que o tema enxerga. Sem esse par, um `width: 1440px` cru ocuparia
          1440px de layout mesmo escalado e estouraria a coluna: `transform`
          pinta menor, não mede menor. */}
      <div
        className={styles.stage}
        style={{
          width: `${caixa.larguraVisual}px`,
          height: `${caixa.alturaVisual}px`,
        }}
      >
        <iframe
          ref={iframeRef}
          src="/gerador/frame-mobile"
          title="Pré-visualização do tema"
          className={isMobileView ? styles.mobile : styles.desktop}
          style={{
            width: `${caixa.larguraLogica}px`,
            height: `${caixa.alturaLogica}px`,
            transform: `scale(${caixa.escala})`,
          }}
        />
      </div>
    </div>
  );
}
