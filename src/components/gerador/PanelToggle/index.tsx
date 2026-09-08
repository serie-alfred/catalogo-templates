'use client';

import React from 'react';

import { CaretDown } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Recolhe/expande um painel lateral.
 *
 * As colunas fixas comem 840px; num monitor de 1440 sobram 536 para o canvas,
 * abaixo da trava de 1200px de `.component__container` — o preview "Desktop"
 * cairia no tier de tablet. Recolhendo os dois, 1440 devolve ~1364.
 *
 * O Figma só desenha o estado expandido, então o handle é INVISÍVEL em repouso:
 * fica sobre a borda entre o painel e o canvas e só aparece no hover ou no
 * foco. Assim o estado padrão da tela continua idêntico ao design. Quando o
 * painel está recolhido ele fica sempre visível — é a única forma de trazê-lo
 * de volta, e é um estado que o Figma não define.
 */
export default function PanelToggle({
  side,
  collapsed,
  onToggle,
}: {
  side: 'left' | 'right';
  collapsed: boolean;
  onToggle: () => void;
}) {
  const label = collapsed
    ? `Expandir painel ${side === 'left' ? 'esquerdo' : 'direito'}`
    : `Recolher painel ${side === 'left' ? 'esquerdo' : 'direito'}`;

  return (
    <button
      type="button"
      className={styles.toggle}
      data-side={side}
      data-collapsed={collapsed ? 'true' : undefined}
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <CaretDown width={20} height={20} />
    </button>
  );
}
