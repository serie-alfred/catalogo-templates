import React, { useEffect, useState } from 'react'
import { FONTES_17 as FONTES } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/HelpFloatButton17` do faststore.starter (família 17, Pet; desenho
 * `HelpFloat17` / `HelpFloat17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`; o CSS é
 * derivado do SCSS de lá, com o @media (camada fixa na tela, z 1500 / véu 1499 — sem envelope de
 * container). O botão redondo na cor de destaque fica no canto inferior direito; aberto, sobe o
 * painel branco de raio 16: a cabeça na cor de destaque (título, horário e o fechar), os atalhos
 * em linhas com o ícone num círculo claro, o rótulo e a seta, e no pé o botão de contorno
 * ("Falar no WhatsApp"). No mobile o painel ocupa a largura sobre um véu. Conteúdo = o mock.ts de
 * lá; nasce fechado, como lá.
 */

type HelpFloatButton17Icon = 'box' | 'exchange' | 'store' | 'pharmacy' | 'truck' | 'chat' | 'mail' | 'phone' | 'help' | 'none'

interface HelpFloatButton17Props {
  /** Nome do botão para leitores de tela (o desenho só mostra o ícone). */
  buttonLabel?: string
  /** Título do painel. */
  title?: string
  scheduleText?: string
  /** Com `url` o item é link; sem `url`, texto. */
  helpItems?: { label?: string; url?: string; icon?: HelpFloatButton17Icon }[]
  /** Botão de contorno no pé do painel. Vazio esconde. */
  ctaLabel?: string
  ctaUrl?: string
}

// Conteúdo do mock.ts do starter (textos do desenho).
const helpFloatButton17Mock: HelpFloatButton17Props = {
  buttonLabel: 'Ajuda',
  title: 'Como podemos ajudar?',
  scheduleText: 'Seg a sáb · 8h às 20h',
  helpItems: [
    { label: 'Rastrear meu pedido', url: '/account/orders', icon: 'box' },
    { label: 'Trocas e devoluções', url: '/ajuda/trocas', icon: 'exchange' },
    { label: 'Retirada na loja', url: '/ajuda/retirada', icon: 'store' },
    { label: 'Dúvidas sobre medicamentos', url: '/ajuda/farmacia', icon: 'pharmacy' },
  ],
  ctaLabel: 'Falar no WhatsApp',
  ctaUrl: 'https://wa.me/0000000000000',
}


const svg = (w: number, children: React.ReactNode, sw = '1.8', className?: string) => (
  <svg className={className} width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const BALAO = 'M4 20l1.3-3.9A8 8 0 1 1 8 19z'

const ICONE: Record<Exclude<HelpFloatButton17Icon, 'none'>, React.ReactNode> = {
  box: (
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h11a5 5 0 0 1 0 10H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  store: (
    <>
      <path d="M4 10v10h16V10" />
      <path d="M3 10l2-6h14l2 6" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  pharmacy: (
    <>
      <path d="M9 3h6v4l3 3v11H6V10l3-3z" />
      <path d="M12 12v6M9 15h6" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  chat: <path d={BALAO} />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1v.5M12 16.5v.01" />
    </>
  ),
}

const externo = (url: string) => (/^https?:/i.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

export default function HelpFloat17() {
  const { buttonLabel, title, scheduleText, helpItems = [], ctaLabel, ctaUrl } = helpFloatButton17Mock
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aberto])

  if (!helpItems.length && !scheduleText && !ctaLabel) return null

  const nome = buttonLabel || 'Ajuda'

  return (
    <div className={`${styles.helpFloatButton17}${aberto ? ` ${styles.open}` : ''}`} data-role="hf-root">
      <link rel="stylesheet" href={FONTES} />
      {aberto && <div className={styles.veil} onClick={() => setAberto(false)} aria-hidden="true" />}
      {aberto && (
        <section id="hf17-painel" className={styles.panel} aria-labelledby="hf17-titulo" data-role="hf-panel">
          <div className={styles.head}>
            <span className={styles.headText}>
              <h2 id="hf17-titulo" className={styles.title} data-role="hf-title">
                {title || nome}
              </h2>
              {scheduleText && (
                <span className={styles.schedule} data-role="hf-foot">
                  {scheduleText}
                </span>
              )}
            </span>
            <button type="button" className={styles.close} onClick={() => setAberto(false)} aria-label={`Fechar ${nome.toLowerCase()}`}>
              {svg(20, <path d="M6 6l12 12M18 6 6 18" />)}
            </button>
          </div>
          {helpItems.length > 0 && (
            <ul className={styles.list}>
              {helpItems.map((item, i) => {
                const icone = item.icon && item.icon !== 'none' ? ICONE[item.icon] : null
                const conteudo = (
                  <>
                    {icone && <span className={styles.itemIcon}>{svg(18, icone)}</span>}
                    <span className={styles.label}>{item.label}</span>
                  </>
                )
                return (
                  <li key={i}>
                    {item.url ? (
                      <a className={styles.item} href={item.url} {...externo(item.url)} data-role="hf-item">
                        {conteudo}
                        {svg(16, <path d="m9 6 6 6-6 6" />, '2')}
                      </a>
                    ) : (
                      <div className={styles.item} data-role="hf-item">
                        {conteudo}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {ctaLabel && (
            <div className={styles.foot}>
              <a className={styles.cta} href={ctaUrl || '#'} {...externo(ctaUrl || '')} data-role="hf-cta">
                {svg(18, <path d={BALAO} />)}
                {ctaLabel}
              </a>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={aberto}
        aria-controls="hf17-painel"
        aria-label={nome}
        onClick={() => setAberto((v) => !v)}
        data-role="hf-button"
      >
        {aberto
          ? svg(26, <path d="M6 6l12 12M18 6 6 18" />)
          : svg(
              28,
              <>
                <path d={BALAO} />
                <path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1v.5M12 16.5v.01" />
              </>
            )}
      </button>
    </div>
  )
}
