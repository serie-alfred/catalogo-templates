'use client';

import 'swiper/css';
import styles from './index.module.css';
import { useState } from 'react';

const items = [
  {
    icon: (
      <svg
        fill="none"
        height="24"
        viewBox="0 0 25 24"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 9V11"
          stroke="#122161"
          strokeWidth="1.5"
          strokeLinecap="round"
        ></path>
        <path
          d="M17.5 20C18.6046 20 19.5 19.1046 19.5 18C19.5 16.8954 18.6046 16 17.5 16C16.3954 16 15.5 16.8954 15.5 18C15.5 19.1046 16.3954 20 17.5 20Z"
          stroke="#122161"
          strokeWidth="1.5"
        ></path>
        <path
          d="M7.5 20C8.60457 20 9.5 19.1046 9.5 18C9.5 16.8954 8.60457 16 7.5 16C6.39543 16 5.5 16.8954 5.5 18C5.5 19.1046 6.39543 20 7.5 20Z"
          stroke="#122161"
          strokeWidth="1.5"
        ></path>
        <path
          d="M5.5 17.9724C4.40328 17.9178 3.7191 17.7546 3.23223 17.2678C2.5 16.5355 2.5 15.357 2.5 13V9C2.5 6.64298 2.5 5.46447 3.23223 4.73223C3.96447 4 5.14298 4 7.5 4H10.8C11.9168 4 12.4752 4 12.9271 4.14683C13.8404 4.44358 14.5564 5.15964 14.8532 6.07295C15 6.52485 15 7.08323 15 8.2C15 8.94451 15 9.31677 15.0979 9.61803C15.2957 10.2269 15.7731 10.7043 16.382 10.9021C16.6832 11 17.0555 11 17.8 11H22.5V13C22.5 15.357 22.5 16.5355 21.7678 17.2678C21.2809 17.7546 20.5967 17.9178 19.5 17.9724M9.5 18H15.5"
          stroke="#122161"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M15 6H16.8212C18.2766 6 19.0042 6 19.5964 6.35371C20.1886 6.70742 20.5336 7.34811 21.2236 8.6295L22.5 11"
          stroke="#122161"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M6.5 9V11"
          stroke="#122161"
          strokeWidth="1.5"
          strokeLinecap="round"
        ></path>
      </svg>
    ),
    title: 'Entrega Expressa',
    text: 'para todo o Brasil',
  },
  {
    icon: (
      <svg
        fill="none"
        height="24"
        viewBox="0 0 25 24"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 9C11.3954 9 10.5 9.67157 10.5 10.5C10.5 11.3284 11.3954 12 12.5 12C13.6046 12 14.5 12.6716 14.5 13.5C14.5 14.3284 13.6046 15 12.5 15M12.5 9C13.3708 9 14.1116 9.4174 14.3862 10M12.5 9V8M12.5 15C11.6292 15 10.8884 14.5826 10.6138 14M12.5 15V16"
          stroke="#122161"
          strokeLinecap="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M12.4982 2C9.49043 2 7.54018 4.01899 5.23371 4.7549C4.29589 5.05413 3.82697 5.20374 3.6372 5.41465C3.44743 5.62556 3.39186 5.93375 3.28072 6.55013C2.09143 13.146 4.6909 19.244 10.8903 21.6175C11.5564 21.8725 11.8894 22 12.5015 22C13.1135 22 13.4466 21.8725 14.1126 21.6175C20.3116 19.2439 22.9086 13.146 21.719 6.55013C21.6078 5.93364 21.5522 5.6254 21.3624 5.41449C21.1726 5.20358 20.7037 5.05405 19.7659 4.75499C17.4585 4.01915 15.5061 2 12.4982 2Z"
          stroke="#122161"
          strokeLinecap="round"
          strokeWidth="1.5"
          strokeLinejoin="round"
        ></path>
      </svg>
    ),
    title: 'Compra Segura',
    text: 'ambiente protegido',
    class: 'second',
  },
  {
    icon: (
      <svg
        fill="none"
        height="24"
        viewBox="0 0 25 24"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 5C18.8284 5 19.5 5.67157 19.5 6.5C19.5 7.32843 18.8284 8 18 8C17.1716 8 16.5 7.32843 16.5 6.5C16.5 5.67157 17.1716 5 18 5Z"
          stroke="#122161"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M3.27423 11.1439C2.27108 12.2643 2.2495 13.9546 3.17016 15.1437C4.99711 17.5033 6.99674 19.5029 9.35633 21.3298C10.5454 22.2505 12.2357 22.2289 13.3561 21.2258C16.3979 18.5022 19.1835 15.6559 21.8719 12.5279C22.1377 12.2187 22.3039 11.8397 22.3412 11.4336C22.5062 9.63798 22.8452 4.46467 21.4403 3.05974C20.0353 1.65481 14.862 1.99377 13.0664 2.15876C12.6603 2.19608 12.2813 2.36233 11.972 2.62811C8.84412 5.31646 5.99781 8.10211 3.27423 11.1439Z"
          stroke="#122161"
          strokeWidth="1.5"
        ></path>
        <path
          d="M14.2884 12.3685C14.3097 11.9675 14.4222 11.234 13.8125 10.6764M13.8125 10.6764C13.6238 10.5039 13.366 10.3482 13.0149 10.2245C11.7583 9.78153 10.2148 11.2639 11.3067 12.6208C11.8936 13.3502 12.3461 13.5745 12.3035 14.4028C12.2735 14.9854 11.7012 15.5942 10.9469 15.826C10.2916 16.0275 9.56876 15.7608 9.11156 15.2499C8.55332 14.6261 8.6097 14.0381 8.60492 13.7818M13.8125 10.6764L14.5006 9.98828M9.16131 15.3276L8.50781 15.9811"
          stroke="#122161"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    ),
    title: '5% de Desconto',
    text: 'no boleto bancário',
    class: 'third',
  },
  {
    icon: (
      <svg
        fill="none"
        height="24"
        viewBox="0 0 25 24"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 5.5H10C6.28672 5.5 3.5 8.18503 3.5 12"
          stroke="#122161"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M4 18.5H15C18.7133 18.5 21.5 15.815 21.5 12"
          stroke="#122161"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M19 3C19 3 21.5 4.84122 21.5 5.50002C21.5 6.15882 19 8 19 8"
          stroke="#122161"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M5.99998 16C5.99998 16 3.50001 17.8412 3.5 18.5C3.49999 19.1588 6 21 6 21"
          stroke="#122161"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
      </svg>
    ),
    title: 'Troca Fácil',
    text: '30 dias para troca',
  },
];

export default function Ruler() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev: number) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev: number) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={styles.home__ruler}>
      <div className={styles.ruler__container}>
        <div className={styles.ruler__swiper}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${item.class} ${styles.ruler__item} ${
                index === current ? styles.active : ''
              }`}
            >
              <div className={styles.item__icon}>{item.icon}</div>
              <div className={styles.item__text}>
                <span>
                  <b>{item.title}</b>
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className={styles['swiper-ruler-button-prev']}
          onClick={handlePrev}
        >
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
        <div
          className={styles['swiper-ruler-button-next']}
          onClick={handleNext}
        >
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
    </section>
  );
}
