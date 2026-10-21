import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip09` do faststore.starter (família 09, Editorial;
 * desenho `Ruler09`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 */

type Icone = 'truck' | 'exchange' | 'card' | 'shield';

const ICONES: Record<Icone, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

const BENEFICIOS: { icon: Icone; title: string; text: string }[] = [
  { icon: 'truck', title: 'Frete grátis acima de R$ 399', text: 'Para todo o Brasil' },
  { icon: 'exchange', title: 'Troca fácil em 30 dias', text: 'Solicite pelo site' },
  { icon: 'card', title: 'Até 6x sem juros', text: 'No cartão de crédito' },
  { icon: 'shield', title: 'Compra segura', text: 'Ambiente protegido' },
];

export default function Ruler09() {
  return (
    <div className={styles.benefitsStrip09Box}>
      <section className={styles.benefitsStrip09} aria-label="Benefícios" data-role="rl-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <ul className={styles.list}>
            {BENEFICIOS.map(b => (
              <li key={b.title} className={styles.item} data-role="rl-item">
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  {ICONES[b.icon]}
                </svg>
                <span className={styles.copy}>
                  <span className={styles.title}>{b.title}</span>
                  <span className={styles.text}>{b.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
