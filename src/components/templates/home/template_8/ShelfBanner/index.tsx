import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf08, { type Banner08 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner08`: o núcleo das vitrines 08 com o banner ao
 * lado (3 por vez), com o mock de lá por baixo do que o CS subir
 * (`useConteudoDaSecao`). O `banner` é um objeto do schema: vem inteiro.
 * `tagLabel` e `collectionId`/`collectionUrl` ficam fora (ver Showcase08).
 */

const IMG = '/gerador/familia08';

interface ShelfBanner08Conteudo {
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  banner?: Banner08;
}

const MOCK: ShelfBanner08Conteudo = {
  title: 'LOREM IPSUM',
  subtitle: 'Lorem ipsum dolor sit amet consectetur.',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  banner: {
    desktop: `${IMG}/ph-card.png`,
    mobile: `${IMG}/ph-square.png`,
    alt: '',
    url: '#',
  },
};

export default function ShelfBanner08() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf08 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner08.conteudoPadrao = MOCK;
