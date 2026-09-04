'use client';

import React from 'react';

import PreviewFrame from '../PreviewFrame';

import styles from './index.module.css';

/**
 * Área do canvas. Hoje é só o contêiner do <iframe> que renderiza o tema
 * (PreviewFrame) — as duas visões, desktop e mobile, são o mesmo iframe com
 * larguras diferentes.
 *
 * Não é mais um scrollport: quem rola é o documento DENTRO do iframe, que é o
 * que faz o header `position: sticky` e os drawers `position: fixed` se
 * comportarem como na loja publicada.
 *
 * O palco off-screen do export não mora aqui (é irmão desta <main>, em
 * page.tsx): `position: relative` + `overflow` a tornariam containing block do
 * palco e o recortariam.
 */
export default function PreviewArea() {
  return (
    <main className={styles['preview-area']}>
      <PreviewFrame />
    </main>
  );
}
