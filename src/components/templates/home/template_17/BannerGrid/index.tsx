import React from 'react'
import { FONTES_17 } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `molecules/BannerGrid17` do faststore.starter (família 17, Pet). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.bannerGrid17Box` (container das @container).
 * Sem divergência deliberada: sem arte no mock, vale o recorte neutro de cada posição.
 */

export interface BannerGrid17Banner {
  /** Chamada na cor de destaque acima do título (ex.: "Farmácia pet"). */
  eyebrow?: string
  title?: string
  /** Texto do link com a seta (ex.: "Ver farmácia"). */
  ctaLabel?: string
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
}

export interface BannerGrid17Props {
  banners?: BannerGrid17Banner[]
}

// Conteúdo do mock.ts do starter (textos literais do desenho `BannerGrid17`).
const bannerGrid17Mock: BannerGrid17Props = {
  banners: [
    { eyebrow: 'Farmácia pet', title: 'Antipulgas e vermífugos para o mês todo', ctaLabel: 'Ver farmácia', url: '/farmacia', imageAlt: 'Farmácia pet' },
    { eyebrow: 'Higiene', title: 'Banho em casa, cheirinho de pet shop', ctaLabel: 'Ver higiene', url: '/higiene', imageAlt: 'Higiene' },
    { eyebrow: 'Passeio', title: 'Peitorais, guias e coleiras para sair junto', ctaLabel: 'Ver passeio', url: '/passeio', imageAlt: 'Passeio' },
  ],
}

const Seta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function BannerGrid17() {
  const { banners = [] } = bannerGrid17Mock
  if (!banners.length) return null

  return (
    <div className={styles.bannerGrid17Box}>
      <section className={styles.bannerGrid17} aria-label="Destaques por categoria" data-role="bg-root">
        <link rel="stylesheet" href={FONTES_17} />
        <ul className={styles.grid}>
          {banners.map((b, i) => (
            <li key={i} className={styles.item} data-role="bg-item">
              <a className={styles.card} href={b.url || '#'}>
                <span className={styles.art} data-role="bg-image">
                  {(b.imageDesktop || b.imageMobile) && (
                    <picture>
                      {b.imageMobile && <source media="(max-width: 960px)" srcSet={b.imageMobile} />}
                      <img src={b.imageDesktop || b.imageMobile} alt={b.imageAlt ?? ''} width={760} height={600} loading="lazy" decoding="async" />
                    </picture>
                  )}
                </span>
                <span className={styles.copy}>
                  {b.eyebrow && (
                    <span className={styles.eyebrow} data-role="bg-eyebrow">
                      {b.eyebrow}
                    </span>
                  )}
                  {b.title && (
                    <span className={styles.title} data-role="bg-title">
                      {b.title}
                    </span>
                  )}
                  {b.ctaLabel && (
                    <span className={styles.cta} data-role="bg-cta">
                      {b.ctaLabel}
                      <Seta />
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
