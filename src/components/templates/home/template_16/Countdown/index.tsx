import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

/**
 * Espelha `organisms/Countdown16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.countdown16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos literais do desenho `Countdown16`. A data fica no fim de 2026 para o palco mostrar a
// contagem. Sem arte: o desenho também não tem (vale o placeholder lilás).
const countdown16Mock: Countdown16Props = {
  title: 'A Semana da Criança acaba em',
  endDate: '2026-12-31T23:59:59-03:00',
  daysLabel: 'dias',
  hoursLabel: 'horas',
  minutesLabel: 'min',
  secondsLabel: 'seg',
  text: 'Brinquedos, livros e roupinhas com preço de festa. Depois do domingo, os preços voltam ao normal.',
  ctaLabel: 'Aproveitar agora',
  ctaUrl: '/s',
  url: '/s',
  imageAlt: 'Ver a Semana da Criança',
}


/**
 * Countdown16 — contador da família 16 (Infantil; desenho `Countdown16` / `Countdown16-mobile`).
 * Faixa roxa entre duas ondas creme: a arte arredondada e levemente inclinada à esquerda; no meio
 * a chamada em Fredoka e a contagem em quatro caixas amarelas com a sombra chapada (os segundos
 * em branco); à direita o texto e o CTA amarelo em pílula. Mobile: tudo numa coluna (arte,
 * chamada, contagem em quatro colunas iguais, texto e CTA largo).
 *
 * Contrato §4: data final digitada no CMS; vencida fica em 00. Chamada, texto, arte e CTA são
 * do CMS; nada de produto com preço, "% vendido" nem formulário. Arte desktop e mobile em
 * campos separados (§2); sem arte, vale o placeholder lilás do desenho.
 *
 * Apresentacional — sem evento de analytics (sem entidade de commerce nem lead).
 */
export interface Countdown16Props {
  title?: string
  /** Fim da contagem, ISO 8601 (ex.: 2026-10-12T23:59:59-03:00). */
  endDate?: string
  daysLabel?: string
  hoursLabel?: string
  minutesLabel?: string
  secondsLabel?: string
  text?: string
  ctaLabel?: string
  ctaUrl?: string
  /** Link da arte. */
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

type Restante = { d: number; h: number; m: number; s: number }

function restante(endDate?: string): Restante {
  const fim = endDate ? Date.parse(endDate) : NaN
  const ms = Number.isFinite(fim) ? Math.max(0, fim - Date.now()) : 0
  const s = Math.floor(ms / 1000)
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

const dois = (n: number) => String(n).padStart(2, '0')

const Seta = () => (
  <svg className={styles.ctaArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function Countdown16() {
  const {
    title,
    endDate,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    text,
    ctaLabel,
    ctaUrl,
    url,
    imageDesktop,
    imageMobile,
    imageAlt,
  } = countdown16Mock
  const [tempo, setTempo] = useState<Restante>(() => restante(endDate))

  useEffect(() => {
    setTempo(restante(endDate))
    const id = window.setInterval(() => setTempo(restante(endDate)), 1000)
    return () => window.clearInterval(id)
  }, [endDate])

  const unidades = [
    { v: tempo.d, label: daysLabel || 'dias', sr: 'dias' },
    { v: tempo.h, label: hoursLabel || 'horas', sr: 'horas' },
    { v: tempo.m, label: minutesLabel || 'min', sr: 'minutos' },
    { v: tempo.s, label: secondsLabel || 'seg', sr: 'segundos' },
  ]

  return (
    <div className={styles.countdown16Box}>
    <section className={styles.countdown16} aria-label={title || 'Contagem regressiva'} data-role="cd-root">
      <link rel="stylesheet" href={FONTES} />
      {/* Ondas creme em cima e embaixo: ilustração da família 16 (hex fixo, desvio aprovado). */}
      <svg className={`${styles.wave} ${styles.dsk}`} aria-hidden="true" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0 0H1440V20C1320 40 1200 0 1080 20S840 40 720 20 480 0 360 20 120 40 0 20z" />
      </svg>
      <svg className={`${styles.wave} ${styles.mob}`} aria-hidden="true" viewBox="0 0 375 24" preserveAspectRatio="none">
        <path d="M0 0H375V12C328 24 281 0 234 12S141 24 94 12 47 0 0 12z" />
      </svg>
      <div className={styles.inner}>
        <a className={styles.art} href={url || ctaUrl || '#'} aria-label={imageAlt || title || 'Ver a campanha'} data-role="cd-image">
          {(imageDesktop || imageMobile) && (
            <picture>
              {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
              <img src={imageDesktop || imageMobile} alt="" width={520} height={560} loading="lazy" decoding="async" />
            </picture>
          )}
        </a>
        <div className={styles.lead}>
          {title && (
            <h2 className={styles.title} data-role="cd-title">
              {title}
            </h2>
          )}
          <div className={styles.timer} data-role="cd-timer">
            <span className={styles.srOnly} suppressHydrationWarning>
              Faltam {unidades.map((u) => `${u.v} ${u.sr}`).join(', ')}
            </span>
            {unidades.map((u, i) => (
              <span key={i} className={styles.unit} aria-hidden="true">
                <span className={`${styles.value}${i === 3 ? ` ${styles.valueLast}` : ''}`} suppressHydrationWarning>
                  {dois(u.v)}
                </span>
                <span className={styles.unitLabel}>{u.label}</span>
              </span>
            ))}
          </div>
        </div>
        {(text || ctaLabel) && (
          <div className={styles.side}>
            {text && (
              <p className={styles.text} data-role="cd-text">
                {text}
              </p>
            )}
            {ctaLabel && (
              <a className={styles.cta} href={ctaUrl || '#'} data-role="cd-cta">
                {ctaLabel}
                <Seta />
              </a>
            )}
          </div>
        )}
      </div>
      <svg className={`${styles.wave} ${styles.dsk}`} aria-hidden="true" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0 20C120 0 240 40 360 20S600 0 720 20s240 20 360 0 240-20 360 0V40H0z" />
      </svg>
      <svg className={`${styles.wave} ${styles.mob}`} aria-hidden="true" viewBox="0 0 375 24" preserveAspectRatio="none">
        <path d="M0 12C47 0 94 24 141 12S234 0 281 12s47 12 94 0V24H0z" />
      </svg>
    </section>
    </div>
  )
}
