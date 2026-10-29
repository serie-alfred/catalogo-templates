import React from 'react'
import styles from './index.module.css'

/**
 * Espelha `molecules/BenefitsStrip16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.benefitsStrip16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos literais do desenho `Ruler16`.
const benefitsStrip16Mock: BenefitsStrip16Props = {
  benefits: [
    { icon: 'truck', title: 'Frete grátis', text: 'nas compras acima de R$ 199' },
    { icon: 'card', title: 'Até 6x sem juros', text: 'no cartão de crédito' },
    { icon: 'exchange', title: 'Troca fácil', text: 'primeira troca sem custo' },
    { icon: 'shield', title: 'Brinquedo certificado', text: 'todos com selo do Inmetro' },
  ],
}


/**
 * BenefitsStrip16 — régua de benefícios da família 16 (Infantil; desenho `Ruler16` /
 * `Ruler16-mobile`). Faixa turquesa: cada benefício com o ícone num círculo creme com filete, o
 * título em Fredoka e a linha de apoio embaixo; grade de 4 no desktop. Mobile: uma linha só, que
 * rola de lado, com o ícone menor e o título e o apoio na mesma linha em Fredoka.
 *
 * Os textos são do CMS ("Até 6x sem juros" é texto do lojista, não cálculo).
 * Apresentacional — sem evento de analytics e sem valor de commerce.
 */
export type BenefitsStrip16Icon = 'truck' | 'card' | 'exchange' | 'shield' | 'gift' | 'star'

export interface BenefitsStrip16Benefit {
  icon?: BenefitsStrip16Icon
  /** Título em Fredoka (ex.: "Frete grátis"). */
  title?: string
  /** Linha de apoio (ex.: "nas compras acima de R$ 199"). */
  text?: string
  /** Opcional: o benefício vira link. */
  url?: string
}

export interface BenefitsStrip16Props {
  benefits?: BenefitsStrip16Benefit[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

const ICONES: Record<BenefitsStrip16Icon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4M6 21v-4h4" />
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
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
}

export default function Ruler16() {
  const { benefits = [] } = benefitsStrip16Mock
  if (!benefits.length) return null

  return (
    <div className={styles.benefitsStrip16Box}>
    <section className={styles.benefitsStrip16} aria-label="Benefícios" data-role="rl-root">
      <link rel="stylesheet" href={FONTES} />
      <ul className={styles.list}>
        {benefits.map((b, i) => {
          const corpo = (
            <>
              <span className={styles.badge} aria-hidden="true">
                {b.icon && ICONES[b.icon] && (
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONES[b.icon]}
                  </svg>
                )}
              </span>
              <span className={styles.copy}>
                {b.title && <strong className={styles.title}>{b.title}</strong>}
                {b.title && b.text && <span className={styles.space}> </span>}
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
    </section>
    </div>
  )
}
