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
 * O Figma não desenha este controle. Ele já foi INVISÍVEL em repouso por isso,
 * e a decisão se provou errada: o usuário nunca o encontrou, e o funil ficava
 * verde porque clicava por DOM, sem hit-test nem opacidade. Controle invisível
 * é controle que não existe.
 *
 * Agora ele é discreto e visível, contido nos 32px de `--ed-canvas-pad` — o
 * único lugar da tela onde o Figma só pinta fundo. O delta em relação ao design
 * está ratificado em `scripts/funil/figma/README.md`, e o estágio 2a reprova se
 * ele escorregar para cima do painel ou do storefront.
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
      aria-expanded={!collapsed}
      aria-label={label}
      title={label}
    >
      <CaretDown width={20} height={20} />
    </button>
  );
}
