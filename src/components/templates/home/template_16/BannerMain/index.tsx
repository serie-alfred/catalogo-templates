import React, { useRef, useState } from 'react'
import styles from './index.module.css'

/**
 * Espelha `organisms/BannerMain16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.bannerMain16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos do desenho `BannerMain16` (3 banners, como os pontos do desenho). Sem arte: o desenho
// também não tem (vale o fundo de placeholder da caixa).
const base = {
  eyebrow: 'Volta às aulas 2027',
  text: 'Mochilas, estojos e lancheiras que aguentam o recreio inteiro. Escolha o tema favorito do seu pequeno.',
  ctaLabel: 'Ver material escolar',
  ctaUrl: '/s',
  secondaryLabel: 'Lancheiras',
  secondaryUrl: '/s',
  url: '/s',
  stickerTop: 'até',
  stickerValue: '30%',
  stickerBottom: 'off',
}

const bannerMain16Mock: BannerMain16Props = {
  slides: [
    { ...base, title: 'Mochila pronta, aventura garantida', imageAlt: 'Ver a coleção Volta às aulas' },
    { ...base, title: 'Estojo cheio, ideia brilhando', imageAlt: 'Ver os estojos' },
    { ...base, title: 'Lancheira divertida, recreio feliz', imageAlt: 'Ver as lancheiras' },
  ],
}


/**
 * BannerMain16 — banner principal da família 16 (Infantil; desenho `BannerMain16` /
 * `BannerMain16-mobile`). Faixa amarela: à esquerda o selo branco em pílula, o título grande em
 * Fredoka, o texto e dois botões em pílula com a sombra chapada (o CTA na cor de destaque e o
 * secundário branco); à direita a arte arredondada com filete e o selo redondo inclinado (coral,
 * três linhas: "até" · "30%" · "off"). Embaixo, os pontos (o atual em pílula) e, no desktop, as
 * setas redondas; a onda creme fecha a faixa. Mobile: a arte no topo, o texto, o CTA largo e os
 * pontos centrados; o botão secundário não aparece (some por CSS).
 *
 * Arte desktop e mobile em campos separados (contrato §2). Sem autoplay: a troca é do usuário
 * (pontos, setas, arraste).
 *
 * Apresentacional — sem evento de analytics: o schema não tem IDs estáveis de promoção, então
 * nada de `view_promotion`/`select_promotion` (gap sinalizado, não fabricado).
 */
export interface BannerMain16Slide {
  /** Selo branco acima do título (ex.: "Volta às aulas 2027"). */
  eyebrow?: string
  title?: string
  text?: string
  ctaLabel?: string
  ctaUrl?: string
  /** Botão branco ao lado do CTA (ex.: "Lancheiras"); só no desktop, como no desenho. */
  secondaryLabel?: string
  secondaryUrl?: string
  /** Link da arte. */
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
  /** Selo redondo sobre a arte, em três linhas (ex.: "até" · "30%" · "off"). Vazio esconde. */
  stickerTop?: string
  stickerValue?: string
  stickerBottom?: string
}

export interface BannerMain16Props {
  slides?: BannerMain16Slide[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

const Seta = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
)

export default function BannerMain16() {
  const { slides = [] } = bannerMain16Mock
  const [atual, setAtual] = useState(0)
  const toqueX = useRef<number | null>(null)

  if (!slides.length) return null
  const total = slides.length
  const ir = (i: number) => setAtual((i + total) % total)
  const idx = Math.min(atual, total - 1)
  const s = slides[idx]
  const temSelo = !!(s.stickerTop || s.stickerValue || s.stickerBottom)

  return (
    <div className={styles.bannerMain16Box}>
    <section className={styles.bannerMain16} aria-label="Destaques" data-role="bm-root">
      {/* <link> de stylesheet no body é "body-ok" no HTML: o navegador aplica sem hoist. */}
      <link rel="stylesheet" href={FONTES} />
      <div
        className={styles.slide}
        aria-roledescription="carrossel"
        aria-label="Banner principal"
        onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toqueX.current === null || total < 2) return
          const dx = e.changedTouches[0].clientX - toqueX.current
          toqueX.current = null
          if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1))
        }}
      >
        <div className={styles.copy} aria-live="polite">
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
        </div>
        <a className={styles.media} href={s.url || s.ctaUrl || '#'} aria-label={s.imageAlt || s.title || 'Ver destaque'} data-role="bm-image">
          {(s.imageDesktop || s.imageMobile) && (
            <picture className={styles.art}>
              {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
              <img
                src={s.imageDesktop || s.imageMobile}
                alt=""
                width={1200}
                height={880}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                {...(idx === 0 ? { fetchpriority: 'high' } : {})}
              />
            </picture>
          )}
          {temSelo && (
            <span className={styles.sticker} aria-hidden="true" data-role="bm-sticker">
              {s.stickerTop && <span className={styles.stickerSmall}>{s.stickerTop}</span>}
              {s.stickerValue && <span className={styles.stickerValue}>{s.stickerValue}</span>}
              {s.stickerBottom && <span className={styles.stickerSmall}>{s.stickerBottom}</span>}
            </span>
          )}
        </a>
      </div>
      {total > 1 && (
        <div className={styles.nav}>
          <div className={styles.dots} data-role="bm-nav">
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
          <div className={styles.arrows}>
            <button type="button" className={styles.arrow} onClick={() => ir(idx - 1)} aria-label="Slide anterior">
              <Chevron dir="prev" />
            </button>
            <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => ir(idx + 1)} aria-label="Próximo slide">
              <Chevron dir="next" />
            </button>
          </div>
        </div>
      )}
      {/* Onda creme no pé: ilustração da família 16 (hex fixo, desvio aprovado). */}
      <svg className={`${styles.wave} ${styles.dsk}`} aria-hidden="true" viewBox="0 0 1440 48" preserveAspectRatio="none">
        <path d="M0 24C120 0 240 48 360 24S600 0 720 24s240 24 360 0 240-24 360 0V48H0z" />
      </svg>
      <svg className={`${styles.wave} ${styles.mob}`} aria-hidden="true" viewBox="0 0 375 28" preserveAspectRatio="none">
        <path d="M0 14C47 0 94 28 141 14S234 0 281 14s47 14 94 0V28H0z" />
      </svg>
    </section>
    </div>
  )
}
