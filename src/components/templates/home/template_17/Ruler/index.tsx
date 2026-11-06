import React from 'react'
import { FONTES_17 } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `molecules/BenefitsStrip17` do faststore.starter (família 17, Pet). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.benefitsStrip17Box` (container das @container).
 * Sem divergência deliberada.
 */

export type BenefitsStrip17Icon = 'store' | 'truck' | 'card' | 'pix' | 'exchange' | 'shield' | 'gift'

export interface BenefitsStrip17Benefit {
  icon?: BenefitsStrip17Icon
  /** Título em Bricolage (ex.: "Retire na loja em 2 h"). */
  title?: string
  /** Linha de apoio (ex.: "Pedido pronto no balcão"); só no desktop, como no desenho. */
  text?: string
  /** Opcional: o benefício vira link. */
  url?: string
}

export interface BenefitsStrip17Props {
  benefits?: BenefitsStrip17Benefit[]
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Ruler17`).
const benefitsStrip17Mock: BenefitsStrip17Props = {
  benefits: [
    { icon: 'store', title: 'Retire na loja em 2 h', text: 'Pedido pronto no balcão' },
    { icon: 'card', title: 'Até 6x sem juros', text: 'Em todo o site' },
    { icon: 'pix', title: 'Desconto no Pix', text: 'Aprovação na hora' },
    { icon: 'exchange', title: 'Troca fácil', text: 'Até 7 dias após a entrega' },
  ],
}

const ICONES: Record<BenefitsStrip17Icon, React.ReactNode> = {
  store: (
    <>
      <path d="M4 10v10h16V10" />
      <path d="M3 10l2-6h14l2 6" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  pix: (
    <>
      <path d="M12 3l9 9-9 9-9-9z" />
      <path d="M9 12h6" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h11a5 5 0 0 1 0 10H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13" />
      <path d="M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0" />
    </>
  ),
}

const Patinha = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
    <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
  </svg>
)

export default function Ruler17() {
  const { benefits = [] } = benefitsStrip17Mock
  if (!benefits.length) return null

  return (
    <div className={styles.benefitsStrip17Box}>
      <section className={styles.benefitsStrip17} aria-label="Benefícios" data-role="rl-root">
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.inner}>
          <Patinha className={styles.paw} />
          <ul className={styles.list}>
            {benefits.map((b, i) => {
              const corpo = (
                <>
                  <span className={styles.badge} aria-hidden="true">
                    {b.icon && ICONES[b.icon] && (
                      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {ICONES[b.icon]}
                      </svg>
                    )}
                  </span>
                  <span className={styles.copy}>
                    {b.title && <strong className={styles.title}>{b.title}</strong>}
                    {b.text && <span className={styles.text}>{b.text}</span>}
                  </span>
                </>
              )
              return (
                <li key={i} className={styles.item} data-role="rl-item">
                  {b.url ? (
                    <a className={styles.row} href={b.url}>
                      {corpo}
                    </a>
                  ) : (
                    <div className={styles.row}>{corpo}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
