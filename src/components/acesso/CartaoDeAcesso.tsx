import React from 'react';
import Logo from '@/components/common/Logo';

import styles from './acesso.module.css';

/**
 * A casca das telas de acesso (/login e /auth/*): o fundo escuro da marca, o
 * cartão e o selo "Editor de temas". O conteúdo é de cada tela.
 */
export default function CartaoDeAcesso({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Logo tamanho={24} />
          <span className={styles.badge}>Editor de temas</span>
        </div>
        {children}
      </div>
    </main>
  );
}
