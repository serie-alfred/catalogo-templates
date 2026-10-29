import React from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown14` do faststore.starter (família 14, Esportiva; desenho
 * `Countdown14`). Mesmo markup, mesmas classes e `data-role`; o CSS é derivado do SCSS de lá.
 * Faixa marinho com a arte cortada em diagonal, a chamada, o título em Saira itálica, "Termina
 * em", as quatro placas lima em paralelogramo, o texto e o CTA lima.
 *
 * Divergência deliberada: a contagem é ESTÁTICA (os valores do desenho, 02:14:36:09), não a
 * conta até a `endDate` do mock — preview e thumbs saem iguais em qualquer dia. Sem arte, como o
 * mock de lá (vale o placeholder).
 */

// Conteúdo do mock.ts do starter (textos literais do desenho `Countdown14`).
const CONTEUDO = {
  eyebrow: 'Semana da Corrida',
  title: 'Até 40% off em tênis de corrida',
  timerLabel: 'Termina em',
  text: 'Modelos selecionados de asfalto, trail e esteira. Enquanto durarem os estoques.',
  ctaLabel: 'Aproveitar ofertas',
  imageAlt: 'Ver as ofertas da Semana da Corrida',
};

// Contagem fixa (a do desenho).
const TEMPO = { d: 2, h: 14, m: 36, s: 9 };

const dois = (n: number) => String(n).padStart(2, '0');

export default function Countdown14() {
  const { eyebrow, title, timerLabel, text, ctaLabel, imageAlt } = CONTEUDO;
  const unidades = [
    { v: TEMPO.d, label: 'dias', sr: 'dias' },
    { v: TEMPO.h, label: 'horas', sr: 'horas' },
    { v: TEMPO.m, label: 'min', sr: 'minutos' },
    { v: TEMPO.s, label: 'seg', sr: 'segundos' },
  ];

  return (
    <div className={styles.countdown14Box}>
      <section className={styles.countdown14} aria-label={title || eyebrow || 'Contagem regressiva'} data-role="cd-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          <a className={styles.art} href="#" aria-label={imageAlt || title || 'Ver as ofertas'} data-role="cd-image" />
          <div className={styles.copy}>
            <span className={styles.eyebrow} data-role="cd-eyebrow">
              {eyebrow}
            </span>
            <h2 className={styles.title} data-role="cd-title">
              {title}
            </h2>
            <span className={styles.timerLabel}>{timerLabel}</span>
            <div
              className={styles.timer}
              role="timer"
              aria-label={`Faltam ${TEMPO.d} dias, ${TEMPO.h} horas, ${TEMPO.m} minutos e ${TEMPO.s} segundos`}
              data-role="cd-timer"
            >
              {unidades.map((u, i) => (
                <React.Fragment key={u.sr}>
                  {i > 0 && (
                    <span className={styles.colon} aria-hidden="true">
                      :
                    </span>
                  )}
                  <div className={styles.unit} aria-hidden="true">
                    <span className={styles.num}>{dois(u.v)}</span>
                    <span className={styles.unitLabel}>{u.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p className={styles.text} data-role="cd-text">
              {text}
            </p>
            <a className={styles.cta} href="#" data-role="cd-cta">
              {ctaLabel}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
