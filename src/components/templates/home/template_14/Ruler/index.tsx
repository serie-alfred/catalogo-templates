import React from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip14` do faststore.starter (família 14, Esportiva; desenho
 * `Ruler14` / `Ruler14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 * A faixa corre de lado (34s) com a lista duplicada (a cópia `aria-hidden`) e para com
 * `prefers-reduced-motion` — desvio aprovado da 14, igual a lá.
 */
type BenefitsStrip14Icon = 'truck' | 'card' | 'exchange' | 'store' | 'clock';

interface BenefitsStrip14Benefit {
  icon?: BenefitsStrip14Icon;
  text?: string;
  url?: string;
}

// Conteúdo do mock.ts do starter.
const BENEFITS: BenefitsStrip14Benefit[] = [
  { icon: 'truck', text: 'Frete grátis acima de R$ 299' },
  { icon: 'card', text: 'Até 10x sem juros' },
  { icon: 'exchange', text: 'Troca grátis em 30 dias' },
  { icon: 'store', text: 'Retire na loja em 2 h' },
  { icon: 'clock', text: 'Envio em 24 h úteis' },
];

const ICONES: Record<BenefitsStrip14Icon, React.ReactNode> = {
  truck: (
    <>
      <path d="M2 6h12v10H2zM14 10h4l4 4v2h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="1" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
  exchange: <path d="M4 8h14l-4-4M20 16H6l4 4" />,
  store: (
    <>
      <path d="M4 9 5 4h14l1 5M4 9v11h16V9M4 9h16" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 2h6" />
    </>
  ),
};

export default function Ruler14() {
  const itens = BENEFITS.filter(b => b.text);

  const lista = (copia: boolean) => (
    <ul className={styles.list} aria-hidden={copia || undefined}>
      {itens.map((b, i) => {
        const corpo = (
          <>
            {b.icon && ICONES[b.icon] && (
              <span className={styles.icon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  {ICONES[b.icon]}
                </svg>
              </span>
            )}
            {b.text}
            <span className={styles.sep} aria-hidden="true" />
          </>
        );
        return (
          <li
            key={i}
            className={styles.item}
            data-role={copia ? undefined : 'rl-item'}
          >
            {b.url ? (
              <a
                className={styles.row}
                href={b.url}
                tabIndex={copia ? -1 : undefined}
              >
                {corpo}
              </a>
            ) : (
              <span className={styles.row}>{corpo}</span>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={styles.benefitsStrip14Box}>
      <section
        className={styles.benefitsStrip14}
        aria-label="Benefícios"
        data-role="rl-root"
      >
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.tape}>
          {lista(false)}
          {lista(true)}
        </div>
      </section>
    </div>
  );
}
