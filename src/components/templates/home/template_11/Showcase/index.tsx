import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf11 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom11`: o núcleo das vitrines 11, variante
 * `full`, com o mock de lá por baixo do que o CS subir (`useConteudoDaSecao`).
 * `collectionId`/`collectionUrl` do schema viram a coleção da loja na fase de
 * produtos; até lá, os produtos são o mock do núcleo.
 */

interface Showcase11Conteudo {
  sectionNumber?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  subtitle?: string;
  tagLabel?: string;
}

const MOCK: Showcase11Conteudo = {
  sectionNumber: '02',
  title: 'Novidades',
  subtitle: 'Peças que chegaram este mês',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
};

export default function Showcase11() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf11 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase11.conteudoPadrao = MOCK;
