import React, { useEffect, useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown11` do faststore.starter (família 11, Grade; desenho
 * `Countdown11` / `Countdown11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá,
 * inclusive a data final: a contagem anda, com a mesma conta de lá (vencida ou ausente
 * para em 00). Sem arte (o desenho da 11 não tem): a célula `media` não aparece.
 */
interface Countdown11Props {
  eyebrow?: string;
  title?: string;
  timerLabel?: string;
  endDate?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  ctaLabel?: string;
  ctaCaption?: string;
  ctaUrl?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const MOCK: Countdown11Props = {
  eyebrow: '[Edição limitada N°07]',
  title: 'Pendente Globo em latão, tiragem numerada.',
  timerLabel: 'A pré-venda abre em',
  endDate: '2026-12-31T23:59:59-03:00',
  daysLabel: 'Dias',
  hoursLabel: 'Horas',
  minutesLabel: 'Min',
  secondsLabel: 'Seg',
  ctaLabel: 'Conhecer a peça',
  ctaCaption: 'Edição N°07',
  ctaUrl: '/s',
};

type Restante = { d: number; h: number; m: number; s: number };

function restante(endDate?: string): Restante {
  const fim = endDate ? Date.parse(endDate) : NaN;
  const ms = Number.isFinite(fim) ? Math.max(0, fim - Date.now()) : 0;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const dois = (n: number) => String(n).padStart(2, '0');

export default function Countdown11() {
  const {
    eyebrow,
    title,
    timerLabel,
    endDate,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    ctaLabel,
    ctaCaption,
    ctaUrl,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = MOCK;
  const [tempo, setTempo] = useState<Restante>(() => restante(endDate));

  useEffect(() => {
    setTempo(restante(endDate));
    const id = window.setInterval(() => setTempo(restante(endDate)), 1000);
    return () => window.clearInterval(id);
  }, [endDate]);

  const unidades = [
    { v: tempo.d, label: daysLabel || 'Dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'Horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'Min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'Seg', sr: 'segundos' },
  ];
  const temArte = !!(imageDesktop || imageMobile);

  return (
    <div className={styles.countdown11Box}>
      <section
        className={styles.countdown11}
        aria-label={eyebrow || title || 'Contagem regressiva'}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.box}>
          {temArte && (
            <div className={styles.media} data-role="cd-image">
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
            </div>
          )}
          <div className={styles.copy}>
            {eyebrow ? (
              <span className={styles.eyebrow} data-role="cd-eyebrow">
                {eyebrow}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            {title && (
              <p className={styles.title} data-role="cd-title">
                {title}
              </p>
            )}
            {timerLabel ? (
              <span className={styles.timerLabel} data-role="cd-timer-label">
                {timerLabel}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
          <div className={styles.timer} data-role="cd-timer">
            <span className={styles.srOnly} suppressHydrationWarning>
              {timerLabel ? `${timerLabel} ` : 'Faltam '}
              {unidades.map(u => `${u.v} ${u.sr}`).join(', ')}
            </span>
            <div className={styles.units} aria-hidden="true">
              {unidades.map((u, i) => (
                <div key={i} className={styles.unit}>
                  <span className={styles.value} suppressHydrationWarning>
                    {dois(u.v)}
                  </span>
                  <span className={styles.unitLabel}>{u.label}</span>
                </div>
              ))}
            </div>
          </div>
          {ctaLabel && (
            <a className={styles.cta} href={ctaUrl || '#'} data-role="cd-cta">
              <svg
                className={styles.ctaIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
              <span className={styles.ctaCopy}>
                <span className={styles.ctaLabel}>{ctaLabel}</span>
                {ctaCaption && (
                  <span className={styles.ctaCaption}>{ctaCaption}</span>
                )}
              </span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
