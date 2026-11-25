'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown15` do faststore.starter (família 15, Luxo; desenho
 * `Countdown15` / `Countdown15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * Por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 *
 * Divergência deliberada: sem `endDate` (o mock daqui não tem), a contagem parte da montagem
 * com o tempo que o desenho mostra (04:12:36:09), para o card não "vencer". Com o `endDate`
 * do CS, conta até ele, como o starter. Sem arte: vale o placeholder do CSS.
 */

// 4 dias, 12 h, 36 min e 9 s a partir da montagem: é o que o desenho mostra.
const DURACAO = ((4 * 24 + 12) * 3600 + 36 * 60 + 9) * 1000;

interface Countdown15Conteudo {
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
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

const MOCK: Countdown15Conteudo = {
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

export default function Countdown15() {
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
  const titulo = [title, titleEmphasis].filter(Boolean).join(' ');

  return (
    <div className={styles.countdown15Box}>
      <section className={styles.countdown15} aria-label={titulo || 'Contagem regressiva'} data-role="cd-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <a className={styles.media} href={url || ctaUrl || '#'} aria-label={imageAlt || ctaLabel || titulo || undefined} data-role="cd-image">
            {(imageDesktop || imageMobile) && (
              <picture>
                {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
                <img src={imageDesktop || imageMobile} alt="" width={1040} height={1040} loading="lazy" decoding="async" />
              </picture>
            )}
          </a>
          <div className={styles.body}>
            {eyebrow && (
              <span className={styles.eyebrow} data-role="cd-eyebrow">
                <span className={styles.rule} aria-hidden="true" />
                {eyebrow}
              </span>
            )}
            {titulo && (
              <h2 className={styles.title} data-role="cd-title">
                {title} {titleEmphasis && <em>{titleEmphasis}</em>}
              </h2>
            )}
            <div className={styles.timer} role="timer" data-role="cd-timer">
              <span className={styles.srOnly} suppressHydrationWarning>Faltam {unidades.map(u => `${u.v} ${u.sr}`).join(', ')}</span>
              {unidades.map((u, i) => (
                <div key={i} className={styles.unit} aria-hidden="true">
                  <span className={styles.value} suppressHydrationWarning>
                    {dois(u.v)}
                  </span>
                  <span className={styles.unitLabel}>{u.label}</span>
                </div>
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
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Countdown15.conteudoPadrao = MOCK;
