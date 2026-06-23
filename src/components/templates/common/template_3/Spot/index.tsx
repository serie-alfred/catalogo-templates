import styles from './index.module.css';

// Preview estático do ProductCard03 (VTEX FastStore). Dados fixos só para
// visualização no catálogo — sem hooks, GraphQL ou lógica de carrinho.
const data = {
  name: 'Tênis Esportivo Confort Run',
  image: 'https://placehold.co/348',
  listPrice: 'R$599,00',
  price: 'R$299,00',
  installments: 'R$149,50',
  discount: '50% OFF',
  sizes: ['39', '40', '41', '42', '43', '44'],
};

export default function Spot() {
  return (
    <div className={styles.card}>
      <div className={styles.card__image}>
        <a href="#" onClick={e => e.preventDefault()}>
          <img src={data.image} alt={data.name} loading="lazy" />
        </a>

        <div className={styles.card__badge}>
          <span>{data.discount}</span>
        </div>

        <div className={styles.card__sizes}>
          {data.sizes.map(size => (
            <button key={size} type="button" className={styles.card__size}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.card__info}>
        <h3 className={styles.card__name}>
          <a href="#" onClick={e => e.preventDefault()}>
            {data.name}
          </a>
        </h3>

        <div className={styles.card__prices}>
          <span className={styles.card__listprice}>{data.listPrice}</span>
          <span className={styles.card__separator} aria-hidden="true" />
          <span className={styles.card__price}>{data.price}</span>
        </div>

        <p className={styles.card__installments}>
          <strong>2x</strong> de <strong>{data.installments}</strong> sem juros
        </p>
      </div>
    </div>
  );
}
