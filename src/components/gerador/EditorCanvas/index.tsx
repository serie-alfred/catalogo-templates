'use client';

import React, { useRef } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { useCanvasZoom } from '@/hooks/useCanvasZoom';

import CanvasZoom from '../CanvasZoom';
import PreviewFrame from '../PreviewFrame';

import styles from './index.module.css';

/**
 * Célula do canvas. Substitui a antiga PreviewArea, que existia só para abrir
 * espaço sob a dock flutuante.
 *
 * Não é scrollport no eixo vertical: quem rola é o documento DENTRO do iframe —
 * é o que faz o header `sticky` e os drawers `fixed` se comportarem como na
 * loja publicada. No eixo horizontal ele PODE rolar, e só acima do `fit`:
 * escolher 100% numa tela estreita mostra o tema em tamanho real e deixa
 * panoramar.
 *
 * A altura do iframe vem do grid (linha `minmax(0, 1fr)` de um shell de
 * `100dvh`), nunca do conteúdo. Um iframe de altura automática faria `vh` e
 * `fixed` resolverem contra a altura total da página — o bug original.
 *
 * É aqui que a largura útil é medida, porque é aqui que o padding mora. O
 * `useCanvasZoom` transforma essa medida na caixa do frame.
 */
export default function EditorCanvas() {
  const { isMobileView, zoomMode } = useLayout();
  const ref = useRef<HTMLElement | null>(null);
  const caixa = useCanvasZoom(ref, { modo: zoomMode, mobile: isMobileView });

  return (
    <main className={styles.canvas} ref={ref}>
      <PreviewFrame caixa={caixa} />
      <CanvasZoom escala={caixa.escala} />
    </main>
  );
}
