'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown09` do faststore.starter (família 09, Editorial;
 * desenho `Countdown09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 *
 * Divergência deliberada: sem `endDate` (o mock daqui não tem), a contagem parte
 * da montagem com o tempo que o desenho mostra, para o card não envelhecer. Com o
 * `endDate` do CS, conta até ele, como o starter.
 */

// 2 dias, 14 h, 36 min e 9 s a partir da montagem: é o que o desenho mostra.
const DURACAO = ((2 * 24 + 14) * 3600 + 36 * 60 + 9) * 1000;

interface Countdown09Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  text?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

const MOCK: Countdown09Conteudo = {
  eyebrow: 'Fim de estação',
  title: 'Última',
  titleEmphasis: 'chamada',
  text: 'Peças selecionadas com preço de fim de estação.',
  ctaLabel: 'Ver a seleção',
  ctaUrl: '/s',
  daysLabel: 'Dias',
  hoursLabel: 'Horas',
  minutesLabel: 'Min',
  secondsLabel: 'Seg',
  imageAlt: 'Fim de estação',
};

type Restante = { d: number; h: number; m: number; s: number };

function restante(fim: number): Restante {
  const s = Math.floor(Math.max(0, fim - Date.now()) / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const dois = (n: number) => String(n).padStart(2, '0');

export default function Countdown09() {
  const {
    eyebrow,
    title,
    titleEmphasis,
    text,
    endDate,
    ctaLabel,
    ctaUrl,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = useConteudoDaSecao(MOCK);
  const [daMontagem] = useState(() => Date.now() + DURACAO);
  const doConteudo = endDate ? Date.parse(endDate) : NaN;
  const fim = Number.isFinite(doConteudo) ? doConteudo : daMontagem;
  const [tempo, setTempo] = useState<Restante>(() => restante(fim));

  useEffect(() => {
    setTempo(restante(fim));
    const id = window.setInterval(() => setTempo(restante(fim)), 1000);
    return () => window.clearInterval(id);
  }, [fim]);

  const unidades = [
    { v: tempo.d, label: daysLabel || 'Dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'Horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'Min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'Seg', sr: 'segundos' },
  ];

  return (
    <div className={styles.countdown09Box}>
      <section
        className={styles.countdown09}
        aria-label="Contagem regressiva da oferta"
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <div className={styles.body}>
            <div className={styles.copy}>
              {eyebrow && (
                <span className={styles.eyebrow} data-role="cd-eyebrow">
                  {eyebrow}
                </span>
              )}
              {(title || titleEmphasis) && (
                <h2 className={styles.title} data-role="cd-title">
                  {title} {titleEmphasis && <em>{titleEmphasis}</em>}
                </h2>
              )}
              {text && (
                <p className={styles.text} data-role="cd-text">
                  {text}
                </p>
              )}
              {ctaLabel && (
                <a className={styles.cta} href={ctaUrl || '#'} data-role="cd-cta">
                  {ctaLabel}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
            <div className={styles.timer} data-role="cd-timer">
              <span className={styles.srOnly} suppressHydrationWarning>
                Termina em {unidades.map(u => `${u.v} ${u.sr}`).join(', ')}
              </span>
              {unidades.map(u => (
                <div key={u.sr} className={styles.unit} aria-hidden="true">
                  <span className={styles.value} suppressHydrationWarning>
                    {dois(u.v)}
                  </span>
                  <span className={styles.unitLabel}>{u.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.media} data-role="cd-image">
            {(imageDesktop || imageMobile) && (
              <picture>
                {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
                <img
                  src={imageDesktop || imageMobile}
                  alt={imageAlt ?? ''}
                  width={640}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Countdown09.conteudoPadrao = MOCK;
