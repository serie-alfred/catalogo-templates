import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf10 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom10`: o núcleo das vitrines 10, variante
 * `full`, com o mock de lá por baixo do que o CS subir (`useConteudoDaSecao`).
 * `collectionId`/`collectionUrl` do schema viram a coleção da loja na fase de
 * produtos; até lá, os produtos são o mock do núcleo.
 */

/** O conteúdo da seção: os campos do `section.schema` do ProductShelfCustom10. */
interface Showcase10Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
}

const MOCK: Showcase10Conteudo = {
  title: 'Ofertas do dia',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '#',
};

export default function Showcase10() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf10 variant="full" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase10.conteudoPadrao = MOCK;
