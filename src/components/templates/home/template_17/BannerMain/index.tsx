import React, { useRef, useState } from 'react'
import { FONTES_17 } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/BannerMain17` do faststore.starter (família 17, Pet). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.bannerMain17Box` (container das @container).
 * Sem divergência deliberada: sem arte no mock, vale o recorte de placeholder do CSS.
 */

export interface BannerMain17Slide {
  /** Etiqueta tangerina acima do título (ex.: "Mês da nutrição"). Vazio esconde. */
  eyebrow?: string
  title?: string
  text?: string
  ctaLabel?: string
  ctaUrl?: string
  /** Botão de contorno ao lado do CTA (ex.: "Petiscos naturais"). Vazio esconde. */
  secondaryLabel?: string
  secondaryUrl?: string
  /** Link da arte. */
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
}

export interface BannerMain17Props {
  slides?: BannerMain17Slide[]
}

// Conteúdo do mock.ts do starter.
// Textos do desenho `BannerMain17` (3 banners, como os pontos e o "1 de 3" do desenho). Sem arte:
// o desenho também não tem (vale o recorte de placeholder).
const base = {
  eyebrow: 'Mês da nutrição',
  text: 'Rações premium para cães e gatos com até 20% off e parcelamento em até 6x sem juros.',
  ctaLabel: 'Ver rações',
  ctaUrl: '/s',
  secondaryLabel: 'Petiscos naturais',
  secondaryUrl: '/s',
  url: '/s',
}

const bannerMain17Mock: BannerMain17Props = {
  slides: [
    { ...base, title: 'Tigela cheia, rabo abanando.', imageAlt: 'Ver rações em oferta' },
    { ...base, title: 'Petisco bom é petisco natural.', imageAlt: 'Ver os petiscos naturais' },
    { ...base, title: 'Cama nova, soneca longa.', imageAlt: 'Ver as camas' },
  ],
}

const Seta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
)

export default function BannerMain17() {
  const { slides = [] } = bannerMain17Mock
  const [atual, setAtual] = useState(0)
  const toqueX = useRef<number | null>(null)

  if (!slides.length) return null
  const total = slides.length
  const ir = (i: number) => setAtual((i + total) % total)
  const idx = Math.min(atual, total - 1)
  const s = slides[idx]

  return (
    <div className={styles.bannerMain17Box}>
      <section className={styles.bannerMain17} aria-roledescription="carrossel" aria-label="Destaques" data-role="bm-root">
        {/* <link> de stylesheet no body é "body-ok" no HTML: o navegador aplica sem hoist. */}
        <link rel="stylesheet" href={FONTES_17} />
        <div
          className={styles.slide}
          onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (toqueX.current === null || total < 2) return
            const dx = e.changedTouches[0].clientX - toqueX.current
            toqueX.current = null
            if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1))
          }}
        >
          <div className={styles.copy}>
            {s.eyebrow && (
              <span className={styles.eyebrow} data-role="bm-eyebrow">
                {s.eyebrow}
              </span>
            )}
            {s.title && (
              <h2 className={styles.title} data-role="bm-title">
                {s.title}
              </h2>
            )}
            {s.text && (
              <p className={styles.text} data-role="bm-text">
                {s.text}
              </p>
            )}
            {(s.ctaLabel || s.secondaryLabel) && (
              <div className={styles.actions}>
                {s.ctaLabel && (
                  <a className={styles.cta} href={s.ctaUrl || '#'} data-role="bm-cta">
                    {s.ctaLabel}
                    <Seta />
                  </a>
                )}
                {s.secondaryLabel && (
                  <a className={styles.secondary} href={s.secondaryUrl || '#'} data-role="bm-link">
                    {s.secondaryLabel}
                  </a>
                )}
              </div>
            )}
            {total > 1 && (
              <div className={styles.nav} data-role="bm-nav">
                <button type="button" className={styles.arrow} onClick={() => ir(idx - 1)} aria-label="Slide anterior">
                  <Chevron dir="prev" />
                </button>
                <div className={styles.dots}>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={styles.dotBtn}
                      onClick={() => ir(i)}
                      aria-current={i === idx}
                      aria-label={i === idx ? `Slide ${i + 1}, atual` : `Slide ${i + 1}`}
                      data-role="bm-dot"
                    >
                      <span className={`${styles.dot}${i === idx ? ` ${styles.dotOn}` : ''}`} />
                    </button>
                  ))}
                </div>
                <button type="button" className={styles.arrow} onClick={() => ir(idx + 1)} aria-label="Próximo slide">
                  <Chevron dir="next" />
                </button>
                <span className={styles.count} aria-live="polite" data-role="bm-count">
                  {idx + 1} de {total}
                </span>
              </div>
            )}
          </div>
          <a className={styles.media} href={s.url || s.ctaUrl || '#'} aria-label={s.imageAlt || s.title || 'Ver destaque'} data-role="bm-image">
            {(s.imageDesktop || s.imageMobile) && (
              <picture className={styles.art}>
                {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
                <img
                  src={s.imageDesktop || s.imageMobile}
                  alt=""
                  width={1200}
                  height={1100}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  {...(idx === 0 ? { fetchpriority: 'high' } : {})}
                />
              </picture>
            )}
          </a>
        </div>
      </section>
    </div>
  )
}
