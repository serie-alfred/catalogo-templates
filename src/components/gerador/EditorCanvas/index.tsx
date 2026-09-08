'use client';

import React from 'react';

import PreviewFrame from '../PreviewFrame';

import styles from './index.module.css';

/**
 * Célula do canvas. Substitui a antiga PreviewArea, que existia só para abrir
 * espaço sob a dock flutuante.
 *
 * Não é scrollport: quem rola é o documento DENTRO do iframe — é o que faz o
 * header `sticky` e os drawers `fixed` se comportarem como na loja publicada.
 *
 * A altura do iframe vem do grid (linha `minmax(0, 1fr)` de um shell de
 * `100dvh`), nunca do conteúdo. Um iframe de altura automática faria `vh` e
 * `fixed` resolverem contra a altura total da página — o bug original.
 */
export default function EditorCanvas() {
  return (
    <main className={styles.canvas}>
      <PreviewFrame />
    </main>
  );
}
