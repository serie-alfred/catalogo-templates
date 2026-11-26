import React from 'react';

import Spot07 from '@/components/templates/common/template_7/Spot';
import CardDaLoja from '@/components/templates/CardDaLoja';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 07 do faststore.starter: a moldura da seção NATIVA
 * `CrossSellingShelf` que o override `overrides/CrossSellingShelf07` pele
 * (`section > h2 + [data-fs-product-shelf]`), com a grade `RelatedGrid07` dentro. Era o
 * fim do ProductInfo07, com card próprio; virou peça própria, como o ProductRelated01.
 *
 * O card é o DA LOJA (`CardDaLoja`): o spot escolhido no gerador, com as variáveis dele.
 * Sem spot escolhido, o card da família (Spot07) — o mesmo que o starter injeta e que o
 * generator troca pelo card do cliente. A lista nunca desenha card próprio. As classes
 * globais do core (`section`, `text__title-section`…) ficam como no DOM nativo.
 */
const SLOTS = ['r1', 'r2', 'r3', 'r4'];

export default function ProductRelated07() {
  // Os da loja, menos o primeiro (é ele que a PDP mostra), quando há mais de um.
  const daLoja = useProdutosDaLoja();
  const daPdp = daLoja && daLoja.length > 1 ? daLoja.slice(1) : daLoja;
  const itens = daPdp
    ? daPdp.map(produto => ({ id: produto.id, produto }))
    : SLOTS.map(id => ({ id, produto: undefined }));
  return (
    /* envelope só do catálogo: carrega o container-type das @container */
    <div className={styles.crossSellingShelf07Box}>
      <section className={`section section-product-shelf layout__section ${styles.crossSellingShelf07}`}>
        <h2 className="text__title-section layout__content" data-role="related-title">
          Produtos relacionados
        </h2>
        <div data-fs-product-shelf>
          <a className={styles.more} href="#relacionados">
            Ver mais →
          </a>
          <ul className={styles.grid} data-role="related-grid">
            {itens.map(({ id, produto }) => (
              <li key={id} className={styles.slot}>
                <CardDaLoja familia="Spot07" produto={produto}>
                  <Spot07 soCard produto={produto} />
                </CardDaLoja>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
