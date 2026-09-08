'use client';

import React from 'react';
import { MonitorStop, Smartphone } from 'lucide-react';

import styles from './index.module.css';

interface ResponsiveToggleProps {
  onToggleMobile: () => void;
  isMobile: boolean;
}

/**
 * Alterna a visão do PREVIEW entre desktop e mobile — não tem relação com o
 * tamanho da janela do editor, que é desktop-only.
 *
 * Cada botão tem o próprio onClick e só dispara quando muda de fato. Antes o
 * handler estava no wrapper, então clicar no item JÁ ativo alternava a visão.
 */
export default function ResponsiveToggle({
  onToggleMobile,
  isMobile,
}: ResponsiveToggleProps) {
  return (
    <div className={styles.group} role="group" aria-label="Visão do preview">
      <button
        type="button"
        className={styles.option}
        aria-pressed={!isMobile}
        onClick={() => isMobile && onToggleMobile()}
      >
        <MonitorStop size={18} />
        <span>Desktop</span>
      </button>
      <button
        type="button"
        className={styles.option}
        aria-pressed={isMobile}
        onClick={() => !isMobile && onToggleMobile()}
      >
        <Smartphone size={18} />
        <span>Mobile</span>
      </button>
    </div>
  );
}
