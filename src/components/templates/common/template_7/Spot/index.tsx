import styles from './index.module.css';

export default function Spot() {
  return (
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
  );
}
