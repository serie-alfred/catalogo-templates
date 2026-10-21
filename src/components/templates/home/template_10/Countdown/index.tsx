'use client';

import React, { useEffect, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Countdown10` do faststore.starter (família 10, Varejo;
 * desenho `Countdown10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, inclusive a data final fixa (fim de 2026); vencida, a contagem para em 00,
 * como no starter. Sem arte (vale o fundo da mídia).
 */

const TITLE = 'Oferta relâmpago';
const TEXT =
  'Eletros com preço especial até o fim da contagem. Corre que é por tempo limitado.';
const END_DATE = '2026-12-31T23:59:59-03:00';
const CTA_LABEL = 'Ver as ofertas';

type Restante = { d: number; h: number; m: number; s: number };

function restante(endDate: string): Restante {
  const fim = Date.parse(endDate);
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

export default function Countdown10() {
  const [tempo, setTempo] = useState<Restante>(() => restante(END_DATE));

  useEffect(() => {
    setTempo(restante(END_DATE));
    const id = window.setInterval(() => setTempo(restante(END_DATE)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const unidades = [
    { v: tempo.d, label: 'dias', sr: 'dias' },
    { v: tempo.h, label: 'horas', sr: 'horas' },
    { v: tempo.m, label: 'min', sr: 'minutos' },
    { v: tempo.s, label: 'seg', sr: 'segundos' },
  ];

  return (
    <div className={styles.countdown10Box}>
      <section
        className={styles.countdown10}
        aria-label={TITLE}
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
                <h2 className={styles.title} data-role="cd-title">
                  {TITLE}
                </h2>
              </div>
              <p className={styles.text} data-role="cd-text">
                {TEXT}
              </p>
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
              <a className={styles.cta} href="#" data-role="cd-cta">
                {CTA_LABEL}
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
            </div>
            <div className={styles.media} data-role="cd-image" />
          </div>
        </div>
      </section>
    </div>
  );
}
