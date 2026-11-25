'use client';

import React, { useState } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/TrustvoxReviews06` do faststore.starter — o bloco de
 * avaliações da PDP 06: um acordeão cujo painel hospeda o widget do Trustvox.
 *
 * O interior é de terceiro: quem desenha as estrelas, as notas e os comentários
 * é o script do Trustvox, que monta dentro de `#trustvox-reviews`. O que este
 * componente desenha — e o que o cliente edita — é a MOLDURA: o título, o sinal
 * de abrir/fechar, o fundo do cartão e o espaço reservado ao widget. Fabricar
 * avaliação de exemplo aqui seria inventar dado de comércio, então o host fica
 * vazio, como na origem sem o script.
 *
 * O acordeão da origem vem do `@faststore/ui`; aqui ele é reescrito com os
 * mesmos atributos `data-fs-*`, porque é neles que o CSS se apoia.
 *
 * Do CS vêm o título e se o painel nasce aberto (`title`, `startExpanded`, nomes
 * do `section.schema`); a moldura do widget segue a de exemplo.
 */
interface ProductReviewsConteudo {
  title?: string;
  startExpanded?: boolean;
}

const MOCK: ProductReviewsConteudo = {
  title: 'Avaliações e comentários',
  startExpanded: true,
};

export default function ProductReviews() {
  const { title: TITULO, startExpanded } = useConteudoDaSecao(MOCK);
  const [aberto, setAberto] = useState(startExpanded !== false);

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.tvxWrap}>
      <section className={styles.outer} data-fs-trustvox-reviews data-role="tvx-outer">
        <div className={styles.container}>
          <div
            data-fs-accordion
            data-testid="fs-accordion"
            aria-label={TITULO || undefined}
            className={styles.accordion}
          >
            <div data-fs-accordion-item data-testid="fs-accordion-item">
              <button
                type="button"
                data-fs-button
                data-fs-button-size="regular"
                data-fs-button-variant="tertiary"
                data-testid="fs-accordion-button"
                data-fs-accordion-button={aberto ? 'expanded' : 'collapsed'}
                aria-expanded={aberto}
                aria-controls="trustvox-panel--0"
                className={styles.trigger}
                data-role="tvx-trigger"
                onClick={() => setAberto(v => !v)}
              >
                <div data-fs-button-wrapper>
                  <span>
                    {TITULO && (
                      <h2 className={styles.title} data-role="tvx-title">{TITULO}</h2>
                    )}
                  </span>
                  <span data-fs-button-icon>
                    <span className={styles.sign} aria-hidden="true">
                      {aberto ? '-' : '+'}
                    </span>
                  </span>
                </div>
              </button>

              {aberto && (
                <div
                  data-fs-accordion-panel
                  aria-labelledby="trustvox-button--0"
                  data-testid="fs-accordion-panel"
                  className={styles.panel}
                  data-role="tvx-panel"
                >
                  {/* o host do widget: na loja é aqui que o Trustvox monta */}
                  <div id="trustvox-reviews" className={styles.widgetHost} data-role="tvx-host">
                    {/* Só no catálogo: o espaço do widget, com aviso. Nada de nota ou
                        comentário de exemplo (seria dado de comércio inventado). */}
                    <div className={styles.reserva} aria-hidden="true">
                      <span className={styles.reservaEstrelas}>★★★★★</span>
                      <span className={styles.reservaLinha} />
                      <span className={styles.reservaLinha} />
                      <span className={`${styles.reservaLinha} ${styles.reservaCurta}`} />
                    </div>
                    <p className={styles.reservaNota}>
                      As avaliações do Trustvox aparecem aqui, na loja.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductReviews.conteudoPadrao = MOCK;
