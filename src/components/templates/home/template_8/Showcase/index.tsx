import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf08 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom08`: o núcleo das vitrines 08, variante cheia
 * (5 por vez), com o mock de lá por baixo do que o CS subir (`useConteudoDaSecao`).
 * `tagLabel` (selo do card) e `collectionId`/`collectionUrl` ficam fora: o card é o
 * da loja e os produtos são os de exemplo do núcleo.
 */

interface Showcase08Conteudo {
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
}

const MOCK: Showcase08Conteudo = {
  title: 'LOREM IPSUM',
  subtitle: 'Lorem ipsum dolor sit amet consectetur.',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '#',
};

export default function Showcase08() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf08 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase08.conteudoPadrao = MOCK;
