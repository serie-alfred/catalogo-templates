'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown10` do faststore.starter (família 10, Varejo;
 * desenho `Countdown10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 * Sem arte no mock (vale o fundo da mídia).
 *
 * Divergência deliberada: sem `endDate` (o mock daqui não tem), a contagem parte
 * da montagem com uma duração fixa, para o card não envelhecer nem zerar. Com o
 * `endDate` do CS, conta até ele; vencida, para em 00, como no starter.
 */

// 2 dias, 14 h, 36 min e 9 s a partir da montagem.
const DURACAO = ((2 * 24 + 14) * 3600 + 36 * 60 + 9) * 1000;

/** O conteúdo da seção: os campos do `section.schema` do Countdown10. */
interface Countdown10Conteudo {
  title?: string;
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

const MOCK: Countdown10Conteudo = {
  title: 'Oferta relâmpago',
  text: 'Eletros com preço especial até o fim da contagem. Corre que é por tempo limitado.',
  ctaLabel: 'Ver as ofertas',
  ctaUrl: '/s',
  daysLabel: 'dias',
  hoursLabel: 'horas',
  minutesLabel: 'min',
  secondsLabel: 'seg',
  imageAlt: 'Oferta relâmpago',
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

export default function Countdown10() {
  const {
    title,
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
    { v: tempo.d, label: daysLabel || 'dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'seg', sr: 'segundos' },
  ];

  return (
    <div className={styles.countdown10Box}>
      <section
        className={styles.countdown10}
        aria-label={title || 'Contagem regressiva da oferta'}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.box}>
            <div className={styles.body}>
              <div className={styles.head}>
                <svg
                  className={styles.bolt}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                </svg>
                {title && (
                  <h2 className={styles.title} data-role="cd-title">
                    {title}
                  </h2>
                )}
              </div>
              {text && (
                <p className={styles.text} data-role="cd-text">
                  {text}
                </p>
              )}
              <div className={styles.timer} data-role="cd-timer">
                <span className={styles.srOnly} suppressHydrationWarning>
                  Termina em {unidades.map(u => `${u.v} ${u.sr}`).join(', ')}
                </span>
                {unidades.map((u, i) => (
                  <React.Fragment key={u.sr}>
                    {i > 0 && (
                      <span className={styles.sep} aria-hidden="true">
                        :
                      </span>
                    )}
                    <div className={styles.unit} aria-hidden="true">
                      <span className={styles.value} suppressHydrationWarning>
                        {dois(u.v)}
                      </span>
                      <span className={styles.unitLabel}>{u.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {ctaLabel && (
                <a
                  className={styles.cta}
                  href={ctaUrl || '#'}
                  data-role="cd-cta"
                >
                  {ctaLabel}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
            <div className={styles.media} data-role="cd-image">
              {(imageDesktop || imageMobile) && (
                <picture>
                  {imageMobile && (
                    <source media="(max-width: 960px)" srcSet={imageMobile} />
                  )}
                  <img
                    src={imageDesktop || imageMobile}
                    alt={imageAlt ?? ''}
                    width={620}
                    height={340}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Countdown10.conteudoPadrao = MOCK;
