'use client';

import React from 'react';

import styles from './index.module.css';
import { PLATFORMS, type Platform } from '@/types/platform';

interface PlatformSelectProps {
  value: Platform | '' | null;
  showError: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PlatformSelect({
  value,
  showError,
  onChange,
}: PlatformSelectProps) {
  return (
    <div className={styles['form-group']}>
      <div className="field">
        <label htmlFor="plataforma">Plataforma</label>
        {showError && (
          <span className={styles.errorText}>Selecione uma plataforma</span>
        )}
        <select
          className={styles.select}
          id="plataforma"
          value={value ?? ''}
          onChange={onChange}
        >
          <option value="">Selecione uma plataforma</option>
          {PLATFORMS.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
