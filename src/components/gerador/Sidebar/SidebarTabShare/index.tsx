'use client';

import React, { useState } from 'react';
import { iconsGenerator } from '@/assets/icons/generator';
import styles from './index.module.css';

export default function SidebarTabShare() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const link = 'https://www.e-temas.com.br/gerador/seunegocio';
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Oculta a mensagem após 2 segundos
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className="sidebar__main">
      <div className="header">
        <div className="icon">{iconsGenerator.shareTheme}</div>
      </div>

      <div className="field">
        <label htmlFor="user-share">Compartilhe</label>
        <input
          type="text"
          id="user-share"
          value="https://www.e-temas.com.br/gerador/seunegocio"
          readOnly
          onClick={handleCopy}
          style={{ cursor: 'pointer' }}
        />
        {copied && (
          <span className={styles.warning}>Seu link foi copiado!</span>
        )}
      </div>
    </div>
  );
}
