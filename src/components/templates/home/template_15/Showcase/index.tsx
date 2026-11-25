import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf15 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom15`: o núcleo das vitrines 15, variante `full`, com o
 * mock de lá por baixo do que o CS subir (`useConteudoDaSecao`). `collectionId`/`collectionUrl`
 * ficam fora: os produtos são o mock do núcleo.
 */

interface Showcase15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase15Conteudo = {
  eyebrow: 'Os mais desejados',
  title: 'Clássicos da',
  titleEmphasis: 'maison',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  tagLabel: 'Atelier',
};

export default function Showcase15() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf15 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase15.conteudoPadrao = MOCK;
