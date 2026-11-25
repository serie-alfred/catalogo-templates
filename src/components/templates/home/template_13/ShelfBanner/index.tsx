import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import ProductShelf13, { type Banner13 } from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner13`: o núcleo das vitrines 13, variante `banner`, com o
 * mock de lá (sem arte: vale o grafite de placeholder; rótulo "Novo" nos cards; sem "Ver todos",
 * o CTA do banner faz esse papel) por baixo do que o CS subir (`useConteudoDaSecao`). O `banner`
 * é um objeto do schema: vem inteiro. `collectionId`/`collectionUrl` do schema viram a coleção
 * da loja na fase de produtos; até lá, os produtos são o mock do núcleo.
 */

/** O conteúdo da seção: os campos do `section.schema` do ShelfBanner13. */
interface ShelfBanner13Conteudo {
  title?: string;
  tagLabel?: string;
  banner?: Banner13;
}

const MOCK: ShelfBanner13Conteudo = {
  title: 'Essenciais do drop',
  tagLabel: 'Novo',
  banner: {
    eyebrow: 'Drop 07',
    title: 'Feito pra rodar à noite',
    text: 'Refletivos 360°, nylon que corta o vento e bolsos que fecham.',
    ctaLabel: 'Ver tudo',
    url: '#',
    imageAlt: 'Feito pra rodar à noite',
  },
};

export default function ShelfBanner13() {
  const c = useConteudoDaSecao(MOCK);
  return <ProductShelf13 variant="banner" styles={styles} {...c} />;
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ShelfBanner13.conteudoPadrao = MOCK;
