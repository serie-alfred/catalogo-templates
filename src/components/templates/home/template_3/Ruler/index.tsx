import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip07` do faststore.starter — faixa de benefícios
 * do 07: 4 itens (ícone + título + subtítulo), grid 4-col no desktop e 2-col
 * no mobile, com conteúdos diferentes por breakpoint.
 *
 * A origem alterna desktop/mobile por `@media`; aqui vira `@container`, porque o
 * que manda no gerador é a largura do canvas (1440 / 375), não a da janela. Os
 * `data-role` são os mesmos da origem de propósito: é por eles que o portão de
 * fidelidade casa nó a nó os dois lados.
 */
type BenefitIcon = 'truck' | 'card' | 'shield' | 'pix';

interface BenefitItem {
  icon: BenefitIcon;
  title: string;
  subtitle: string;
}

const benefits: BenefitItem[] = [
  { icon: 'truck', title: 'Frete grátis', subtitle: 'Sul e Sudeste acima de R$699' },
  { icon: 'card', title: 'Até 10× sem juros', subtitle: 'Nos principais cartões' },
  { icon: 'shield', title: 'Compra segura', subtitle: 'Ambiente 100% protegido' },
  { icon: 'pix', title: '5% no Pix', subtitle: 'Desconto direto no pagamento' },
];

const benefitsMobile: BenefitItem[] = [
  { icon: 'truck', title: 'Frete grátis', subtitle: 'Sul/Sudeste +R$699' },
  { icon: 'card', title: '10× sem juros', subtitle: 'Principais cartões' },
  { icon: 'shield', title: 'Compra segura', subtitle: '100% protegido' },
  { icon: 'pix', title: '5% no Pix', subtitle: 'Desconto imediato' },
];

function Icon({ icon, size }: { icon: BenefitIcon; size: number }) {
  if (icon === 'pix') {
    return (
      <span
        className={styles.pixIcon}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <span className={styles.pixText}>PIX</span>
      </span>
    );
  }

  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    'aria-hidden': true,
  } as const;

  if (icon === 'card') {
    return (
      <svg {...common}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    );
  }

  if (icon === 'shield') {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 5v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export default function Ruler() {
  return (
    <div className={styles.benefitsStrip07Root}>
      <div className={styles.desktop}>
        <div className={styles.strip} data-role="bstrip">
          {benefits.map((b, i) => (
            <div className={styles.benefit} data-role="benefit" key={i}>
              <span className={styles.icon}>
                <Icon icon={b.icon} size={28} />
              </span>
              <div>
                <p className={styles.bTitle} data-role="b-title">
                  {b.title}
                </p>
                <p className={styles.bSubtitle} data-role="b-subtitle">
                  {b.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mobile}>
        <div className={styles.mStrip} data-role="m-bstrip">
          {benefitsMobile.map((b, i) => (
            <div className={styles.mBenefit} data-role="m-benefit" key={i}>
              <span className={styles.mIcon}>
                <Icon icon={b.icon} size={20} />
              </span>
              <div>
                <p className={styles.mBTitle} data-role="m-b-title">
                  {b.title}
                </p>
                <p className={styles.mBSubtitle} data-role="m-b-subtitle">
                  {b.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
