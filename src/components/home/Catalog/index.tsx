'use client';

import React, { useEffect, useRef, useState } from 'react';

import { icons } from '../../../assets/icons/icons';

import Spot from '../Spot';

import type { CatalogItem } from '@/types/catalog';

import styles from './index.module.css';

/** Todos os templates completos, com busca pelo nome e pelas fontes. */
export default function CatalogSpots({ items }: { items: CatalogItem[] }) {
  const [search, setSearch] = useState('');
  const raizRef = useRef<HTMLDivElement>(null);

  // O "Templates" da vitrine volta para `/#templates`. O navegador rola até a
  // âncora ANTES de o carrossel de "Novos", logo acima, hidratar — e ele encolhe
  // a página em ~680px (medido), deixando a rolagem lá embaixo, no formulário.
  // Este efeito roda depois do do Swiper (irmão anterior), então acerta.
  useEffect(() => {
    if (window.location.hash !== '#templates') return;
    requestAnimationFrame(() => raizRef.current?.scrollIntoView());
  }, []);

  const termo = search.toLowerCase();
  const filteredCatalog: CatalogItem[] = items.filter(item =>
    `${item.title} ${item.subtitle}`.toLowerCase().includes(termo)
  );

  return (
    <div
      ref={raizRef}
      className={styles.catalogoContainer}
      id="templates"
      data-home-catalogo=""
    >
      <div className={styles.container}>
        <div className={styles.infoTitle}>
          <h3>Descubra diversos templates</h3>
          <span>
            Cada template monta a loja inteira: home, categoria e produto.
            Clique para visualizar.
          </span>
        </div>

        <div className={styles.search}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Buscar modelo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {icons.MagnifierIcon}
          </div>
          <span>{filteredCatalog.length} templates</span>
        </div>

        <div className={styles.containerSpots}>
          {filteredCatalog.map(item => (
            <Spot key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
