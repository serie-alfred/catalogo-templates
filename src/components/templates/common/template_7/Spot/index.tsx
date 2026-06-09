import styles from './index.module.css';

export default function Spot() {
  return (
    <div className={styles.containerCards}>
      <div className={styles.carousel}>
        <div className={`${styles.btnCarousel} ${styles.btnBack}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
        <div className={styles.spot}>
          <div className={styles.tagDiscount}>5% off</div>
          <div className={styles.productImage}>
            <img src="https://placehold.co/428" alt="teste" />
          </div>
          <div className={styles.infoProduct}>
            <p>Lorem Ipsum Dolor Sit</p>
            <div className={styles.price}>
              <p className={styles.priceBefore}>R$599,00</p>
              <p className={styles.priceAfter}>R$299,00</p>
            </div>
            <p className={styles.installments}>
              2x<span> de </span> R$99,00 <span>sem juros</span>
            </p>
          </div>
        </div>
        <div className={styles.spot}>
          <div className={styles.tagDiscount}>5% off</div>
          <div className={styles.productImage}>
            <img src="https://placehold.co/428" alt="teste" />
          </div>
          <div className={styles.infoProduct}>
            <p>Lorem Ipsum Dolor Sit</p>
            <div className={styles.price}>
              <p className={styles.priceBefore}>R$599,00</p>
              <p className={styles.priceAfter}>R$299,00</p>
            </div>
            <p className={styles.installments}>
              2x<span> de</span> R$99,00 <span>sem juros</span>
            </p>
          </div>
        </div>
        <div className={styles.spot}>
          <div className={styles.tagDiscount}>5% off</div>
          <div className={styles.productImage}>
            <img src="https://placehold.co/428" alt="teste" />
          </div>
          <div className={styles.infoProduct}>
            <p>Lorem Ipsum Dolor Sit</p>
            <div className={styles.price}>
              <p className={styles.priceBefore}>R$599,00</p>
              <p className={styles.priceAfter}>R$299,00</p>
            </div>
            <p className={styles.installments}>
              2x<span> de</span> R$99,00 <span>sem juros</span>
            </p>
          </div>
        </div>
        <div className={styles.spot}>
          <div className={styles.tagDiscount}>5% off</div>
          <div className={styles.productImage}>
            <img src="https://placehold.co/428" alt="teste" />
          </div>
          <div className={styles.infoProduct}>
            <p>Lorem Ipsum Dolor Sit</p>
            <div className={styles.price}>
              <p className={styles.priceBefore}>R$599,00</p>
              <p className={styles.priceAfter}>R$299,00</p>
            </div>
            <p className={styles.installments}>
              2x<span> de</span> R$99,00 <span>sem juros</span>
            </p>
          </div>
        </div>
        <div className={`${styles.btnCarousel} ${styles.btnNext}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
      <div className={styles.carouselBullets}>
        <div className={styles.bullet}></div>
        <div className={styles.bullet}></div>
      </div>
    </div>
  );
}
