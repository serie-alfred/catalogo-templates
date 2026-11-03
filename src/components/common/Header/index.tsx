import React from 'react';
import Link from 'next/link';

import Logo from '@/components/common/Logo';
import LinkComercial from '@/components/site/LinkComercial';
import { comerciais } from '@/lib/comercial';

import styles from './index.module.css';

export default function Header() {
  const whatsapp = comerciais().length > 0;
  return (
    <header className={styles.header}>
      <nav aria-label="Principal" className={styles.nav}>
        <Link
          href="/"
          aria-label="e-temas, página inicial"
          className={styles.marca}
        >
          <Logo />
        </Link>
        <div className={styles.links}>
          <a href="/#templates">Templates</a>
          <a href="/#como-funciona">Como funciona</a>
          <a href="/#quem-faz">Quem faz</a>
        </div>
        <LinkComercial
          whatsapp={whatsapp}
          origem="header"
          className={styles.cta}
        >
          Falar com o comercial
        </LinkComercial>
      </nav>
    </header>
  );
}
