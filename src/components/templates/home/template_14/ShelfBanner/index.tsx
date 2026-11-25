import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf14, { type Banner14 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner14`: o núcleo das vitrines 14, variante `banner`, com o
 * mock de lá (sem arte: vale o placeholder; sem rótulo nos cards; sem "Ver todos", o link do
 * banner faz esse papel) por baixo do que o CS subir (`useConteudoDaSecao`). O `banner` é um
 * objeto do schema: vem inteiro.
 */

interface ShelfBanner14Conteudo {
  title?: string;
  tagLabel?: string;
  banner?: Banner14;
}

const MOCK: ShelfBanner14Conteudo = {
  title: 'Monte seu kit de treino',
  banner: {
    eyebrow: 'Guia de treino',
    title: 'Kit academia completo',
    text: 'Proteína, hidratação e mochila para o pós-treino.',
    ctaLabel: 'Ver o kit',
    url: '#',
    imageAlt: 'Kit academia completo',
  },
};

export default function ShelfBanner14() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf14 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner14.conteudoPadrao = MOCK;
