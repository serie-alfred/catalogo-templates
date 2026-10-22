import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip12` do faststore.starter (família 12, Suave; desenho
 * `Ruler12` / `Ruler12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * A cor do círculo do ícone é a posição do item na lista (decoração, no CSS).
 */
type BenefitsStrip12Icon =
  | 'truck'
  | 'gift'
  | 'card'
  | 'leaf'
  | 'exchange'
  | 'shield';

interface BenefitsStrip12Benefit {
  icon?: BenefitsStrip12Icon;
  title?: string;
  text?: string;
  /** Opcional: o benefício vira link. */
  url?: string;
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Ruler12`).
const BENEFITS: BenefitsStrip12Benefit[] = [
  { icon: 'truck', title: 'Frete grátis', text: 'acima de R$ 150' },
  { icon: 'gift', title: 'Amostra grátis', text: 'em todo pedido' },
  { icon: 'card', title: '3x sem juros', text: 'no cartão de crédito' },
  { icon: 'leaf', title: 'Cruelty free', text: 'sem testes em animais' },
];

const ICONES: Record<BenefitsStrip12Icon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13" />
      <path d="M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M3 10h18" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15" />
      <path d="M5 19 13 11" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export default function Ruler12() {
  const benefits = BENEFITS;
  if (!benefits.length) return null;

  return (
    <div className={styles.benefitsStrip12Box}>
      <section
        className={styles.benefitsStrip12}
        aria-label="Benefícios"
        data-role="rl-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <ul className={styles.list}>
          {benefits.map((b, i) => {
            const corpo = (
              <>
                <span className={styles.badge} aria-hidden="true">
                  {b.icon && ICONES[b.icon] && (
                    <svg
                      className={styles.icon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONES[b.icon]}
                    </svg>
                  )}
                </span>
                <span className={styles.copy}>
                  {b.title && (
                    <strong className={styles.title}>{b.title}</strong>
                  )}
                  {b.text && <span className={styles.text}>{b.text}</span>}
                </span>
              </>
            );
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
            );
          })}
        </ul>
      </section>
    </div>
  );
}
