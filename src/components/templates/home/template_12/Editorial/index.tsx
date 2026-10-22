'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial12` do faststore.starter (família 12, Suave; desenho
 * `Editorial12` / `Editorial12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: valem os arcos de placeholder do CSS).
 */
interface Editorial12Step {
  title?: string;
  text?: string;
  linkLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const EYEBROW = 'Guia de rotina';
const TITLE = 'Sua rotina em 3 passos';
const TEXT =
  'Comece simples: limpar, tratar e proteger já resolvem a maior parte dos cuidados do dia.';
const STEPS: Editorial12Step[] = [
  {
    title: 'Limpar',
    text: 'Tira o excesso de oleosidade e as impurezas do dia sem ressecar a pele.',
    linkLabel: 'Ver produtos de limpeza',
    url: '#',
    imageAlt: 'Limpar',
  },
  {
    title: 'Tratar',
    text: 'O sérum entrega o ativo certo para a sua necessidade: brilho, firmeza ou uniformidade.',
    linkLabel: 'Ver séruns',
    url: '#',
    imageAlt: 'Tratar',
  },
  {
    title: 'Proteger',
    text: 'Protetor solar todos os dias, mesmo nublado e dentro de casa. Reaplique ao longo do dia.',
    linkLabel: 'Ver protetores',
    url: '#',
    imageAlt: 'Proteger',
  },
];

export default function Editorial12() {
  const railRef = useRef<HTMLOListElement>(null);
  const [atual, setAtual] = useState(0);

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const passo = (el.firstElementChild as HTMLElement | null)?.offsetWidth || el.clientWidth;
    setAtual(Math.round(el.scrollLeft / (passo + 12)));
  }, []);
  useEffect(() => {
    medir();
  }, [medir]);

  const ir = (i: number) => {
    const el = railRef.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (el && alvo)
      el.scrollTo({
        left: alvo.offsetLeft - el.offsetLeft - 16,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
  };

  return (
    <div className={styles.editorial12Box}>
      <section className={styles.editorial12} aria-label={TITLE} data-role="ed-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>{EYEBROW}</span>
            <h2 className={styles.title} data-role="ed-title">
              {TITLE}
            </h2>
            <p className={styles.text}>{TEXT}</p>
          </div>
          <ol ref={railRef} className={styles.steps} onScroll={medir} data-role="ed-list">
            {STEPS.map((s, i) => (
              <li key={i} className={styles.step} data-role="ed-step">
                <div className={styles.stepHead}>
                  <span className={styles.num} aria-hidden="true">
                    {i + 1}
                  </span>
                  {s.title && <h3 className={styles.stepTitle}>{s.title}</h3>}
                </div>
                <span className={styles.art} data-role="ed-image">
                  {(s.imageDesktop || s.imageMobile) && (
                    <picture>
                      {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
                      <img
                        src={s.imageDesktop || s.imageMobile}
                        alt={s.imageAlt ?? ''}
                        width={600}
                        height={440}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  )}
                </span>
                {s.text && <p className={styles.stepText}>{s.text}</p>}
                {s.linkLabel && (
                  <a className={styles.link} href={s.url || '#'} data-role="ed-link">
                    {s.linkLabel}
                    <span className={styles.linkArrow} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ol>
          <div className={styles.dots}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={styles.dotBtn}
                onClick={() => ir(i)}
                aria-current={i === atual}
                aria-label={i === atual ? `Passo ${i + 1}, atual` : `Passo ${i + 1}`}
              >
                <span className={`${styles.dot}${i === atual ? ` ${styles.dotOn}` : ''}`} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
