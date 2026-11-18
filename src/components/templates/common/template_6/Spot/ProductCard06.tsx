'use client';

import React, { useState } from 'react';
import styles from './ProductCard06.module.css';

/**
 * `molecules/ProductCard06` — o card da grade da PLP 06, com carrossel de fotos e dots. Morava
 * na réplica da PLP (category/template_6/CategoryMain), com o CSS; saiu de lá porque a lista só
 * dá o slot. A PLP o desenha sem Card de Produto escolhido ou com o Spot06 (`CardDaLoja
 * familia`): é mais fiel ao ProductCard06 que a réplica do Spot06, e as variáveis do Spot06
 * chegam pelo `data-spot`.
 */

export type ProdutoCard06 = {
  id: string;
  nome: string;
  preco: number;
  parcelaN: number;
  parcelaValor: number;
  imagens: string[];
  flag?: string;
  precoDe?: number;
};

const TAMANHOS = ['38', '39', '40', '41', '42'];

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const HeartIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5802 1.25524C13.787 2.42178 13.8332 4.29889 12.6852 5.5196L6.93292 11.6357L1.18142 5.51958C0.033424 4.29887 0.0796571 2.42174 1.28642 1.25519C2.63385 -0.0473233 4.85296 0.0716979 6.04335 1.51009L6.93332 2.58508L7.82253 1.50997C9.01291 0.0715756 11.2328 -0.0472817 12.5802 1.25524Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ProductCard06({ p, index }: { p: ProdutoCard06; index: number }) {
  /* a camada de hover abre na SEGUNDA foto, como na origem (hoverIdx = 1) */
  const [hoverIdx, setHoverIdx] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [fav, setFav] = useState(false);

  const temDesconto = !!p.precoDe && p.precoDe > p.preco;
  const flags = [p.flag || (temDesconto ? `OFF ${Math.round(((p.precoDe! - p.preco) / p.precoDe!) * 100)}%` : '')].filter(Boolean);

  return (
    <section className={styles.card} data-role="card" data-spot="Spot06" itemScope itemType="https://schema.org/Product">
      <div className={styles.cardInner}>
        <div className={`${styles.imgZone} ${styles.imgZoneDots}`}>
          <a href="#" className={styles.imgLink}>
            <div className={styles.imgWrap}>
              <img
                className={styles.cardImg}
                data-role="card-img"
                src={p.imagens[imgIdx] ?? p.imagens[0]}
                alt={p.nome}
                width={500}
                height={500}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
              <div
                className={styles.hoverTrack}
                style={{ transform: `translateX(-${hoverIdx * 100}%)` }}
                aria-hidden="true"
              >
                {p.imagens.map((url, i) => (
                  <span key={i} className={styles.hoverSlide}>
                    {i === hoverIdx && (
                      <img src={url} alt="" width={500} height={500} loading="lazy" decoding="async" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </a>
          <button
            type="button"
            className={`${styles.imgNav} ${styles.imgNavPrev}`}
            onClick={() => setHoverIdx(i => Math.max(1, i - 1))}
            disabled={hoverIdx <= 1}
            aria-label="Imagem anterior"
          />
          <button
            type="button"
            className={`${styles.imgNav} ${styles.imgNavNext}`}
            onClick={() => setHoverIdx(i => Math.min(p.imagens.length - 1, i + 1))}
            disabled={hoverIdx >= p.imagens.length - 1}
            aria-label="Próxima imagem"
          />
          <div className={styles.imgDots} role="group" aria-label="Fotos do produto">
            {p.imagens.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.imgDot}${i === imgIdx ? ` ${styles.imgDotActive}` : ''}`}
                onClick={() => setImgIdx(i)}
                aria-label={`Ver foto ${i + 1} de ${p.imagens.length}`}
                aria-current={i === imgIdx ? 'true' : undefined}
              >
                <span className={styles.imgDotBar} aria-hidden="true" />
              </button>
            ))}
          </div>
          {flags.length > 0 && (
            <div className={styles.flagRow}>
              {flags.map(text => (
                <p key={text} className={styles.flag} data-role="card-flag">{text}</p>
              ))}
            </div>
          )}
          <button
            type="button"
            className={styles.addCart}
            aria-haspopup="dialog"
            aria-label="Escolher tamanho e adicionar ao carrinho"
          />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.nameSkuBox}>
            <a href="#" className={styles.infoLink}>
              <div className={styles.nameRow}>
                <h3 className={styles.name} data-role="card-name" itemProp="name">{p.nome}</h3>
              </div>
            </a>
            <div className={styles.skuRow}>
              {TAMANHOS.map(t => (
                <button
                  key={t}
                  type="button"
                  className={styles.skuChip}
                  aria-label={`Adicionar tamanho ${t} ao carrinho`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <a href="#" className={styles.infoLink}>
            <div className={styles.priceWrap}>
              <div className={styles.price} data-has-list-price="true">
                {temDesconto ? (
                  <span className={styles.listPrice} data-role="list-price">{money(p.precoDe!)}</span>
                ) : (
                  <span className={`${styles.listPrice} ${styles.vazio}`} aria-hidden="true">
                    &nbsp;
                  </span>
                )}
                <span className={styles.priceLine} data-role="card-price">
                  {money(p.preco)}
                  <span className={styles.priceOu}>{' ou'}</span>
                </span>
              </div>
              <div className={styles.instRow}>
                <span className={styles.installments} data-role="card-inst">
                  {`${p.parcelaN}X de ${money(p.parcelaValor)}`}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <button
        className={styles.wishlist}
        data-role="card-wish"
        onClick={() => setFav(f => !f)}
        aria-label={fav ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
        aria-pressed={fav}
      >
        <HeartIcon />
      </button>
    </section>
  );
}
