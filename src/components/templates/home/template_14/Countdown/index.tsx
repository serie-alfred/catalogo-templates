'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown14` do faststore.starter (família 14, Esportiva; desenho
 * `Countdown14`). Mesmo markup, mesmas classes e `data-role`; o CSS é derivado do SCSS de lá.
 * Faixa marinho com a arte cortada em diagonal, a chamada, o título em Saira itálica, "Termina
 * em", as quatro placas lima em paralelogramo, o texto e o CTA lima. Conteúdo = o mock.ts de
 * lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 *
 * Divergência deliberada: sem `endDate` (o mock daqui não tem), a contagem parte da montagem
 * com o tempo que o desenho mostra (02:14:36:09), para o card não envelhecer. Com o `endDate`
 * do CS, conta até ele, como o starter (vencida fica em 00).
 */

// 2 dias, 14 h, 36 min e 9 s a partir da montagem: é o que o desenho mostra.
const DURACAO = ((2 * 24 + 14) * 3600 + 36 * 60 + 9) * 1000;

interface Countdown14Conteudo {
  eyebrow?: string;
  title?: string;
  timerLabel?: string;
  endDate?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  /** Link da arte. */
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Countdown14`), sem `endDate`.
const MOCK: Countdown14Conteudo = {
  eyebrow: 'Semana da Corrida',
  title: 'Até 40% off em tênis de corrida',
  timerLabel: 'Termina em',
  daysLabel: 'dias',
  hoursLabel: 'horas',
  minutesLabel: 'min',
  secondsLabel: 'seg',
  text: 'Modelos selecionados de asfalto, trail e esteira. Enquanto durarem os estoques.',
  ctaLabel: 'Aproveitar ofertas',
  ctaUrl: '/s',
  url: '/s',
  imageAlt: 'Ver as ofertas da Semana da Corrida',
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

export default function Countdown14() {
  const {
    eyebrow,
    title,
    timerLabel,
    endDate,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    text,
    ctaLabel,
    ctaUrl,
    url,
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
    { v: tempo.d, label: daysLabel || 'dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'seg', sr: 'segundos' },
  ];
  const temArte = !!(imageDesktop || imageMobile);

  return (
    <div className={styles.countdown14Box}>
      <section className={styles.countdown14} aria-label={title || eyebrow || 'Contagem regressiva'} data-role="cd-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          <a
            className={styles.art}
            href={url || ctaUrl || '#'}
            aria-label={temArte ? undefined : imageAlt || title || 'Ver as ofertas'}
            data-role="cd-image"
          >
            {temArte && (
              <picture>
                {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
                <img src={imageDesktop || imageMobile} alt={imageAlt ?? ''} width={1200} height={840} loading="lazy" decoding="async" />
              </picture>
            )}
          </a>
          <div className={styles.copy}>
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
            {timerLabel && <span className={styles.timerLabel}>{timerLabel}</span>}
            <div
              className={styles.timer}
              role="timer"
              aria-label={`Faltam ${tempo.d} dias, ${tempo.h} horas, ${tempo.m} minutos e ${tempo.s} segundos`}
              data-role="cd-timer"
              suppressHydrationWarning
            >
              {unidades.map((u, i) => (
                <React.Fragment key={u.sr}>
                  {i > 0 && (
                    <span className={styles.colon} aria-hidden="true">
                      :
                    </span>
                  )}
                  <div className={styles.unit} aria-hidden="true">
                    <span className={styles.num} suppressHydrationWarning>
                      {dois(u.v)}
                    </span>
                    <span className={styles.unitLabel}>{u.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {text && (
              <p className={styles.text} data-role="cd-text">
                {text}
              </p>
            )}
            {ctaLabel && (
              <a className={styles.cta} href={ctaUrl || '#'} data-role="cd-cta">
                {ctaLabel}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Countdown14.conteudoPadrao = MOCK;
