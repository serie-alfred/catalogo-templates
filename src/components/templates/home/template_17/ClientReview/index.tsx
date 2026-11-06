import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FONTES_17 as FONTES } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/ClientReview17` do faststore.starter (família 17, Pet; desenho
 * `ClientReview17` / `ClientReview17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá. A seção
 * fica dentro do envelope `.clientReview17Box` (container das @container).
 *
 * Título em Bricolage e as setas redondas (a "próxima" cheia no destaque); três cartões no
 * primário a 9% com raio 16: as estrelas, o texto e, no pé, o recorte orgânico neutro (sem foto
 * no mock) com o nome e a linha de apoio. Mobile: os cartões (300) rolam de lado no trilho
 * (`position: relative`, vem do SCSS), com os pontos embaixo; as setas somem.
 *
 * O que sai: o `withMock` (o conteúdo é o mock, inline).
 */

interface ClientReview17Review {
  /** Nota de 1 a 5 (opcional; vazio esconde as estrelas). */
  rating?: number
  text?: string
  author?: string
  /** Linha de apoio sob o nome. */
  detail?: string
  /** Foto no recorte orgânico (opcional). */
  image?: string
}

interface ClientReview17Props {
  title?: string
  reviews?: ClientReview17Review[]
}

// Conteúdo do mock.ts do starter (textos do desenho; sem foto: vale o recorte neutro).
const clientReview17Mock: ClientReview17Props = {
  title: 'Quem tem pet, aprova',
  reviews: [
    {
      rating: 5,
      text: 'A Mel aprovou a ração no primeiro dia. Era chatinha para comer e agora espera o pote encher na frente da tigela.',
      author: 'Juliana R.',
      detail: 'Tutora da Mel, vira-lata de 4 anos',
    },
    {
      rating: 5,
      text: 'O arranhador salvou o meu sofá. O Tom passa a tarde lá em cima e a base não balança nem quando ele pula.',
      author: 'Carlos M.',
      detail: 'Tutor do Tom, gato de 2 anos',
    },
    {
      rating: 5,
      text: 'Pedi de manhã e retirei na loja no fim da tarde. A cama é firme, lava fácil e o Thor dorme a noite toda.',
      author: 'Patrícia L.',
      detail: 'Tutora do Thor, labrador de 6 anos',
    },
  ],
}


const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'

const Stars = ({ nota }: { nota: number }) => (
  <span className={styles.stars} role="img" aria-label={`Nota ${nota} de 5`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} className={nota >= i + 0.5 ? undefined : styles.starOff} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={STAR} />
      </svg>
    ))}
  </span>
)

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
)

export default function ClientReview17() {
  const { title, reviews = [] } = clientReview17Mock
  const railRef = useRef<HTMLDivElement>(null)
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, paginas: 1, atual: 0 })

  const medir = useCallback(() => {
    const el = railRef.current
    if (!el || !el.clientWidth) return
    const fim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    const paginas = Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth))
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim,
      paginas,
      atual: fim ? paginas - 1 : Math.min(paginas - 1, Math.round(el.scrollLeft / el.clientWidth)),
    })
  }, [])
  useEffect(() => {
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [medir, reviews.length])

  const passo = (dir: 1 | -1) =>
    railRef.current?.scrollBy({
      left: dir * railRef.current.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })

  if (!reviews.length) return null

  return (
    <div className={styles.clientReview17Box}>
      <section className={styles.clientReview17} aria-label={title || 'Depoimentos'} data-role="cr-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="cr-title">
                {title}
              </h2>
            )}
            <div className={styles.arrows}>
              <button type="button" className={styles.arrow} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Depoimentos anteriores">
                <Chevron dir="prev" />
              </button>
              <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos depoimentos">
                <Chevron dir="next" />
              </button>
            </div>
          </div>
          <div ref={railRef} className={styles.rail} onScroll={medir} data-role="cr-list">
            {reviews.map((r, i) => (
              <figure key={i} className={styles.card} data-role="cr-card">
                {!!r.rating && <Stars nota={Math.min(5, Math.max(0, Number(r.rating)))} />}
                {r.text && <blockquote className={styles.quote}>{r.text}</blockquote>}
                {(r.author || r.detail) && (
                  <figcaption className={styles.who}>
                    <span className={styles.avatar} aria-hidden="true">
                      {r.image && <img src={r.image} alt="" width={96} height={96} loading="lazy" decoding="async" />}
                    </span>
                    <span className={styles.whoCopy}>
                      {r.author && <span className={styles.author}>{r.author}</span>}
                      {r.detail && <span className={styles.detail}>{r.detail}</span>}
                    </span>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          {trilho.paginas > 1 && (
            <div className={styles.dots} aria-hidden="true">
              {Array.from({ length: trilho.paginas }).map((_, i) => (
                <span key={i} className={`${styles.dot}${i === trilho.atual ? ` ${styles.dotOn}` : ''}`} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
