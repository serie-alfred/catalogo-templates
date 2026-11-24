import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf09, { type Banner09 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner09`: o núcleo das vitrines 09, variante
 * `banner`, com o mock de lá (sem arte) por baixo do que o CS subir
 * (`useConteudoDaSecao`). O `banner` é um objeto do schema: vem inteiro.
 */

interface ShelfBanner09Conteudo {
  title?: string;
  titleEmphasis?: string;
  tagLabel?: string;
  banner?: Banner09;
}

const MOCK: ShelfBanner09Conteudo = {
  title: 'O look em',
  titleEmphasis: 'peças',
  banner: {
    eyebrow: 'Look 04',
    title: 'Compre o',
    titleEmphasis: 'look',
    ctaLabel: 'Ver o look completo',
    url: '#',
    imageAlt: 'Compre o look',
  },
};

export default function ShelfBanner09() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf09 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner09.conteudoPadrao = MOCK;
