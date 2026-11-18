import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard07` do faststore.starter — o card da vitrine e
 * da PLP do 07.
 *
 * O componente que estava neste slot era de OUTRA família: card de calçado com
 * seletor de tamanho no hover e sem botão "Comprar", enquanto o `path` do
 * layoutData sempre apontou para `molecules/ProductCard07`. O cliente escolhia
 * um card e o gerador entregava outro.
 *
 * O que sai em relação à origem, e por quê:
 *  • `useBuyButton` → o "Comprar" é um <button> inerte, o preview não vende;
 *  • `useWishList`/`useAuth` → o coração é estático (estado não-favoritado);
 *  • `bestInstallment`/`formatPix` → parcela e Pix são texto fixo, já formatado.
 *
 * Fica o que define a APARÊNCIA: caixa em coluna com o botão colado na base
 * (`.fill`), preço "de" riscado, linha de parcela com altura reservada e o
 * recorte de 2 linhas no título.
 */
/** O que o card desenha (texto já formatado). A PLP 07 passa os produtos dela. */
export interface ProdutoCard07 {
  brand?: string;
  title: string;
  image?: string;
  flag?: string;
  flagVariant?: 'gold' | 'sale';
  listPrice?: string;
  price: string;
  installment?: string;
  pix?: string;
}

const produtoPadrao: ProdutoCard07 = {
  brand: 'Tapete Belga',
  title: 'Tapete Essence Clássico 2,00m × 2,50m',
  image: 'https://placehold.co/428',
  flag: '−20%',
  listPrice: 'R$ 1.099,90',
  price: 'R$ 879,90',
  installment: 'ou 10× de R$ 87,99 sem juros',
  pix: 'R$ 835,91 no Pix',
};

const HeartIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function Spot() {
  return <ProductCard07 />;
}

/**
 * O card 07 com os produtos de quem o usa: é o que a PLP 07 (`CategoryMain07`) desenha
 * quando o card da loja é o 07 ou nenhum (o starter faz o mesmo com o ProductCard07).
 */
export function ProductCard07({ produto = produtoPadrao }: { produto?: ProdutoCard07 }) {
  return (
    <div className={styles.card} data-role="ps-card" data-spot="Spot07">
      <div
        className={styles.img}
        data-role="ps-img"
        style={produto.image ? { backgroundImage: `url(${produto.image})` } : undefined}
      >
        {produto.flag && (
          <span
            className={`${styles.flag} ${produto.flagVariant === 'gold' ? styles.flagGold : styles.flagSale}`}
            data-role="ps-flag"
          >
            {produto.flag}
          </span>
        )}
        <button
          type="button"
          className={styles.wish}
          data-role="ps-wish"
          aria-label="Adicionar à lista de desejos"
        >
          <HeartIcon />
        </button>
      </div>

      <div className={styles.cardBody}>
        {produto.brand && (
          <p className={styles.brand} data-role="ps-brand">
            {produto.brand}
          </p>
        )}
        <h3 className={styles.cardTitle} data-role="ps-cardtitle">
          {produto.title}
        </h3>

        <div className={styles.priceRow}>
          {produto.listPrice && (
            <span className={styles.listPrice} data-role="ps-listprice">
              {produto.listPrice}
            </span>
          )}
          <p className={styles.price} data-role="ps-price">
            {produto.price}
          </p>
        </div>

        {/* altura reservada mesmo sem parcelamento — ver .installment no CSS */}
        <p className={styles.installment} data-role="ps-installment">
          {produto.installment}
        </p>
        {produto.pix && (
          <p className={styles.pix} data-role="ps-pix">
            {produto.pix}
          </p>
        )}

        <span className={styles.fill} aria-hidden="true" />
        <button type="button" className={styles.buy} data-role="ps-buy">
          Comprar
        </button>
      </div>
    </div>
  );
}
