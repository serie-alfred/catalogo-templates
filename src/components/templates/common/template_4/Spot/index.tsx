import styles from './index.module.css';

// Preview estático do ProductCard04 (VTEX FastStore). Dados fixos só para
// visualização no catálogo — sem hooks, GraphQL ou seletor de quantidade.
const data = {
  name: 'Camiseta Básica Premium',
  image: 'https://placehold.co/348',
  listPrice: 'R$ 199,90',
  price: 'R$ 159,90',
  discount: '-20%',
};

export default function Spot() {
  return (
    <div className={styles.card}>
      <a
        href="#"
        className={styles.card__image}
        onClick={e => e.preventDefault()}
      >
        <img src={data.image} alt={data.name} loading="lazy" />
      </a>

      <div className={styles.card__info}>
        <h3 className={styles.card__name}>
          <a href="#" onClick={e => e.preventDefault()}>
            {data.name}
          </a>
        </h3>

        <div className={styles.card__pricerow}>
          <span className={styles.card__listprice}>{data.listPrice}</span>
          <span className={styles.card__badge}>{data.discount}</span>
        </div>

        <p className={styles.card__price}>{data.price}</p>

        <button type="button" className={styles.card__btn}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.87939 1.87918H3.71273L4.69434 6.46251M4.69434 6.46251L6.15106 13.2642C6.24051 13.6811 6.47251 14.0539 6.80713 14.3182C7.14175 14.5826 7.55806 14.722 7.98439 14.7125H16.9494C17.3666 14.7118 17.7712 14.5689 18.0962 14.3072C18.4212 14.0455 18.6472 13.6808 18.7369 13.2733L20.2494 6.46251H4.69434ZM8.25023 19.25C8.25023 19.7563 7.83982 20.1667 7.33356 20.1667C6.8273 20.1667 6.41689 19.7563 6.41689 19.25C6.41689 18.7438 6.8273 18.3333 7.33356 18.3333C7.83982 18.3333 8.25023 18.7438 8.25023 19.25ZM18.3336 19.25C18.3336 19.7563 17.9232 20.1667 17.4169 20.1667C16.9106 20.1667 16.5002 19.7563 16.5002 19.25C16.5002 18.7438 16.9106 18.3333 17.4169 18.3333C17.9232 18.3333 18.3336 18.7438 18.3336 19.25Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          ADICIONAR
        </button>
      </div>
    </div>
  );
}
