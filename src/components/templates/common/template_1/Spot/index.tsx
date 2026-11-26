import React from 'react';

import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

import './index.css';

/** O que o card desenha (a Tray entrega o produto já pronto; aqui, só o que a tela mostra). */
export type Produto01 = {
  name: string;
  image: string;
  hoverImage: string;
  badge: string;
  listPrice: number;
  price: number;
  installments: number;
  installmentValue: number;
};

const num = (n: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Um produto da LOJA (`useProdutosDaLoja`) no formato deste card. */
export function deProduto01(p: ProdutoNormal): Produto01 {
  return {
    name: p.name,
    image: p.images[0] ?? 'https://placehold.co/348',
    hoverImage: p.images[1] ?? p.images[0] ?? 'https://placehold.co/348',
    badge: p.badge,
    listPrice: p.listPrice,
    price: p.price,
    installments: p.installments,
    installmentValue: p.installmentValue,
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
  const p = escolhido ? deProduto01(escolhido) : null;
  const desconto =
    p && p.listPrice > p.price
      ? Math.round((1 - p.price / p.listPrice) * 100)
      : 0;
  return (
    <div itemID="1" className="product spot" data-spot="Spot01">
      <div className="product-wrapper">
        {/* product image */}
        <div className="product-image">
          <a href="#">
            <img
              className="lazy"
              src={p ? p.image : 'https://placehold.co/348'}
              alt={p ? p.name : 'Imagem do produto Falso'}
              width="348"
              height="348"
            />
            <img
              className="image__overlay lazy"
              src={p ? p.hoverImage : 'https://placehold.co/348'}
              alt={p ? p.name : 'Imagem do produto Falso'}
              width="348"
              height="348"
            />
          </a>

          <div className="product-tag">
            {(!p || p.badge) && (
              <div className="tag-featured">
                <span>{p ? p.badge : 'Oferta'}</span>
              </div>
            )}
            {!p && (
              <div className="tag-new">
                <span>Novo</span>
              </div>
            )}
            {(!p || desconto > 0) && (
              <div className="tag-discount">
                <span>-{p ? desconto : 20}%</span>
              </div>
            )}
          </div>
        </div>

        {/* product content */}
        <div className="product-content">
          {/* stars */}
          <div className="product-stars">
            {[1, 2, 3, 4, 5].map(rating => (
              <svg
                key={rating}
                fill="none"
                height="12"
                width="12"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.00777 1.01041L8.03432 3.08048C8.17432 3.36864 8.54759 3.64504 8.86259 3.69797L10.7232 4.00965C11.9131 4.20961 12.1931 5.07998 11.3356 5.93859L9.88914 7.39704C9.64414 7.64403 9.51003 8.12038 9.58581 8.46151L9.99998 10.2669C10.3266 11.696 9.57414 12.2488 8.32015 11.5019L6.57616 10.461C6.26122 10.2728 5.74211 10.2728 5.42128 10.461L3.67732 11.5019C2.42913 12.2488 1.67088 11.6901 1.99751 10.2669L2.41163 8.46151C2.48745 8.12038 2.3533 7.64403 2.10833 7.39704L0.661824 5.93859C-0.189749 5.07998 0.0843885 4.20961 1.27425 4.00965L3.13488 3.69797C3.44402 3.64504 3.81731 3.36864 3.95729 3.08048L4.98383 1.01041C5.54378 -0.112844 6.45366 -0.112844 7.00777 1.01041Z"
                  fill={rating <= 4 ? '#FFCD29' : '#B8B8B8'}
                />
              </svg>
            ))}
            <span>(12) avaliações</span>
          </div>

          {/* title */}
          <div className="product-title">
            <h3 itemProp="name">
              <a href="#">{p ? p.name : 'Produto de Exemplo'}</a>
            </h3>
          </div>

          {/* product-payment.html */}
          <div className="product-price-wrapper">
            <div className="product-price">
              {/* price.html */}
              <div className="t prices">
                {(!p || p.listPrice > p.price) && (
                  <div className="price-before strike">
                    <abbr className="currency" title="BRL">
                      R$
                    </abbr>
                    <span>{p ? num(p.listPrice) : '199,90'}</span>
                  </div>
                )}

                <div className="price-promotion">
                  <div className="price-off">
                    <abbr className="currency" title="BRL">
                      R$
                    </abbr>
                    <span>{p ? num(p.price) : '159,90'}</span>
                  </div>
                </div>

                {(!p || p.installments > 0) && (
                  <div className="product-payment">
                    <span>
                      {p
                        ? `ou ${p.installments}x de R$ ${num(p.installmentValue)}`
                        : 'ou 6x de R$ 10,71 com juros'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* comprar */}
          <div className="product-buy">
            <a href="#">Comprar</a>
          </div>

          {/* metas */}
          <meta itemProp="productID" content="1" />
          <meta itemProp="sku" content="1" />
          <meta itemProp="gtin14" content="12345678901234" />
          <meta
            itemProp="description"
            content="Descrição curta do produto exemplo"
          />
          <span
            itemProp="brand"
            itemScope
            itemType="http://schema.org/Organization"
          >
            <meta itemProp="name" content="Marca Exemplo" />
          </span>
        </div>
      </div>
    </div>
  );
}
