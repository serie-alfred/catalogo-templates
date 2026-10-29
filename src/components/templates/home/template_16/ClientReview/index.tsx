import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'

/**
 * Espelha `organisms/ClientReview16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.clientReview16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos do desenho `ClientReview16` (o desenho traz "[Nome] · [Cidade]" de placeholder; aqui
// vão nomes de exemplo). Sem foto: valem os pastéis.
const clientReview16Mock: ClientReview16Props = {
  title: 'Recadinhos das famílias',
  reviews: [
    {
      rating: 5,
      text: 'Meu filho de 5 anos não larga o kit de blocos. As peças encaixam firme e não machucam a mão.',
      author: 'Camila',
      location: 'Campinas',
      productName: 'Kit Blocos de Montar 120 peças',
    },
    {
      rating: 5,
      text: 'O pijama é macio de verdade e lavou várias vezes sem desbotar as estrelinhas. Já comprei o segundo.',
      author: 'Rafael',
      location: 'Recife',
      productName: 'Pijama Algodão Estrelinhas',
    },
    {
      rating: 5,
      text: 'Chegou antes do prazo, numa caixa caprichada. A pelúcia virou companheira de soneca da minha caçula.',
      author: 'Juliana',
      location: 'Curitiba',
      productName: 'Pelúcia Dino Verde 30 cm',
    },
  ],
}


/**
 * ClientReview16 — depoimentos da família 16 (Infantil; desenho `ClientReview16` /
 * `ClientReview16-mobile`). Título em Fredoka e as setas redondas com a sombra chapada (a
 * "próximo" cheia na cor de destaque); três cartões brancos por vez, com filete, sombra chapada e
 * um leve giro cada: as estrelas (nota opcional), o texto e, abaixo de um filete tracejado, a foto
 * redonda (sem foto, o pastel da posição), "nome · cidade" em Fredoka e o produto citado. Mobile:
 * os cartões (300) rolam de lado, sem giro, com os pontos embaixo.
 *
 * Contrato §4: depoimento é texto manual do CMS. Sem "compra verificada" e sem contagem total.
 * Apresentacional — sem evento de analytics e sem valor de commerce (a nota é texto do CMS, não
 * uma média calculada).
 */
export interface ClientReview16Review {
  /** Nota de 1 a 5 (opcional; vazio esconde as estrelas). */
  rating?: number
  text?: string
  author?: string
  /** Cidade, UF. */
  location?: string
  /** Produto citado (texto). */
  productName?: string
  /** Foto redonda do perfil ou do produto (opcional). */
  image?: string
}

export interface ClientReview16Props {
  title?: string
  reviews?: ClientReview16Review[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
)

export default function ClientReview16() {
  const { title, reviews = [] } = clientReview16Mock
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
    <div className={styles.clientReview16Box}>
    <section className={styles.clientReview16} aria-label={title || 'Depoimentos'} data-role="cr-root">
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
          {reviews.map((r, i) => {
            const quem = [r.author, r.location].filter(Boolean).join(' · ')
            return (
              <figure key={i} className={`${styles.card} ${styles[`giro${i % 3}`]}`} data-role="cr-card">
                {!!r.rating && <Stars nota={Math.min(5, Math.max(0, Number(r.rating)))} />}
                {r.text && <blockquote className={styles.quote}>{r.text}</blockquote>}
                {(quem || r.productName) && (
                  <figcaption className={styles.who}>
                    <span className={`${styles.avatar} ${styles[`tom${i % 3}`]}`} aria-hidden="true">
                      {r.image && <img src={r.image} alt="" width={96} height={96} loading="lazy" decoding="async" />}
                    </span>
                    <span className={styles.whoCopy}>
                      {quem && <span className={styles.author}>{quem}</span>}
                      {r.productName && <span className={styles.product}>{r.productName}</span>}
                    </span>
                  </figcaption>
                )}
              </figure>
            )
          })}
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
