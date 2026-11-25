import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf11, { type Banner11 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner11`: o núcleo das vitrines 11, variante
 * `banner`, com o mock de lá (sem arte) por baixo do que o CS subir
 * (`useConteudoDaSecao`). O `banner` é um objeto do schema: vem inteiro.
 * `collectionId`/`collectionUrl` do schema viram a coleção da loja na fase de
 * produtos; até lá, os produtos são o mock do núcleo.
 */

interface ShelfBanner11Conteudo {
  sectionNumber?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner11;
}

const MOCK: ShelfBanner11Conteudo = {
  sectionNumber: '04',
  title: 'Escritório',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  banner: {
    eyebrow: '[Ambiente]',
    title: 'Escritório em aço e freijó.',
    ctaLabel: 'Ver o ambiente',
    url: '#',
    imageAlt: 'Escritório em aço e freijó',
  },
};

export default function ShelfBanner11() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf11 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner11.conteudoPadrao = MOCK;
