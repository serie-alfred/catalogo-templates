// RulerBanner.jsx
import React from 'react';
import styles from './index.module.css';

const rulerItems = [
  {
    text: 'Bônus primeira compra',
    title: '10% OFF 1ª Compra',
    type: 'shipping', // para aplicar classes específicas, ex: item--shipping
  },
  {
    text: 'Bônus primeira compra',
    title: '10% OFF 1ª Compra',
  },
  {
    text: 'Bônus primeira compra',
    title: '10% OFF 1ª Compra',
  },
  {
    text: 'Bônus primeira compra',
    title: '10% OFF 1ª Compra',
  },
  {
    text: 'Bônus primeira compra',
    title: '10% OFF 1ª Compra',
  },
];

export default function Ruler() {
  return (
    <div className={styles.homeRuler}>
      <div className={`${styles.rulerContainer} component__container`}>
        <div className={`swiper ${styles.rulerSwiper}`}>
          <div className={styles.swiper__wrapper}>
            {rulerItems.map((item, index) => (
              <div className={styles.swiper__slide} key={index}>
                <div
                  className={`${styles.rulerItem} ${item.type ? styles[item.type] : ''}`}
                >
                  <div className={styles.itemIcon}>
                    {/* SVG fixo */}
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="43"
                        height="43"
                        rx="21.5"
                        stroke="#EFEFF0"
                      />
                      <path
                        d="M28.2497 26.5833C28.2497 27.7339 27.3169 28.6667 26.1663 28.6667C25.0158 28.6667 24.083 27.7339 24.083 26.5833C24.083 25.4327 25.0158 24.5 26.1663 24.5C27.3169 24.5 28.2497 25.4327 28.2497 26.5833Z"
                        stroke="#141414"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19.9167 26.5833C19.9167 27.7339 18.9839 28.6667 17.8333 28.6667C16.6827 28.6667 15.75 27.7339 15.75 26.5833C15.75 25.4327 16.6827 24.5 17.8333 24.5C18.9839 24.5 19.9167 25.4327 19.9167 26.5833Z"
                        stroke="#141414"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M24.0837 26.5859H19.917M13.667 15.3359H22.0003C23.1788 15.3359 23.7681 15.3359 24.1342 15.7021C24.5003 16.0682 24.5003 16.6574 24.5003 17.8359V24.9193M24.917 17.4193H26.4182C27.1096 17.4193 27.4552 17.4193 27.7418 17.5815C28.0283 17.7438 28.2062 18.0402 28.5619 18.633L29.9774 20.9922C30.1544 21.2872 30.2429 21.4348 30.2883 21.5985C30.3337 21.7623 30.3337 21.9343 30.3337 22.2784V24.5026C30.3337 25.2814 30.3337 25.6709 30.1662 25.9609C30.0565 26.1509 29.8987 26.3088 29.7087 26.4184C29.4186 26.5859 29.0292 26.5859 28.2503 26.5859M13.667 22.8359V24.5026C13.667 25.2814 13.667 25.6709 13.8345 25.9609C13.9442 26.1509 14.102 26.3088 14.292 26.4184C14.5821 26.5859 14.9715 26.5859 15.7503 26.5859"
                        stroke="#141414"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.667 17.8359H18.667M13.667 20.3359H17.0003"
                        stroke="#141414"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className={styles.itemText}>
                    <span>
                      <b>{item.title}</b>
                      {item.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.swiperRulerButtonPrev}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 8L10 12L14 16"
              stroke="#141414"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className={styles.swiperRulerButtonNext}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 16L14 12L10 8"
              stroke="#141414"
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
