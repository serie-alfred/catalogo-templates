'use client';

import React from 'react';

import styles from './index.module.css';

interface SelectPageProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

const PAGINAS = [
  { key: 'home', name: 'Home' },
  { key: 'pdp', name: 'PDP' },
  { key: 'plp', name: 'PLP' },
];

export default function SelectPage({
  selectedPage,
  setSelectedPage,
}: SelectPageProps) {
  return (
    <div className={styles.tabs} id="pagina-tabs">
      {PAGINAS.map(pagina => (
        <button
          key={pagina.key}
          onClick={() => setSelectedPage(pagina.key)}
          className={selectedPage === pagina.key ? styles.active : ''}
        >
          {pagina.name}
        </button>
      ))}
    </div>
  );
}
