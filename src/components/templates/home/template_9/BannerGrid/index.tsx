import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid09` do faststore.starter (família 09, Editorial;
 * desenho `BannerGrid09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá: três banners sem arte (vale o fundo de placeholder da mídia).
 */

interface Banner {
  title: string;
  titleEmphasis: string;
  linkLabel: string;
}

const EYEBROW = 'Edições da estação';
const NOTE = 'Três recortes da coleção';
const BANNERS: Banner[] = [
  { title: 'Linho,', titleEmphasis: 'sempre', linkLabel: 'Ver mais' },
  { title: 'Alfaiataria', titleEmphasis: 'leve', linkLabel: 'Ver mais' },
  { title: 'Couro e', titleEmphasis: 'metal', linkLabel: 'Ver mais' },
];

function Card({ b, big }: { b: Banner; big?: boolean }) {
  return (
    <a className={`${styles.card}${big ? ` ${styles.big}` : ''}`} href="#" data-role="bg-banner">
      <span className={styles.media} />
      <span className={styles.label}>
        <span className={styles.title}>
          {b.title} <em>{b.titleEmphasis}</em>
        </span>
        <span className={styles.more}>{b.linkLabel}</span>
      </span>
    </a>
  );
}

export default function BannerGrid09() {
  const [primeiro, ...resto] = BANNERS;

  return (
    <div className={styles.bannerGrid09Box}>
      <section className={styles.bannerGrid09} aria-label={EYEBROW} data-role="bg-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.eyebrow} data-role="bg-eyebrow">
              <span className={styles.eyebrowRule} aria-hidden="true" />
              {EYEBROW}
            </span>
            <span className={styles.note}>{NOTE}</span>
          </div>
          <div className={styles.grid}>
            <Card b={primeiro} big />
            <div className={styles.stack}>
              {resto.map(b => (
                <Card key={b.title} b={b} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
