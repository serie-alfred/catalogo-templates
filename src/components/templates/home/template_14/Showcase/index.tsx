import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf14 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom14`: o núcleo das vitrines 14, variante `full`, com o
 * mock de lá por baixo do que o CS subir (`useConteudoDaSecao`). `collectionId`/`collectionUrl`
 * do schema viram a coleção da loja na fase de produtos; até lá, os produtos são o mock do
 * núcleo.
 */

interface Showcase14Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase14Conteudo = {
  title: 'Mais vendidos da semana',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  tagLabel: 'Top da semana',
};

export default function Showcase14() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf14 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase14.conteudoPadrao = MOCK;
