'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails03` do faststore.starter — a PDP 03 inteira,
 * com as sete molecules que ela compõe inline: galeria (coluna rolável no
 * desktop), título com SKU/avaliação/ficha curta, preço, variação de cor,
 * seletor de tamanho, compra, selos de confiança e o acordeão de
 * especificações.
 *
 * O que sai: `usePDP`, `useSession`, `useBuyButton`, o rating por GraphQL e o
 * tracking. O conteúdo é o mesmo `mock.ts` que a origem passou a ter — sem ele
 * a seção não desenhava nada nem no palco.
 *
 * O `Rating`, o `SkuSelector` e o `QuantitySelector` vêm do `@faststore/ui` na
 * origem; aqui são reescritos com os mesmos atributos `data-fs-*`, porque é
 * neles que o CSS se apoia.
 */
const foto = (t: string) =>
  `https://placehold.co/800x1000/1f1f1f/f2f2f2?text=${encodeURIComponent(t)}`;

const PRODUTO = {
  sku: '3001',
  nome: 'Jaqueta Corta-Vento Impermeável',
  descricao:
    'Corta-vento leve com costura selada e capuz ajustável. O tecido tem acabamento repelente à água e respira o suficiente para o uso urbano — da caminhada até a chuva de fim de tarde.',
  preco: 449.9,
  precoDe: 549.9,
  imagens: [
    { url: foto('Frente'), alt: 'Frente' },
    { url: foto('Costas'), alt: 'Costas' },
    { url: foto('Capuz'), alt: 'Detalhe do capuz' },
    { url: foto('Bolso'), alt: 'Detalhe do bolso' },
  ],
  specs: [
    { name: 'Composição', value: '100% Poliamida' },
    { name: 'Forro', value: 'Malha leve' },
    { name: 'Fechamento', value: 'Zíper frontal' },
  ],
  cores: ['Grafite', 'Areia'],
  corAtiva: 'Grafite',
  tamanhos: ['P', 'M', 'G'],
  tamanhoAtivo: 'M',
};

/**
 * A origem injeta um `<style>` em runtime traduzindo o NOME da cor em hex, por um
 * dicionário (`utils/Colors`): "areia" é apelido de "marrom" (#7A4900) e "grafite"
 * não está no dicionário, então fica com o cinza padrão do CSS. Aqui o mesmo
 * resultado vem inline — o que importa é a cor computada, e ela bate.
 */
const COR_HEX: Record<string, string> = { Areia: '#7A4900' };

const dinheiro = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const desconto = Math.round(((PRODUTO.precoDe - PRODUTO.preco) / PRODUTO.precoDe) * 100);

