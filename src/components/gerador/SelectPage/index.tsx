'use client';

import React from 'react';

import styles from './index.module.css';

interface SelectPageProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

const pages = [
  { key: 'common', name: 'Todas as páginas' },
  { key: 'home', name: 'Página Inicial' },
  { key: 'category', name: 'Página de Categoria' },
  { key: 'product', name: 'Página de Produto' },
];

export default function SelectPage({
  selectedPage,
  setSelectedPage,
}: SelectPageProps) {
  return (
    <div className={styles.tabs} id="pages-tabs">
      {pages.map(pages => (
        <button
          key={pages.key}
          onClick={() => setSelectedPage(pages.key)}
          className={selectedPage === pages.key ? styles.active : ''}
        >
          {pages.name}
        </button>
      ))}
    </div>
  );
}
