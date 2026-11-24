import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf09 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom09`: o núcleo das vitrines 09, variante
 * `full`, com o mock de lá por baixo do que o CS subir (`useConteudoDaSecao`).
 * `collectionId`/`collectionUrl` do schema viram a coleção da loja na fase de
 * produtos; até lá, os produtos são o mock do núcleo.
 */

interface Showcase09Conteudo {
  title?: string;
  titleEmphasis?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase09Conteudo = {
  title: 'Mais',
  titleEmphasis: 'desejados',
  subtitle: 'As peças que mais saíram nas últimas semanas.',
  viewAllLabel: 'Ver tudo',
  viewAllUrl: '#',
};

export default function Showcase09() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf09 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase09.conteudoPadrao = MOCK;
