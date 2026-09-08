'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import PreviewButton from '../PreviewButton';
import ComponentVariablesPanel from '../ComponentVariablesPanel';
import { ArrowDown } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Painel direito: cabeçalho fixo com Pré-visualizar e Baixar, e abaixo as
 * variáveis da seção em edição.
 *
 * O cabeçalho aparece sempre — inclusive quando nenhuma seção está selecionada
 * e o corpo está vazio.
 */
export default function EditorRightPanel() {
  const { exportLayout } = useLayout();

  return (
    <aside className={styles.panel} aria-label="Propriedades">
      <header className={styles.header}>
        <PreviewButton />
        <button
          type="button"
          className={styles.download}
          onClick={exportLayout}
        >
          Baixar
          <ArrowDown width={20} height={20} />
        </button>
      </header>

      <div className={`${styles.body} ed-scroll`}>
        <ComponentVariablesPanel />
      </div>
    </aside>
  );
}
