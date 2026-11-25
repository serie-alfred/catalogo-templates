import React from 'react'

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao'

import styles from './index.module.css'

/**
 * Espelha `molecules/BannerGrid16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). A seção fica dentro do envelope `.bannerGrid16Box` (container das @container).
 */

// Textos literais do desenho `BannerGrid16`. Sem arte: o desenho também não tem (valem os pastéis).
const MOCK: BannerGrid16Conteudo = {
  banners: [
    {
      eyebrow: '3 a 8 anos',
      title: 'Hora de brincar',
      text: 'Blocos, quebra-cabeças e jogos para montar juntos.',
      ctaLabel: 'Comprar agora',
      url: '/s',
      imageAlt: 'Hora de brincar',
    },
    {
      eyebrow: 'Novas cores',
      title: 'Roupinhas de inverno',
      text: 'Moletons, pijamas e meias quentinhas do 2 ao 10.',
      ctaLabel: 'Comprar agora',
      url: '/s',
      imageAlt: 'Roupinhas de inverno',
    },
    {
      eyebrow: '0 a 5 anos',
      title: 'Cantinho da leitura',
      text: 'Livros cartonados e de banho para os primeiros anos.',
      ctaLabel: 'Comprar agora',
      url: '/s',
      imageAlt: 'Cantinho da leitura',
    },
  ],
}


/**
 * BannerGrid16 — grade de banners da família 16 (Infantil; desenho `BannerGrid16` /
 * `BannerGrid16-mobile`). Três banners altos lado a lado (empilhados no mobile), cada um com a
 * arte arredondada e filete, a bolha inclinada no canto (ex.: "3 a 8 anos", na cor alegre da
 * posição) e, no pé, o cartão branco com o título em Fredoka, o texto e "Comprar agora" com a
 * seta. Mobile: o cartão sem o texto (some por CSS) e a arte mobile.
 *
 * Arte desktop e mobile em campos separados (contrato §2). A cor da bolha é a posição do banner
 * (ilustração da família 16, hex fixo: amarelo, coral e turquesa).
 * Apresentacional — sem evento de analytics (sem IDs de promoção: `view_promotion` não entra, gap
 * sinalizado) e sem valor de commerce.
 */
interface BannerGrid16Banner {
  /** Texto da bolha inclinada (ex.: "3 a 8 anos"). Vazio esconde. */
  eyebrow?: string
  title?: string
  text?: string
  ctaLabel?: string
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
}

interface BannerGrid16Conteudo {
  banners: BannerGrid16Banner[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

const Seta = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// A cor de cada posição (fundo, bolha e texto do cartão): classe escrita por extenso, como no
// starter.
const TONS = [styles.tom0, styles.tom1, styles.tom2]

export default function BannerGrid16() {
  const { banners } = useConteudoDaSecao(MOCK)
  if (!banners.length) return null

  return (
    <div className={styles.bannerGrid16Box}>
    <section className={styles.bannerGrid16} aria-label="Coleções em destaque" data-role="bg-root">
      <link rel="stylesheet" href={FONTES} />
      <div className={styles.grid}>
        {banners.map((b, i) => (
          <a key={i} className={`${styles.banner} ${TONS[i % 3]}`} href={b.url || '#'} data-role="bg-item">
            {(b.imageDesktop || b.imageMobile) && (
              <picture className={styles.art}>
                {b.imageMobile && <source media="(max-width: 960px)" srcSet={b.imageMobile} />}
                <img src={b.imageDesktop || b.imageMobile} alt={b.imageAlt ?? ''} width={800} height={920} loading="lazy" decoding="async" />
              </picture>
            )}
            {b.eyebrow && (
              <span className={styles.bubble} data-role="bg-eyebrow">
                {b.eyebrow}
              </span>
            )}
            {(b.title || b.text || b.ctaLabel) && (
              <span className={styles.card}>
                {b.title && (
                  <span className={styles.title} data-role="bg-title">
                    {b.title}
                  </span>
                )}
                {b.text && <span className={styles.text}>{b.text}</span>}
                {b.ctaLabel && (
                  <span className={styles.cta} data-role="bg-cta">
                    {b.ctaLabel}
                    <Seta />
                  </span>
                )}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
    </div>
  )
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerGrid16.conteudoPadrao = MOCK;
