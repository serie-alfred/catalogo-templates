import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf12, { type Banner12 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner12`: o núcleo das vitrines 12, variante
 * `banner`, com o mock de lá (sem arte) por baixo do que o CS subir
 * (`useConteudoDaSecao`). O `banner` é um objeto do schema: vem inteiro.
 * `collectionId`/`collectionUrl` ficam de fora: os produtos são os do mock do núcleo.
 */
interface ShelfBanner12Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner12;
}

const MOCK: ShelfBanner12Conteudo = {
  title: 'Para a sua rotina da noite',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  banner: {
    eyebrow: 'Kit da vez',
    title: 'Kit Rotina Noturna',
    text: 'Gel de limpeza, sérum e hidratante em três passos.',
    ctaLabel: 'Conhecer o kit',
    url: '#',
    imageAlt: 'Kit Rotina Noturna',
  },
};

export default function ShelfBanner12() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf12 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner12.conteudoPadrao = MOCK;
