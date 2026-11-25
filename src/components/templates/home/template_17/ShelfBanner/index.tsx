import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf17, { type Banner17 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner17`: o núcleo das vitrines 17, variante `banner`, com o
 * mock de lá (sem arte: vale o recorte neutro; sem rótulo nos cards; sem "Ver todos", o botão do
 * banner faz esse papel; o título usa a cor do texto, sem `showcaseTitleColor`) por baixo do que o
 * CS subir (`useConteudoDaSecao`). O `banner` é um objeto do schema: vem inteiro.
 */

interface ShelfBanner17Conteudo {
  title?: string;
  tagLabel?: string;
  banner?: Banner17;
}

const MOCK: ShelfBanner17Conteudo = {
  title: 'Cantinho dos gatos',
  banner: {
    eyebrow: 'Gatos',
    title: 'Tudo para o gato que manda na casa',
    text: 'Arranhadores, areias, fontes e ração para cada fase.',
    ctaLabel: 'Ver tudo para gatos',
    url: '#',
    imageAlt: 'Tudo para o gato que manda na casa',
  },
};

export default function ShelfBanner17() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf17 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner17.conteudoPadrao = MOCK;
