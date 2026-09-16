'use client';

import React from 'react';

import ComponentVariablesPanel from '../ComponentVariablesPanel';

import styles from './index.module.css';

/**
 * Painel direito: as variáveis da seção em edição, e só isso.
 *
 * O cabeçalho com "Pré-visualizar" e o botão de export foi para a EditorTopbar,
 * que passou a atravessar esta coluna — na tela os botões não mudaram de lugar.
 * O motivo é de dimensionamento: 273px de botões cravavam um piso de 320px num
 * painel cujo conteúdo mais largo (a linha do ColorPicker) cabe em ~201, e o
 * canvas pagava a diferença.
 */
export default function EditorRightPanel({
  className,
  inert,
}: {
  className?: string;
  /** Recolhido: fica no DOM (para a transição ter o que animar) mas fora do
      alcance de Tab e dos leitores de tela. */
  inert?: boolean;
}) {
  return (
    <aside
      className={`${styles.panel} ${className ?? ''}`}
      aria-label="Propriedades"
      inert={inert}
    >
      <div className={`${styles.body} ed-scroll`}>
        <ComponentVariablesPanel />
      </div>
    </aside>
  );
}
