import React from 'react';

import styles from './index.module.css';

interface PontinhosProps {
  /** O que está carregando, para leitor de tela ("Carregando os temas salvos"). */
  rotulo?: string;
  className?: string;
}

/**
 * Carregamento do editor: três pontos que sobem e descem em onda. Ocupa o lugar
 * de um "Carregando…" escrito. A cor é a do texto em volta (`currentColor`), e
 * com movimento reduzido os pontos só pulsam de opacidade.
 */
export default function Pontinhos({
  rotulo = 'Carregando',
  className,
}: PontinhosProps) {
  return (
    <span
      className={`${styles.pontinhos}${className ? ` ${className}` : ''}`}
      role="status"
      aria-label={rotulo}
    >
      <span />
      <span />
      <span />
    </span>
  );
}
