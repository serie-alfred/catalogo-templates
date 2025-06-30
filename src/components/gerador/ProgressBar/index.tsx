'use client';

import React from 'react';

import styles from './index.module.css';

interface ProgressBarProps {
  /** Quantas seções já foram selecionadas */
  current: number;
  /** Total de seções possível */
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  return (
    <div className={styles.progresso}>
      <p>
        <strong id="progress-count">{current}</strong> de
        <span id="progress-total"> {total}</span> seções selecionadas
      </p>
      <div className={styles.barra}>
        <div
          className={styles.preenchida}
          id="progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
