'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown13` do faststore.starter (família 13, Noturno; desenho
 * `Countdown13` / `Countdown13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * Divergência deliberada: sem `endDate` (o mock daqui não tem), a contagem parte da montagem
 * com o tempo que o desenho mostra (02:14:36:09), para o card não "vencer". Com o `endDate`
 * do CS, conta até ele, como o starter. Sem arte: vale o grafite de placeholder do CSS.
 *
 * Conteúdo: o MOCK abaixo por baixo do que o CS subir (`useConteudoDaSecao`, campos do
 * schema de lá).
 */

/** O conteúdo da seção: os campos do `section.schema` do Countdown13. */
interface Countdown13Conteudo {
  title?: string;
  endDate?: string;
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

const MOCK: Countdown13Conteudo = {
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

// 2 dias, 14 h, 36 min e 9 s a partir da montagem: é o que o desenho mostra.
const DURACAO = ((2 * 24 + 14) * 3600 + 36 * 60 + 9) * 1000;

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
    endDate,
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

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Countdown13.conteudoPadrao = MOCK;
