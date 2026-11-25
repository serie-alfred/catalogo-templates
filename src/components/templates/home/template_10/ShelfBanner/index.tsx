import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf10, { type Banner10 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner10`: o núcleo das vitrines 10, variante
 * `banner`, com o mock de lá (sem arte) por baixo do que o CS subir
 * (`useConteudoDaSecao`). O `banner` é um objeto do schema: vem inteiro.
 * `collectionId`/`collectionUrl` do schema viram a coleção da loja na fase de
 * produtos; até lá, os produtos são o mock do núcleo.
 */

/** O conteúdo da seção: os campos do `section.schema` do ProductShelfBanner10. */
interface ShelfBanner10Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner10;
}

const MOCK: ShelfBanner10Conteudo = {
  title: 'Seleção da semana',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  banner: {
    eyebrow: 'Só esta semana',
    title: 'Semana [Sua Marca]',
    text: 'Até 50% OFF em áudio, vídeo e acessórios.',
    ctaLabel: 'Ver tudo',
    url: '#',
    imageAlt: 'Semana [Sua Marca]',
  },
};

export default function ShelfBanner10() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf10 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner10.conteudoPadrao = MOCK;
