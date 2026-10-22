import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown13` do faststore.starter (família 13, Noturno; desenho
 * `Countdown13` / `Countdown13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * Divergência deliberada: a contagem é ESTÁTICA (os valores do desenho, 02:14:36:09), não a
 * conta até a `endDate` do mock — preview e thumbs saem iguais em qualquer dia, e não
 * "vencem". Sem arte: vale o grafite de placeholder do CSS.
 */
interface Countdown13Props {
  title?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  highlightTitle?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Countdown13`).
const MOCK: Countdown13Props = {
  title: 'Drop 08 chega em',
  daysLabel: 'Dias',
  hoursLabel: 'Horas',
  minutesLabel: 'Min',
  secondsLabel: 'Seg',
  highlightTitle: 'Sem reposição',
  text: 'Abertura às 19h. Tênis, nylon técnico e acessórios em edição limitada.',
  ctaLabel: 'Ver o drop',
  ctaUrl: '/s',
  url: '/s',
  imageAlt: 'Ver o Drop 08',
};

// Contagem fixa (a do desenho).
const TEMPO = { d: 2, h: 14, m: 36, s: 9 };

const dois = (n: number) => String(n).padStart(2, '0');

const Seta = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Countdown13() {
  const {
    title,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    highlightTitle,
    text,
    ctaLabel,
    ctaUrl,
    url,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = MOCK;
  const tempo = TEMPO;

  const unidades = [
    { v: tempo.d, label: daysLabel || 'Dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'Horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'Min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'Seg', sr: 'segundos' },
  ];
  const temArte = !!(imageDesktop || imageMobile);

  return (
    <div className={styles.countdown13Box}>
      <section
        className={styles.countdown13}
        aria-label={title || 'Contagem regressiva'}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          <a
            className={styles.art}
            href={url || ctaUrl || '#'}
            aria-label={
              temArte ? undefined : imageAlt || title || 'Ver o destaque'
            }
            data-role="cd-image"
          >
            {temArte && (
              <picture>
                {imageMobile && (
                  <source media="(max-width: 960px)" srcSet={imageMobile} />
                )}
                <img
                  src={imageDesktop || imageMobile}
                  alt={imageAlt ?? ''}
                  width={480}
                  height={560}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            )}
          </a>
          <div className={styles.lead}>
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
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className={styles.colon} aria-hidden="true">
                      :
                    </span>
                  )}
                  <span
                    className={`${styles.unit}${i === 3 ? ` ${styles.unitLast}` : ''}`}
                    aria-hidden="true"
                  >
                    <span className={styles.value}>{dois(u.v)}</span>
                    <span className={styles.unitLabel}>{u.label}</span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className={styles.side}>
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
              <a className={styles.cta} href={ctaUrl || '#'} data-role="cd-cta">
                {ctaLabel}
                <Seta />
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
