'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { LARGURA_LOGICA, type ZoomMode } from './useLayoutGenerator';

export interface CaixaDoFrame {
  /** Largura da viewport INTERNA do iframe. Fixa: 1440 ou 375. */
  larguraLogica: number;
  /** Altura da viewport interna. Derivada, para o `100vh` fechar (ver abaixo). */
  alturaLogica: number;
  /** O que o layout enxerga. */
  larguraVisual: number;
  alturaVisual: number;
  escala: number;
}

/**
 * Mede a coluna do canvas e devolve a caixa do frame.
 *
 * O problema que isto resolve: o iframe tinha `width: 100%`, então a viewport
 * do tema era o que sobrasse da coluna — 576px numa tela de 1440. Como 60 dos
 * 69 CSS de template têm media query abaixo de 1200px, o preview "Desktop"
 * renderizava em layout de celular. Agora a largura lógica é fixa e o excedente
 * vira escala.
 *
 * A altura é o ponto sutil. Não basta escalar: um elemento com `transform`
 * mantém a caixa ORIGINAL no layout. Se a altura lógica fosse a disponível e
 * fosse escalada, o frame ocuparia `disponivel × s` e sobraria um vão embaixo.
 * Derivando `alturaLogica = disponivel / s`, o `100vh` de um drawer dentro do
 * iframe, depois de escalado, cobre EXATAMENTE a área visível do canvas — que é
 * a invariante que o PreviewFrame protege desde que virou iframe.
 *
 * A escala é recalculada a partir do inteiro (`larguraVisual / larguraLogica`)
 * para que `alturaLogica × escala` feche sem sobra fracionária. É essa sobra de
 * 0,4px que vira barra de rolagem fantasma.
 */
export function useCanvasZoom(
  alvo: React.RefObject<HTMLElement | null>,
  { modo, mobile }: { modo: ZoomMode; mobile: boolean }
): CaixaDoFrame {
  const [caixa, setCaixa] = useState({ w: 0, h: 0 });
  const ultimo = useRef('');

  useLayoutEffect(() => {
    const el = alvo.current;
    if (!el) return;
    const medir = () => {
      // `contentRect` já exclui o padding de --ed-canvas-pad: não somar nada.
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const w = Math.floor(
        r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      );
      const h = Math.floor(
        r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      );
      // Arredondado antes do setState: tick idêntico não re-renderiza.
      const chave = `${w}x${h}`;
      if (chave === ultimo.current) return;
      ultimo.current = chave;
      setCaixa({ w, h });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [alvo]);

  const larguraLogica = mobile ? LARGURA_LOGICA.mobile : LARGURA_LOGICA.desktop;
  const disponivelW = Math.max(caixa.w, 1);
  const disponivelH = Math.max(caixa.h, 420);

  const desejada = modo === 'fit' ? disponivelW / larguraLogica : Number(modo);
  // Nunca ampliar: um tema de 1440 esticado para 1.4× não é o que a loja mostra.
  const bruta = Math.min(1, desejada);

  const larguraVisual = Math.max(1, Math.floor(larguraLogica * bruta));
  const escala = larguraVisual / larguraLogica;
  const alturaLogica = Math.round(disponivelH / escala);
  const alturaVisual = Math.floor(alturaLogica * escala);

  return { larguraLogica, alturaLogica, larguraVisual, alturaVisual, escala };
}
