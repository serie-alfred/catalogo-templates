import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf12 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom12`: o núcleo das vitrines 12, variante
 * `full`, com o mock de lá por baixo do que o CS subir (`useConteudoDaSecao`).
 * `collectionId`/`collectionUrl` ficam de fora: os produtos são os do mock do núcleo.
 */
interface Showcase12Conteudo {
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase12Conteudo = {
  title: 'Queridinhos da semana',
  subtitle: 'Os produtos que mais entraram nas rotinas de quem compra aqui.',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
};

export default function Showcase12() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf12 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase12.conteudoPadrao = MOCK;
