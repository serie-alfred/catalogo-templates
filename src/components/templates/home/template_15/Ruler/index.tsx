import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip15` do faststore.starter (família 15, Luxo; desenho
 * `Ruler15` / `Ruler15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 */
type Icone = 'gift' | 'shield' | 'card' | 'diamond';

interface Beneficio {
  icon?: Icone;
  title?: string;
  text?: string;
  url?: string;
}

const BENEFICIOS: Beneficio[] = [
  { icon: 'gift', title: 'Embalagem presente', text: 'Estojo e cartão escrito à mão' },
  { icon: 'shield', title: 'Entrega segura', text: 'Seguro total e rastreio' },
  { icon: 'card', title: 'Até 10x sem juros', text: 'Em todos os cartões' },
  { icon: 'diamond', title: 'Certificado', text: 'Garantia de origem das pedras' },
];

const ICONES: Record<Icone, React.ReactNode> = {
  gift: <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1" />,
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  diamond: (
    <>
      <path d="M6 4h12l3 5-9 11L3 9z" />
      <path d="M3 9h18" />
    </>
  ),
};

export default function Ruler15() {
  const benefits = BENEFICIOS;
  return (
    <div className={styles.benefitsStrip15Box}>
      <section className={styles.benefitsStrip15} aria-label="Benefícios" data-role="rl-root">
        <link rel="stylesheet" href={FONTES_15} />
        <ul className={styles.list}>
          {benefits.map((b, i) => {
            const corpo = (
              <>
                {b.icon && ICONES[b.icon] && (
                  <span className={styles.icon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                      {ICONES[b.icon]}
                    </svg>
                  </span>
                )}
                <span className={styles.copy}>
                  {b.title && (
                    <span className={styles.title} data-role="rl-title">
                      {b.title}
                    </span>
                  )}
                  {b.text && (
                    <span className={styles.text} data-role="rl-text">
                      {b.text}
                    </span>
                  )}
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
      </section>
    </div>
  );
}
