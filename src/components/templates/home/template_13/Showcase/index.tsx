import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf13 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom13`: o núcleo das vitrines 13, variante `full`, com o
 * mock de lá por baixo do que o CS subir (`useConteudoDaSecao`). `collectionId`/`collectionUrl`
 * do schema viram a coleção da loja na fase de produtos; até lá, os produtos são o mock do núcleo.
 */

/** O conteúdo da seção: os campos do `section.schema` do Showcase13. */
interface Showcase13Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase13Conteudo = {
  title: 'Mais vendidos',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  tagLabel: 'Drop 07',
};

export default function Showcase13() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf13 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase13.conteudoPadrao = MOCK;
