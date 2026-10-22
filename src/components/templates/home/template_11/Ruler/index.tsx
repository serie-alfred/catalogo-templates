import React from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip11` do faststore.starter (família 11, Grade; desenho
 * `Ruler11` / `Ruler11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * A numeração "[01]" é a posição do item na lista (decoração).
 */
type BenefitsStrip11Icon =
  | 'truck'
  | 'tool'
  | 'card'
  | 'exchange'
  | 'shield'
  | 'store';

interface BenefitsStrip11Benefit {
  icon?: BenefitsStrip11Icon;
  title?: string;
  text?: string;
  /** Opcional: o benefício vira link. */
  url?: string;
}

interface BenefitsStrip11Props {
  benefits?: BenefitsStrip11Benefit[];
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Ruler11`).
const MOCK: BenefitsStrip11Props = {
  benefits: [
    {
      icon: 'truck',
      title: 'Frete grátis acima de R$ 500',
      text: 'Todo o Brasil',
    },
    {
      icon: 'tool',
      title: 'Montagem inclusa em SP',
      text: 'Capital e Grande SP',
    },
    { icon: 'card', title: '10x sem juros', text: 'No cartão de crédito' },
    { icon: 'exchange', title: 'Troca em 30 dias', text: 'Coleta no endereço' },
  ],
};

const ICONES: Record<BenefitsStrip11Icon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  tool: (
    <path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17v3h3l5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z" />
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" />
      <path d="M3 10h18" />
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
  store: (
    <>
      <path d="M4 9h16v11H4z" />
      <path d="M4 9 5 4h14l1 5M9 20v-6h6v6" />
    </>
  ),
};

const dois = (n: number) => String(n).padStart(2, '0');

export default function Ruler11() {
  const { benefits = [] } = MOCK;
  if (!benefits.length) return null;

  return (
    <div className={styles.benefitsStrip11Box}>
      <section
        className={styles.benefitsStrip11}
        aria-label="Benefícios"
        data-role="rl-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <ul className={styles.list}>
          {benefits.map((b, i) => {
            const corpo = (
              <>
                <span className={styles.num} aria-hidden="true">
                  [{dois(i + 1)}]
                </span>
                <span className={styles.copy}>
                  {b.title && <span className={styles.title}>{b.title}</span>}
                  {b.text && <span className={styles.text}>{b.text}</span>}
                </span>
                {b.icon && ICONES[b.icon] && (
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    {ICONES[b.icon]}
                  </svg>
                )}
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
