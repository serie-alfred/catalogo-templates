import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip13` do faststore.starter (família 13, Noturno; desenho
 * `Ruler13` / `Ruler13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 */
type BenefitsStrip13Icon = 'truck' | 'card' | 'exchange' | 'store';

interface BenefitsStrip13Benefit {
  icon?: BenefitsStrip13Icon;
  text?: string;
  url?: string;
}

// Conteúdo do mock.ts do starter.
const BENEFITS: BenefitsStrip13Benefit[] = [
  { icon: 'truck', text: 'Frete grátis acima de R$ 299' },
  { icon: 'card', text: '6x sem juros' },
  { icon: 'exchange', text: 'Troca grátis em 30 dias' },
  { icon: 'store', text: 'Retire na loja' },
];

const ICONES: Record<BenefitsStrip13Icon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 10h18" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5 4h14l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
};

const Asterisco = () => (
  <svg
    className={styles.star}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    aria-hidden="true"
  >
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
  </svg>
);

export default function Ruler13() {
  const itens = BENEFITS.filter(b => b.text);
  if (!itens.length) return null;

  return (
    <div className={styles.benefitsStrip13Box}>
      <section
        className={styles.benefitsStrip13}
        aria-label="Benefícios"
        data-role="rl-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <ul className={styles.list}>
          {itens.map((b, i) => {
            const corpo = (
              <>
                {b.icon && ICONES[b.icon] && (
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    {ICONES[b.icon]}
                  </svg>
                )}
                {b.text}
              </>
            );
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <li className={styles.sep} aria-hidden="true">
                    <Asterisco />
                  </li>
                )}
                <li className={styles.item} data-role="rl-item">
                  {b.url ? (
                    <a className={styles.row} href={b.url}>
                      {corpo}
                    </a>
                  ) : (
                    <span className={styles.row}>{corpo}</span>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
