import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip10` do faststore.starter (família 10, Varejo; desenho
 * `Ruler10` / `Ruler10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 */
type BenefitsStrip10Icon =
  | 'truck'
  | 'card'
  | 'pix'
  | 'store'
  | 'exchange'
  | 'shield';

interface BenefitsStrip10Benefit {
  icon?: BenefitsStrip10Icon;
  title?: string;
  text?: string;
  /** Opcional: o benefício vira link. */
  url?: string;
}

interface BenefitsStrip10Props {
  benefits?: BenefitsStrip10Benefit[];
}

// Conteúdo do mock.ts do starter.
// Textos literais do desenho `Ruler10`.
const MOCK: BenefitsStrip10Props = {
  benefits: [
    {
      icon: 'truck',
      title: 'Frete grátis acima de R$ 199',
      text: 'Para todo o Brasil',
    },
    { icon: 'card', title: '10x sem juros', text: 'No cartão de crédito' },
    { icon: 'pix', title: '5% OFF no Pix', text: 'Aprovação na hora' },
    {
      icon: 'store',
      title: 'Retire na loja em 2h',
      text: 'Sem custo de frete',
    },
  ],
};

const ICONES: Record<BenefitsStrip10Icon, React.ReactNode> = {
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
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  pix: (
    <>
      <path d="M12 3 21 12 12 21 3 12z" />
      <path d="m8.5 12 3.5-3.5 3.5 3.5-3.5 3.5z" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5 4h14l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
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

export default function Ruler10() {
  const { benefits = [] } = MOCK;
  const railRef = useRef<HTMLUListElement>(null);
  const [atual, setAtual] = useState(0);

  // Ponto ativo = o cartão mais à esquerda à vista (só tem efeito no mobile, onde o trilho rola).
  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.children.length) return;
    const passo = (el.children[0] as HTMLElement).offsetWidth + 10;
    setAtual(
      Math.min(el.children.length - 1, Math.round(el.scrollLeft / passo))
    );
  }, []);

  useEffect(() => {
    medir();
  }, [medir, benefits.length]);

  if (!benefits.length) return null;

  return (
    <div className={styles.benefitsStrip10Box}>
      <section
        className={styles.benefitsStrip10}
        aria-label="Benefícios"
        data-role="rl-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <ul ref={railRef} className={styles.list} onScroll={medir}>
          {benefits.map((b, i) => {
            const corpo = (
              <>
                {b.icon && ICONES[b.icon] && (
                  <span className={styles.icon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      {ICONES[b.icon]}
                    </svg>
                  </span>
                )}
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
                  <a className={styles.link} href={b.url}>
                    {corpo}
                  </a>
                ) : (
                  corpo
                )}
              </li>
            );
          })}
        </ul>
        {benefits.length > 1 && (
          <div className={styles.dots} aria-hidden="true">
            {benefits.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot}${i === atual ? ` ${styles.dotOn}` : ''}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
