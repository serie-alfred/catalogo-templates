'use client';

import React, { useEffect, useState } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá, por
 * baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,600;0,800;1,800&display=swap';

// 2 dias, 14 h, 27 min e 36 s a partir da montagem: é o que o Figma mostra.
// Divergência deliberada: o mock daqui não tem `endDate` (o do starter conta a
// partir de "agora"), então a contagem parte da montagem e o card não envelhece.
// Com o `endDate` do CS, conta até ele.
const DURACAO = ((2 * 24 + 14) * 3600 + 27 * 60 + 36) * 1000;

interface Countdown08Conteudo {
  label?: string;
  titleStart?: string;
  titleHighlight?: string;
  endDate?: string;
  note?: string;
}

const MOCK: Countdown08Conteudo = {
  label: 'Oferta termina',
  titleStart: 'Black',
  titleHighlight: 'Friday',
  note: 'Produtos com\ndescontos imperdíveis\npor tempo limitado',
};

const UNIDADES = [
  { key: 'd', label: 'Dias' },
  { key: 'h', label: 'Horas' },
  { key: 'm', label: 'Minutos' },
  { key: 's', label: 'Segundos' },
] as const;

type Restante = Record<(typeof UNIDADES)[number]['key'], number>;

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

export default function Countdown08() {
  const { label, titleStart, titleHighlight, endDate, note } =
    useConteudoDaSecao(MOCK);
  const [daMontagem] = useState(() => Date.now() + DURACAO);
  const doConteudo = endDate ? Date.parse(endDate) : NaN;
  const fim = Number.isFinite(doConteudo) ? doConteudo : daMontagem;
  const [tempo, setTempo] = useState<Restante>(() => restante(fim));

  useEffect(() => {
    setTempo(restante(fim));
    const id = window.setInterval(() => setTempo(restante(fim)), 1000);
    return () => window.clearInterval(id);
  }, [fim]);

  return (
    <div className={styles.countdown08Box}>
      <section
        className={`${styles.countdown08} ${styles.countdown}`}
        data-role="cd-root"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.countdownHead}>
          {label && (
            <p className={styles.countdownLabel} data-role="cd-label">
              {label}
            </p>
          )}
          <p className={styles.countdownTitle} data-role="cd-title">
            {titleStart}
            {titleHighlight && (
              <span className={styles.accent}> {titleHighlight}</span>
            )}
          </p>
        </div>
        <div className={styles.countdownBody}>
          <div
            className={styles.countdownUnits}
            role="timer"
            aria-label="Tempo restante da oferta"
          >
            {UNIDADES.map(u => (
              <div
                key={u.key}
                className={styles.countdownUnit}
                data-role="cd-unit"
              >
                <span
                  className={styles.countdownValue}
                  suppressHydrationWarning
                >
                  {dois(tempo[u.key])}
                </span>
                <span className={styles.countdownUnitLabel}>{u.label}</span>
              </div>
            ))}
          </div>
          <span className={styles.countdownRule} aria-hidden="true" />
          {note && (
            <p className={styles.countdownNote} data-role="cd-note">
              {note}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Countdown08.conteudoPadrao = MOCK;
