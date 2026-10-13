'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import { slugDaLp } from '@/utils/lp';

import styles from './index.module.css';

/**
 * No modo LP a topbar troca o seletor de página pelo NOME da LP: o canvas
 * mostra uma página só, e o nome é o que vira o slug da URL (`/black-friday`)
 * no config — mostrado ao lado, para o usuário ver o endereço que vai sair.
 */
export default function LpNameField() {
  const { lp, setLpNome } = useLayout();
  return (
    <label className={styles.root} data-lp-nome="">
      <span className={styles.rotulo}>LP</span>
      <input
        className={styles.input}
        value={lp.nome}
        onChange={e => setLpNome(e.target.value)}
        onBlur={e => !e.target.value.trim() && setLpNome('Landing page')}
        aria-label="Nome da landing page"
        maxLength={60}
        spellCheck={false}
      />
      <span className={styles.slug} title="Endereço da LP na loja">
        /{slugDaLp(lp.nome)}
      </span>
    </label>
  );
}
