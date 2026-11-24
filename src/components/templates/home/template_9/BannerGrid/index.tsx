import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid09` do faststore.starter (família 09, Editorial;
 * desenho `BannerGrid09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (três banners sem arte: vale o fundo de placeholder da mídia), por baixo do
 * que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 */

interface Banner {
  title?: string;
  titleEmphasis?: string;
  linkLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerGrid09Conteudo {
  eyebrow?: string;
  note?: string;
  banners: Banner[];
}

const MOCK: BannerGrid09Conteudo = {
  eyebrow: 'Edições da estação',
  note: 'Três recortes da coleção',
  banners: [
    { title: 'Linho,', titleEmphasis: 'sempre', linkLabel: 'Ver mais', url: '/s' },
    { title: 'Alfaiataria', titleEmphasis: 'leve', linkLabel: 'Ver mais', url: '/s' },
    { title: 'Couro e', titleEmphasis: 'metal', linkLabel: 'Ver mais', url: '/s' },
  ],
};

function Card({ b, big }: { b: Banner; big?: boolean }) {
  return (
    <a className={`${styles.card}${big ? ` ${styles.big}` : ''}`} href={b.url || '#'} data-role="bg-banner">
      <span className={styles.media}>
        {(b.imageDesktop || b.imageMobile) && (
          <picture>
            {b.imageMobile && <source media="(max-width: 960px)" srcSet={b.imageMobile} />}
            <img
              src={b.imageDesktop || b.imageMobile}
              alt={b.imageAlt || [b.title, b.titleEmphasis].filter(Boolean).join(' ')}
              width={big ? 960 : 700}
              height={big ? 1100 : 480}
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
      </span>
      <span className={styles.label}>
        {(b.title || b.titleEmphasis) && (
          <span className={styles.title}>
            {b.title} {b.titleEmphasis && <em>{b.titleEmphasis}</em>}
          </span>
        )}
        {b.linkLabel && <span className={styles.more}>{b.linkLabel}</span>}
      </span>
    </a>
  );
}

export default function BannerGrid09() {
  const { eyebrow, note, banners } = useConteudoDaSecao(MOCK);
  if (!banners.length) return null;
  const [primeiro, ...resto] = banners.slice(0, 3);

  return (
    <div className={styles.bannerGrid09Box}>
      <section className={styles.bannerGrid09} aria-label={eyebrow || 'Destaques'} data-role="bg-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          {(eyebrow || note) && (
            <div className={styles.head}>
              {eyebrow && (
                <span className={styles.eyebrow} data-role="bg-eyebrow">
                  <span className={styles.eyebrowRule} aria-hidden="true" />
                  {eyebrow}
                </span>
              )}
              {note && <span className={styles.note}>{note}</span>}
            </div>
          )}
          <div className={styles.grid}>
            <Card b={primeiro} big />
            {resto.length > 0 && (
              <div className={styles.stack}>
                {resto.map((b, i) => (
                  <Card key={i} b={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerGrid09.conteudoPadrao = MOCK;
