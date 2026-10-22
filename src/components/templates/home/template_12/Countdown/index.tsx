import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown12` do faststore.starter (família 12, Suave; desenho
 * `Countdown12` / `Countdown12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * Divergência deliberada: a contagem é ESTÁTICA (os valores do desenho), não a conta até a
 * `endDate` do mock — preview e thumbs saem iguais em qualquer dia, e não "vencem".
 * Sem arte: vale o arco de placeholder do CSS.
 */
interface Countdown12Props {
  eyebrow?: string;
  title?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  highlightTitle?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Countdown12`).
const MOCK: Countdown12Props = {
  eyebrow: 'Kit do mês',
  title: 'A oferta do kit termina em',
  daysLabel: 'dias',
  hoursLabel: 'horas',
  minutesLabel: 'min',
  secondsLabel: 'seg',
  highlightTitle: 'Kit Rotina Noturna',
  text: 'Gel de limpeza, sérum e hidratante juntos, com preço especial só até o fim da contagem.',
  ctaLabel: 'Ver o kit',
  ctaUrl: '/s',
  imageAlt: 'Kit Rotina Noturna',
};

// Contagem fixa (a do desenho).
const TEMPO = { d: 2, h: 14, m: 36, s: 9 };

const dois = (n: number) => String(n).padStart(2, '0');

export default function Countdown12() {
  const {
    eyebrow,
    title,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    highlightTitle,
    text,
    ctaLabel,
    ctaUrl,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = MOCK;
  const tempo = TEMPO;

  const unidades = [
    { v: tempo.d, label: daysLabel || 'dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'seg', sr: 'segundos' },
  ];

  return (
    <div className={styles.countdown12Box}>
      <section
        className={styles.countdown12}
        aria-label={eyebrow || title || 'Contagem regressiva'}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.box}>
            <div className={styles.lead}>
              {eyebrow && (
                <span className={styles.eyebrow} data-role="cd-eyebrow">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className={styles.title} data-role="cd-title">
                  {title}
                </h2>
              )}
              <div className={styles.timer} data-role="cd-timer">
                <span className={styles.srOnly}>
                  Faltam {unidades.map(u => `${u.v} ${u.sr}`).join(', ')}
                </span>
                {unidades.map((u, i) => (
                  <span key={i} className={styles.unit} aria-hidden="true">
                    <span className={styles.value}>{dois(u.v)}</span>
                    <span className={styles.unitLabel}>{u.label}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.side}>
              <span className={styles.art} data-role="cd-image">
                {(imageDesktop || imageMobile) && (
                  <picture>
                    {imageMobile && (
                      <source media="(max-width: 960px)" srcSet={imageMobile} />
                    )}
                    <img
                      src={imageDesktop || imageMobile}
                      alt={imageAlt ?? ''}
                      width={360}
                      height={440}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
              </span>
              <div className={styles.copy}>
                {highlightTitle && (
                  <h3 className={styles.highlight} data-role="cd-highlight">
                    {highlightTitle}
                  </h3>
                )}
                {text && (
                  <p className={styles.text} data-role="cd-text">
                    {text}
                  </p>
                )}
                {ctaLabel && (
                  <a
                    className={styles.cta}
                    href={ctaUrl || '#'}
                    data-role="cd-cta"
                  >
                    {ctaLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
