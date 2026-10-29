import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial15` do faststore.starter (família 15, Luxo; desenho
 * `Editorial15` / `Editorial15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá, sem
 * arte (vale o placeholder do CSS).
 */
interface Historia {
  eyebrow?: string;
  title?: string;
  text?: string;
  linkLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

const EYEBROW = 'Histórias';
const TITLE = 'O';
const TITLE_EMPHASIS = 'Journal';
const VIEW_ALL_LABEL = 'Ver todas as histórias';
const VIEW_ALL_URL = '/s';
const HISTORIAS: Historia[] = [
  {
    eyebrow: 'Ateliê',
    title: 'Do esboço ao polimento: as 60 horas de um solitário',
    text: 'Acompanhamos a ourives-chefe na bancada, da fundição do ouro à cravação do diamante.',
    linkLabel: 'Ler a história',
    url: '/s',
    imageAlt: 'Ateliê',
  },
  {
    eyebrow: 'Guia',
    title: 'Como escolher o tamanho do aro sem errar',
    text: 'Três medidas simples para acertar no presente.',
    url: '/s',
    imageAlt: 'Guia',
  },
  {
    eyebrow: 'Perfumaria',
    title: 'Notas de fundo: por que o âmbar dura mais na pele',
    text: 'Uma conversa com o nariz por trás de Ambre Nuit.',
    url: '/s',
    imageAlt: 'Perfumaria',
  },
];

function Arte({ s, w, h }: { s: Historia; w: number; h: number }) {
  if (!s.imageDesktop && !s.imageMobile) return null;
  return (
    <picture>
      {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
      <img src={s.imageDesktop || s.imageMobile} alt={s.imageAlt ?? ''} width={w} height={h} loading="lazy" decoding="async" />
    </picture>
  );
}

export default function Editorial15() {
  const [destaque, ...demais] = HISTORIAS;
  const viewAllLabel = VIEW_ALL_LABEL;
  const viewAllUrl = VIEW_ALL_URL;

  return (
    <div className={styles.editorial15Box}>
      <section className={styles.editorial15} aria-label={`${TITLE} ${TITLE_EMPHASIS}`} data-role="ed-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.heading}>
              <span className={styles.eyebrow}>{EYEBROW}</span>
              <h2 className={styles.title} data-role="ed-title">
                {TITLE} <em>{TITLE_EMPHASIS}</em>
              </h2>
            </div>
            <a className={`${styles.viewAll} ${styles.dsk}`} href={viewAllUrl || '#'} data-role="ed-view-all">
              {viewAllLabel}
            </a>
          </div>
          <div className={styles.body}>
            <a className={styles.featured} href={destaque.url || '#'} data-role="ed-featured">
              <span className={styles.featuredMedia}>
                <Arte s={destaque} w={1400} h={1050} />
              </span>
              <span className={styles.featuredCopy}>
                {destaque.eyebrow && <span className={styles.eyebrow}>{destaque.eyebrow}</span>}
                {destaque.title && <span className={styles.featuredTitle}>{destaque.title}</span>}
                {destaque.text && <span className={styles.featuredText}>{destaque.text}</span>}
                {destaque.linkLabel && (
                  <span className={styles.readMore}>
                    {destaque.linkLabel}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </span>
            </a>
            {demais.length > 0 && (
              <div className={styles.list}>
                {demais.map((s, i) => (
                  <a key={i} className={styles.story} href={s.url || '#'} data-role="ed-story">
                    <span className={styles.thumb}>
                      <Arte s={s} w={336} h={420} />
                    </span>
                    <span className={styles.storyCopy}>
                      {s.eyebrow && <span className={`${styles.eyebrow} ${styles.storyEyebrow}`}>{s.eyebrow}</span>}
                      {s.title && <span className={styles.storyTitle}>{s.title}</span>}
                      {s.text && <span className={styles.storyText}>{s.text}</span>}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a className={`${styles.viewAll} ${styles.mob}`} href={viewAllUrl || '#'}>
            {viewAllLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
