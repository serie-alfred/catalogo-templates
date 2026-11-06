import React, { useEffect, useState } from 'react'
import { FONTES_17 } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/Countdown17` do faststore.starter (família 17, Pet). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá (a mesma data final, como a réplica 16 faz). A seção fica dentro do envelope
 * `.countdown17Box` (container das @container). Sem divergência deliberada.
 */

export interface Countdown17Props {
  /** Etiqueta com a patinha acima da chamada (ex.: "Semana do Pet"). Vazio esconde. */
  eyebrow?: string
  title?: string
  /** Fim da contagem, ISO 8601 (ex.: 2026-11-15T23:59:59-03:00). */
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

// Conteúdo do mock.ts do starter (textos literais do desenho `Countdown17`). A data fica no fim
// de 2026 para o palco mostrar a contagem. Sem arte: o desenho também não tem (vale o recorte neutro).
const countdown17Mock: Countdown17Props = {
  eyebrow: 'Semana do Pet',
  title: 'As ofertas da Semana do Pet acabam em',
  endDate: '2026-12-31T23:59:59-03:00',
  daysLabel: 'dias',
  hoursLabel: 'horas',
  minutesLabel: 'min',
  secondsLabel: 'seg',
  text: 'Até 30% off em rações, petiscos e acessórios. Válido até domingo, 23h59.',
  ctaLabel: 'Aproveitar ofertas',
  ctaUrl: '/s',
  url: '/s',
  imageAlt: 'Ver as ofertas da Semana do Pet',
}

type Restante = { d: number; h: number; m: number; s: number }

function restante(endDate?: string): Restante {
  const fim = endDate ? Date.parse(endDate) : NaN
  const ms = Number.isFinite(fim) ? Math.max(0, fim - Date.now()) : 0
  const s = Math.floor(ms / 1000)
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

const dois = (n: number) => String(n).padStart(2, '0')

const Seta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Patinha = () => (
  <svg className={styles.paw} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
    <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
  </svg>
)

export default function Countdown17() {
  const {
    eyebrow,
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
  } = countdown17Mock
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
    <div className={styles.countdown17Box}>
      <section className={styles.countdown17} aria-label={title || 'Contagem regressiva'} data-role="cd-root">
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.inner}>
          <a className={styles.art} href={url || ctaUrl || '#'} aria-label={imageAlt || title || 'Ver a campanha'} data-role="cd-image">
            {(imageDesktop || imageMobile) && (
              <picture>
                {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
                <img src={imageDesktop || imageMobile} alt="" width={1040} height={840} loading="lazy" decoding="async" />
              </picture>
            )}
          </a>
          <div className={styles.copy}>
            {eyebrow && (
              <span className={styles.eyebrow} data-role="cd-eyebrow">
                <Patinha />
                {eyebrow}
              </span>
            )}
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
                  <span className={styles.value} suppressHydrationWarning>
                    {dois(u.v)}
                  </span>
                  <span className={styles.unitLabel}>{u.label}</span>
                </span>
              ))}
            </div>
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
        </div>
      </section>
    </div>
  )
}
