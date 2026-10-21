'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown09` do faststore.starter (família 09, Editorial;
 * desenho `Countdown09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, exceto a data final: aqui a contagem parte da montagem, com o tempo que o
 * desenho mostra, para o card não envelhecer. Sem arte (vale o placeholder).
 */

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

export default function Countdown09() {
  const [fim] = useState(() => Date.now() + DURACAO);
  const [tempo, setTempo] = useState<Restante>(() => restante(fim));

  useEffect(() => {
    const id = window.setInterval(() => setTempo(restante(fim)), 1000);
    return () => window.clearInterval(id);
  }, [fim]);

  const unidades = [
    { v: tempo.d, label: 'Dias', sr: 'dias' },
    { v: tempo.h, label: 'Horas', sr: 'horas' },
    { v: tempo.m, label: 'Min', sr: 'minutos' },
    { v: tempo.s, label: 'Seg', sr: 'segundos' },
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
              <span className={styles.eyebrow} data-role="cd-eyebrow">
                Fim de estação
              </span>
              <h2 className={styles.title} data-role="cd-title">
                Última <em>chamada</em>
              </h2>
              <p className={styles.text} data-role="cd-text">
                Peças selecionadas com preço de fim de estação.
              </p>
              <a className={styles.cta} href="#" data-role="cd-cta">
                Ver a seleção
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
          <div className={styles.media} data-role="cd-image" />
        </div>
      </section>
    </div>
  );
}
