'use client';

import React, { useState } from 'react';

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
 */
const TITULO = 'Avaliações e comentários';

export default function ProductReviews() {
  const [aberto, setAberto] = useState(true);

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.tvxWrap}>
      <section className={styles.outer} data-fs-trustvox-reviews data-role="tvx-outer">
        <div className={styles.container}>
          <div
            data-fs-accordion
            data-testid="fs-accordion"
            aria-label={TITULO}
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
                    <h2 className={styles.title} data-role="tvx-title">{TITULO}</h2>
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
                  <div id="trustvox-reviews" className={styles.widgetHost} data-role="tvx-host" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
