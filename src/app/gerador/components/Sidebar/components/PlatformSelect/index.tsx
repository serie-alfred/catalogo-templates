'use client';

import React from 'react';
import styles from './styles.module.css';

interface PlatformSelectProps {
  /** Valor atual do select */
  value: string;
  /** Controla se mostra erro */
  showError: boolean;
  /** Callback de mudança */
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PlatformSelect({
  value,
  showError,
  onChange,
}: PlatformSelectProps) {
  return (
    <div className={styles['form-group']}>
      <label htmlFor="plataforma">Plataforma</label>
      {showError && (
        <span className={styles.errorText}>Selecione uma plataforma</span>
      )}
      <select
        className={styles.select}
        id="plataforma"
        value={value}
        onChange={onChange}
      >
        <option>Selecione uma plataforma</option>
        <option>VTEX</option>
        <option>Shopify</option>
        <option>Wake</option>
        <option>Tray</option>
      </select>
    </div>
  );
}
