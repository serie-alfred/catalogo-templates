import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf16, { type Banner16 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner16`: o núcleo das vitrines 16, variante `banner`, com o
 * mock de lá (sem arte: vale o placeholder; sem rótulo nos cards; sem "Ver todos", o botão do
 * banner faz esse papel) por baixo do que o CS subir (`useConteudoDaSecao`). O `banner` é um
 * objeto do schema: vem inteiro. `collectionId`/`collectionUrl` ficam fora: viram a coleção da
 * loja na fase de produtos; até lá, os produtos são o mock do núcleo.
 */

interface ShelfBanner16Conteudo {
  title?: string;
  tagLabel?: string;
  banner?: Banner16;
}

const MOCK: ShelfBanner16Conteudo = {
  title: 'Pequenos leitores',
  banner: {
    title: 'Histórias pra ler juntinho',
    text: 'Livros cartonados, de banho e de pano para os primeiros anos.',
    ctaLabel: 'Ver livros',
    url: '#',
    imageAlt: 'Histórias pra ler juntinho',
  },
};

export default function ShelfBanner16() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf16 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner16.conteudoPadrao = MOCK;
