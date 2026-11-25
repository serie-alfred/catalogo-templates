import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf15, { type Banner15 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner15`: o núcleo das vitrines 15, variante `banner`, com o
 * mock de lá (sem arte: vale o escuro de placeholder; sem rótulo nos cards; sem "Ver todos",
 * o link do banner faz esse papel) por baixo do que o CS subir (`useConteudoDaSecao`). O
 * `banner` é um objeto do schema: vem inteiro. `collectionId`/`collectionUrl` ficam fora: os
 * produtos são o mock do núcleo.
 */

interface ShelfBanner15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  tagLabel?: string;
  banner?: Banner15;
}

const MOCK: ShelfBanner15Conteudo = {
  eyebrow: 'Perfumaria',
  title: 'A arte da',
  titleEmphasis: 'fragrância',
  banner: {
    eyebrow: 'Ambre Nuit',
    title: 'Âmbar, baunilha e',
    titleEmphasis: 'madeiras raras',
    text: 'Uma assinatura olfativa para as noites que pedem presença.',
    ctaLabel: 'Ver a linha',
    url: '#',
    imageAlt: 'Ambre Nuit',
  },
};

export default function ShelfBanner15() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf15 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner15.conteudoPadrao = MOCK;
