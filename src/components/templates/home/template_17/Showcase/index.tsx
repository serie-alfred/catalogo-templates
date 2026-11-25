import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf17 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom17`: o núcleo das vitrines 17, variante `full`, com o
 * mock de lá (sem rótulo fixo nos cards: o desenho só mostra o -N%) por baixo do que o CS subir
 * (`useConteudoDaSecao`). `collectionId`/`collectionUrl` do schema viram a coleção da loja na fase
 * de produtos; até lá, os produtos são o mock do núcleo.
 */

interface Showcase17Conteudo {
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase17Conteudo = {
  title: 'Os mais pedidos da semana',
  subtitle: 'O que os tutores mais colocaram na sacola nos últimos dias.',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
};

export default function Showcase17() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf17 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase17.conteudoPadrao = MOCK;