const Chevron = ({ up }: { up?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={up ? { transform: 'rotate(180deg)' } : undefined}
  >
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ToggleIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** As 5 estrelas vazias do `Rating` do @faststore/ui, com o mesmo DOM. */
const Estrelas = () => (
  <ul
    data-fs-list
    data-testid="fs-rating"
    data-fs-rating
    data-fs-rating-actionable="false"
    className={styles.stars}
  >
    {[0, 1, 2, 3, 4].map(i => (
      <li key={i} data-fs-rating-item="empty" data-testid="fs-rating-item">
        <div data-fs-rating-icon-wrapper>
          <svg data-fs-icon data-testid="fs-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
          </svg>
        </div>
        <svg data-fs-icon data-testid="fs-icon" data-fs-rating-icon-outline viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </li>
    ))}
  </ul>
);

export default function ProductInfo() {
  const [corAtiva, setCorAtiva] = useState(PRODUTO.corAtiva);
  const [tamanhoAtivo, setTamanhoAtivo] = useState(PRODUTO.tamanhoAtivo);
  const [aberto, setAberto] = useState(0);

  const itensAcordeao = [
    { title: 'Descrição', content: PRODUTO.descricao },
    ...PRODUTO.specs.map(s => ({ title: s.name, content: s.value })),
  ];

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.pd03Wrap}>
      <section className={styles.productDetails} data-role="pd03-root">
        <div className={styles.container}>
          {/* ── GALERIA ── */}
          <div className={styles.productGallery} data-role="pd03-gallery">
            <div className={styles.badges} data-role="pd03-badges">
              <span className={styles.badge} data-role="pd03-badge">-{desconto}%</span>
            </div>

            <div className={styles.desktopGallery}>
              <div className={styles.scrollbar}>
                <button type="button" aria-label="Imagem anterior" className={`${styles.arrow} ${styles.disabled}`}>
                  <Chevron up />
                </button>
                <div className={styles.track}>
                  <div className={styles.handle} style={{ top: '0%', height: '100%' }} />
                </div>
                <button type="button" aria-label="Próxima imagem" className={`${styles.arrow} ${styles.disabled}`}>
                  <Chevron />
                </button>
              </div>

              <div className={styles.scrollArea}>
                {PRODUTO.imagens.map((img, i) => (
                  <div className={styles.mediaItem} key={i} data-role="pd03-media">
                    <img src={img.url} alt={img.alt} />
                  </div>
                ))}
              </div>
            </div>

            {/* abaixo de 1024 é esta que aparece — swiper com paginação, como na origem */}
            <div className={styles.mobileGallery}>
              <Swiper
                className={styles.swiper}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                spaceBetween={0}
                observer
                observeParents
              >
                {PRODUTO.imagens.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img.url} alt={img.alt} className={styles.mobileImg} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* ── INFO ── */}
          <div className={styles.productInfo} data-role="pd03-info">
            <header className={styles.productTitle} data-role="pd03-title-box">
              <span className={styles.sku} data-role="pd03-sku">SKU: {PRODUTO.sku}</span>

              <h1 data-role="pd03-name">{PRODUTO.nome}</h1>

              <div className={styles.rating} data-role="pd03-rating">
                <Estrelas />
                <span>Sem avaliações</span>
              </div>

              <ul className={styles.specs} data-role="pd03-specs">
                {PRODUTO.specs.map((spec, i) => (
                  <li key={i}>
                    <strong>{spec.name}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </header>

            <div className={styles.productPrice} data-role="pd03-price-box">
              <span className={styles.listPrice} data-role="pd03-list-price">{dinheiro(PRODUTO.precoDe)}</span>
              <span className={styles.price} data-role="pd03-price">{dinheiro(PRODUTO.preco)}</span>
            </div>

            <div className={styles.colorVariations} data-role="pd03-colors">
              <span className={styles.colorLabel} data-role="pd03-color-label">
                <strong>Cor:</strong> {corAtiva}
              </span>
              <div className={styles.colorGrid}>
                {PRODUTO.cores.map(cor => (
                  <a
                    key={cor}
                    className={`${styles.colorSwatch} ${cor === corAtiva ? styles.active : ''}`}
                    title={cor}
                    aria-label={cor}
                    onClick={() => setCorAtiva(cor)}
                  >
                    <span
                      className={styles.colorFill}
                      data-role="pd03-color-fill"
                      data-color-fill={cor}
                      style={COR_HEX[cor] ? { background: COR_HEX[cor] } : undefined}
                    />
                  </a>
                ))}
              </div>
            </div>

            <div
              data-fs-sku-selector
              data-fs-sku-selector-variant="label"
              className={styles.productVariations}
              data-role="pd03-sku-selector"
            >
              <label data-fs-label data-testid="fs-label" data-fs-sku-selector-title>
                Tamanho: <strong>{tamanhoAtivo}</strong>
              </label>
              <ul data-fs-sku-selector-list>
                {PRODUTO.tamanhos.map(t => (
                  <li
                    key={t}
                    data-fs-sku-selector-option
                    data-fs-sku-selector-checked={t === tamanhoAtivo ? 'true' : 'false'}
                    onClick={() => setTamanhoAtivo(t)}
                  >
                    <a
                      data-fs-link
                      data-fs-link-variant="default"
                      data-fs-link-size="regular"
                      data-testid="fs-link"
                      data-fs-sku-selector-option-link
                    >
                      <span data-fs-sr-only>{t}</span>
                    </a>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className={styles.stock} data-role="pd03-stock">Em estoque</p>

            <div className={styles.productBuy} data-role="pd03-buy">
              {/* o seletor de quantidade existe no DOM e o CSS o esconde, como na origem */}
              <div className={styles.quantity}>
                <div data-fs-quantity-selector data-testid="fs-quantity-selector" />
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  data-fs-button
                  data-fs-button-size="regular"
                  data-testid="buy-button"
                  className={styles.addToCart}
                  data-role="pd03-add"
                >
                  <div data-fs-button-wrapper>
                    <span>Adicionar ao carrinho</span>
                  </div>
                </button>
                <button
                  type="button"
                  data-fs-button
                  data-fs-button-size="regular"
                  data-testid="buy-button"
                  className={styles.buyNow}
                  data-role="pd03-buynow"
                >
                  <div data-fs-button-wrapper>
                    <span>Comprar agora</span>
                  </div>
                </button>
              </div>
            </div>

            <ul className={styles.trustBadges} data-role="pd03-trust">
              <li>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3h13v13H1z" />
                  <path d="M14 8h4l3 3v5h-7" />
                  <circle cx="6" cy="18.5" r="1.5" />
                  <circle cx="17" cy="18.5" r="1.5" />
                </svg>
                <span>Frete e devolução grátis</span>
              </li>
              <li>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span>5 anos de proteção</span>
              </li>
              <li>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                <span>30 dias para troca</span>
              </li>
            </ul>

            <div className={styles.accordion} data-role="pd03-accordion">
              {itensAcordeao.map((item, i) => {
                const isOpen = aberto === i;
                return (
                  <div className={styles.item} key={i} data-role="pd03-acc-item">
                    <button
                      type="button"
                      className={styles.header}
                      aria-expanded={isOpen}
                      onClick={() => setAberto(isOpen ? -1 : i)}
                    >
                      <span className={styles.title} data-role="pd03-acc-title">{item.title}</span>
                      <ToggleIcon open={isOpen} />
                    </button>

                    {isOpen && (
                      <div className={styles.content} data-role="pd03-acc-content">
                        {i === 0 ? <div>{item.content}</div> : <p>{item.content}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
