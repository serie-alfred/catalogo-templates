// RulerBanner.jsx
import React from 'react';
import styles from './index.module.css';

type RulerIcon = 'entrega' | 'cartao' | 'seguranca' | 'troca' | 'promocao';

// Um ícone por benefício, como o bloco ruler_02 da Wake (o lojista escolhe o ícone de cada um no
// Design Studio; estes são os padrões da posição).
const rulerItems: { title: string; text: string; icon: RulerIcon; type?: string }[] = [
  { title: 'Entrega Expressa', text: 'para todo o Brasil', icon: 'entrega', type: 'shipping' },
  { title: 'Parcele em até 10x', text: 'sem juros no cartão', icon: 'cartao' },
  { title: 'Compra Segura', text: 'site 100% protegido', icon: 'seguranca' },
  { title: 'Troca Fácil', text: 'em até 30 dias', icon: 'troca' },
  { title: '10% OFF 1ª Compra', text: 'bônus primeira compra', icon: 'promocao' },
];

const TRACO = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Glifos 24×24 deslocados para o centro do círculo de 44px (o caminhão já vem nas coordenadas de 44).
const GLIFOS: Record<Exclude<RulerIcon, 'entrega'>, string[]> = {
  cartao: [
    'M5 7.5h14a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 15V9A1.5 1.5 0 0 1 5 7.5Z',
    'M3.5 10.5h17M7 13.5h3',
  ],
  seguranca: [
    'M12 3.5l6.5 2.5v5c0 4.2-2.8 7.6-6.5 9-3.7-1.4-6.5-4.8-6.5-9V6L12 3.5Z',
    'M9.25 12l2 2 3.5-3.75',
  ],
  troca: [
    'M5 10a7 7 0 0 1 12.3-3.2M18 4v3.5h-3.5',
    'M19 14a7 7 0 0 1-12.3 3.2M6 20v-3.5h3.5',
  ],
  promocao: [
    'M4 12.2V5.5A1.5 1.5 0 0 1 5.5 4h6.7a1.5 1.5 0 0 1 1.06.44l6.3 6.3a1.5 1.5 0 0 1 0 2.12l-6.7 6.7a1.5 1.5 0 0 1-2.12 0l-6.3-6.3A1.5 1.5 0 0 1 4 12.2Z',
    'M8.5 7.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
  ],
};

function RulerIconSvg({ icon }: { icon: RulerIcon }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="" />
      {icon === 'entrega' ? (
        <>
          <path
            d="M28.2497 26.5833C28.2497 27.7339 27.3169 28.6667 26.1663 28.6667C25.0158 28.6667 24.083 27.7339 24.083 26.5833C24.083 25.4327 25.0158 24.5 26.1663 24.5C27.3169 24.5 28.2497 25.4327 28.2497 26.5833Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M19.9167 26.5833C19.9167 27.7339 18.9839 28.6667 17.8333 28.6667C16.6827 28.6667 15.75 27.7339 15.75 26.5833C15.75 25.4327 16.6827 24.5 17.8333 24.5C18.9839 24.5 19.9167 25.4327 19.9167 26.5833Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M24.0837 26.5859H19.917M13.667 15.3359H22.0003C23.1788 15.3359 23.7681 15.3359 24.1342 15.7021C24.5003 16.0682 24.5003 16.6574 24.5003 17.8359V24.9193M24.917 17.4193H26.4182C27.1096 17.4193 27.4552 17.4193 27.7418 17.5815C28.0283 17.7438 28.2062 18.0402 28.5619 18.633L29.9774 20.9922C30.1544 21.2872 30.2429 21.4348 30.2883 21.5985C30.3337 21.7623 30.3337 21.9343 30.3337 22.2784V24.5026C30.3337 25.2814 30.3337 25.6709 30.1662 25.9609C30.0565 26.1509 29.8987 26.3088 29.7087 26.4184C29.4186 26.5859 29.0292 26.5859 28.2503 26.5859M13.667 22.8359V24.5026C13.667 25.2814 13.667 25.6709 13.8345 25.9609C13.9442 26.1509 14.102 26.3088 14.292 26.4184C14.5821 26.5859 14.9715 26.5859 15.7503 26.5859"
            {...TRACO}
          />
          <path d="M13.667 17.8359H18.667M13.667 20.3359H17.0003" {...TRACO} />
        </>
      ) : (
        <g transform="translate(10 10)">
          {GLIFOS[icon].map((d) => (
            <path key={d} d={d} {...TRACO} />
          ))}
        </g>
      )}
    </svg>
  );
}

export default function Ruler() {
  return (
    <div className={styles.homeRuler} data-role="ruler">
      <div className={`${styles.rulerContainer} component__container`}>
        <div className={`swiper ${styles.rulerSwiper}`}>
          <div className={styles.swiper__wrapper}>
            {rulerItems.map((item, index) => (
              <div className={styles.swiper__slide} key={index} data-role="ruler-item">
                <div
                  className={`${styles.rulerItem} ${item.type ? styles[item.type] : ''}`}
                >
                  <div className={styles.itemIcon} data-role="ruler-icon">
                    <RulerIconSvg icon={item.icon} />
                  </div>

                  <div className={styles.itemText}>
                    <span data-role="ruler-text">
                      <b data-role="ruler-title">{item.title}</b>
                      {item.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.swiperRulerButtonPrev} data-role="ruler-prev">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 8L10 12L14 16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className={styles.swiperRulerButtonNext} data-role="ruler-next">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 16L14 12L10 8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
