import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf16 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom16`: o núcleo das vitrines 16, variante `full`, com o mock
 * de lá por baixo do que o CS subir (`useConteudoDaSecao`). `collectionId`/`collectionUrl` do
 * schema viram a coleção da loja na fase de produtos; até lá, os produtos são o mock do núcleo.
 */

interface Showcase16Conteudo {
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase16Conteudo = {
  title: 'Os queridinhos da criançada',
  subtitle: 'Os brinquedos e roupinhas que mais saíram este mês.',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
  tagLabel: 'Mais amado',
};

export default function Showcase16() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf16 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase16.conteudoPadrao = MOCK;
