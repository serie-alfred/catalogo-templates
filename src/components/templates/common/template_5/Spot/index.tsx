import styles from './index.module.css';

// Preview estático do ProductCard05 (VTEX FastStore). Dados fixos só para
// visualização no catálogo — sem hooks, GraphQL, wishlist ou rating dinâmico.
const data = {
  name: 'Mochila Urbana Resistente',
  image: 'https://placehold.co/348',
  badge: 'NOVO',
  rating: '4.8',
  listPrice: 'R$ 459,90',
  price: 'R$ 367,90',
  discount: '-20%',
  installments: '8x 45,98 sem juros',
};

export default function Spot() {
  return (
    <div className={styles.card}>
      <div className={styles.card__topbar}>
        <div className={styles.card__rating}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#F2C94C"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className={styles.card__ratingvalue}>{data.rating}</span>
        </div>

        <div className={styles.card__actions}>
          <button type="button" className={styles.card__action} aria-label="Adicionar ao carrinho">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_spot05_cart)">
                <path
                  d="M1.53711 1.53748H3.03711L3.84025 5.28748M3.84025 5.28748L5.03211 10.8525C5.10529 11.1936 5.29511 11.4986 5.56889 11.7149C5.84267 11.9312 6.18329 12.0452 6.53211 12.0375H13.8671C14.2085 12.0369 14.5395 11.9199 14.8054 11.7059C15.0713 11.4918 15.2562 11.1934 15.3296 10.86L16.5671 5.28748H3.84025ZM6.74961 15.75C6.74961 16.1642 6.41382 16.5 5.99961 16.5C5.5854 16.5 5.24961 16.1642 5.24961 15.75C5.24961 15.3358 5.5854 15 5.99961 15C6.41382 15 6.74961 15.3358 6.74961 15.75ZM14.9996 15.75C14.9996 16.1642 14.6638 16.5 14.2496 16.5C13.8354 16.5 13.4996 16.1642 13.4996 15.75C13.4996 15.3358 13.8354 15 14.2496 15C14.6638 15 14.9996 15.3358 14.9996 15.75Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_spot05_cart">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <button type="button" className={styles.card__action} aria-label="Adicionar à lista de desejos">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.5 7.12503C1.50002 6.29043 1.7532 5.47547 2.2261 4.78778C2.699 4.10009 3.36939 3.57202 4.14871 3.27333C4.92803 2.97464 5.77962 2.91936 6.59101 3.11481C7.4024 3.31026 8.13542 3.74724 8.69325 4.36803C8.73254 4.41004 8.78004 4.44353 8.83281 4.46643C8.88557 4.48933 8.94248 4.50114 9 4.50114C9.05752 4.50114 9.11443 4.48933 9.16719 4.46643C9.21996 4.44353 9.26746 4.41004 9.30675 4.36803C9.86283 3.74321 10.596 3.30256 11.4087 3.10473C12.2214 2.90691 13.0751 2.96129 13.8562 3.26064C14.6372 3.56 15.3085 4.09012 15.7808 4.78046C16.2531 5.47079 16.504 6.2886 16.5 7.12503C16.5 8.84253 15.375 10.125 14.25 11.25L10.131 15.2348C9.99125 15.3953 9.81895 15.5242 9.62553 15.613C9.43212 15.7018 9.22203 15.7484 9.00922 15.7498C8.7964 15.7511 8.58574 15.7072 8.39122 15.6208C8.19669 15.5345 8.02277 15.4078 7.881 15.249L3.75 11.25C2.625 10.125 1.5 8.85003 1.5 7.12503Z"
                stroke="#141414"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <a href="#" className={styles.card__image} onClick={e => e.preventDefault()}>
        <img src={data.image} alt={data.name} loading="lazy" />
        <div className={styles.card__badge}>
          <span>{data.badge}</span>
        </div>
      </a>

      <div className={styles.card__info}>
        <h3 className={styles.card__name}>
          <a href="#" onClick={e => e.preventDefault()}>
            {data.name}
          </a>
        </h3>

        <div className={styles.card__pricerow}>
          <span className={styles.card__listprice}>{data.listPrice}</span>
          <span className={styles.card__discountbadge}>{data.discount}</span>
        </div>

        <p className={styles.card__price}>{data.price}</p>

        <p className={styles.card__installments}>{data.installments}</p>
      </div>
    </div>
  );
}
