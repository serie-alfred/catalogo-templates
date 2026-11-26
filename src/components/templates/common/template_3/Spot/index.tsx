import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import { emReais, type ProdutoNormal } from '@/utils/produtos';

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

/** O que o card desenha (o que a tela mostra, já pronto). */
export type Produto03 = {
  name: string;
  image: string;
  listPrice: string;
  price: string;
  installments: string;
  /** Vazio some (sem desconto). */
  discount: string;
  /** Vazio some (sem parcelamento). */
  installmentCount: number;
  sizes: string[];
};

/** Um produto da LOJA (`useProdutosDaLoja`) no formato deste card. */
export function deProduto03(p: ProdutoNormal): Produto03 {
  const desconto = p.listPrice > p.price;
  // O card desenha uma linha de tamanhos: o 1º grupo de variação em texto.
  const tamanhos = p.variants.find(v => v.tipo === 'texto');
  return {
    name: p.name,
    image: p.images[0] ?? 'https://placehold.co/348',
    listPrice: desconto ? emReais(p.listPrice) : '',
    price: emReais(p.price),
    installments: emReais(p.installmentValue),
    discount: desconto
      ? `${Math.round((1 - p.price / p.listPrice) * 100)}% OFF`
      : p.badge,
    installmentCount: p.installments,
    sizes: tamanhos ? tamanhos.options.map(o => o.label).filter(Boolean) : [],
  };
}

export default function Spot({
  soCard = false,
  produto,
}: {
  soCard?: boolean;
  /** O produto da loja do slot (a lista passa um por slot). */
  produto?: ProdutoNormal;
}) {
  const daLoja = useProdutosDaLoja();
  // Item do catálogo (fora de lista): o 1º produto da loja; numa lista sem produto, o mock.
  const escolhido = produto ?? (soCard ? undefined : daLoja?.[0]);
  const loja = escolhido ? deProduto03(escolhido) : null;
  const d = loja ?? {
    ...data,
    installmentCount: 2,
  };
  return (
    <div className={styles.card} data-spot="Spot03">
      <div className={styles.card__image}>
        <a href="#" onClick={e => e.preventDefault()}>
          <img src={d.image} alt={d.name} loading="lazy" />
        </a>

        {d.discount && (
          <div className={styles.card__badge}>
            <span>{d.discount}</span>
          </div>
        )}

        {d.sizes.length > 0 && (
          <div className={styles.card__sizes}>
            {d.sizes.map(size => (
              <button key={size} type="button" className={styles.card__size}>
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.card__info}>
        <h3 className={styles.card__name}>
          <a href="#" onClick={e => e.preventDefault()}>
            {d.name}
          </a>
        </h3>

        <div className={styles.card__prices}>
          {d.listPrice && (
            <>
              <span className={styles.card__listprice}>{d.listPrice}</span>
              <span className={styles.card__separator} aria-hidden="true" />
            </>
          )}
          <span className={styles.card__price}>{d.price}</span>
        </div>

        {d.installmentCount > 0 && (
          <p className={styles.card__installments}>
            <strong>{d.installmentCount}x</strong>
            {' de '}
            <strong>{d.installments}</strong> sem juros
          </p>
        )}
      </div>
    </div>
  );
}
