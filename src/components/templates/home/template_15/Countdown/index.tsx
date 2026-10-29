import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown15` do faststore.starter (família 15, Luxo; desenho
 * `Countdown15` / `Countdown15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * Divergência deliberada: a contagem é ESTÁTICA (os valores do desenho, 04:12:36:09), não a
 * conta até a `endDate` do mock — preview e thumbs saem iguais em qualquer dia, e não
 * "vencem". Sem arte: vale o placeholder do CSS.
 */
const MOCK = {
  eyebrow: 'Pré-lançamento',
  title: 'A Coleção Lumière',
  titleEmphasis: 'chega em',
  text: 'Doze peças em ouro 18k com diamantes de lapidação brilhante, numeradas e acompanhadas de certificado. Lançamento às 20h.',
  ctaLabel: 'Conhecer a coleção',
  ctaUrl: '/s',
  daysLabel: 'Dias',
  hoursLabel: 'Horas',
  minutesLabel: 'Min',
  secondsLabel: 'Seg',
  url: '/s',
  imageAlt: 'Conhecer a Coleção Lumière',
};

// Contagem fixa (a do desenho).
const TEMPO = { d: 4, h: 12, m: 36, s: 9 };

const dois = (n: number) => String(n).padStart(2, '0');

export default function Countdown15() {
  const { eyebrow, title, titleEmphasis, text, ctaLabel, ctaUrl, daysLabel, hoursLabel, minutesLabel, secondsLabel, url, imageAlt } = MOCK;
  const tempo = TEMPO;

  const unidades = [
    { v: tempo.d, label: daysLabel || 'Dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'Horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'Min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'Seg', sr: 'segundos' },
  ];
  const titulo = [title, titleEmphasis].filter(Boolean).join(' ');

  return (
    <div className={styles.countdown15Box}>
      <section className={styles.countdown15} aria-label={titulo || 'Contagem regressiva'} data-role="cd-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <a className={styles.media} href={url || ctaUrl || '#'} aria-label={imageAlt || ctaLabel || titulo || undefined} data-role="cd-image" />
          <div className={styles.body}>
            <span className={styles.eyebrow} data-role="cd-eyebrow">
              <span className={styles.rule} aria-hidden="true" />
              {eyebrow}
            </span>
            <h2 className={styles.title} data-role="cd-title">
              {title} <em>{titleEmphasis}</em>
            </h2>
            <div className={styles.timer} role="timer" data-role="cd-timer">
              <span className={styles.srOnly}>Faltam {unidades.map(u => `${u.v} ${u.sr}`).join(', ')}</span>
              {unidades.map((u, i) => (
                <div key={i} className={styles.unit} aria-hidden="true">
                  <span className={styles.value}>{dois(u.v)}</span>
                  <span className={styles.unitLabel}>{u.label}</span>
                </div>
              ))}
            </div>
            <p className={styles.text} data-role="cd-text">
              {text}
            </p>
            <a className={styles.cta} href={ctaUrl || '#'} data-role="cd-cta">
              {ctaLabel}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
