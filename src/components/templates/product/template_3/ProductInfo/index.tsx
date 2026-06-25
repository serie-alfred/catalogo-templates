import React, { useState } from 'react';
import styles from './index.module.css';

/**
 * ProductInfo03 — preview fiel do FastStore `organisms/ProductDetails02`
 * (= `molecules/ProductGallery02` + `molecules/ProductInfo02` e seus
 * subcomponentes: ProductTitle02, ProductPrice02, ProductVariations02,
 * ProductBuy02, ProductSpecsAccordion02).
 *
 * Todo o conteúdo dinâmico (VTEX/GraphQL/hooks) foi substituído por dados
 * fixos. As cores/fontes continuam lendo os `var(--prod-*)` do componente
 * original para refletir os overrides por instância no gerador.
 */

const product = {
  sku: 'REF-48291',
  name: 'Tênis Urban Runner Premium',
  rating: 4,
  reviews: 128,
  listPrice: 'R$ 799,00',
  price: 'R$ 599,00',
  inStock: true,
  specs: [
    { name: 'Marca', values: ['SérieA'] },
    { name: 'Material', values: ['Couro sintético', 'Mesh respirável'] },
    { name: 'Garantia', values: ['12 meses'] },
  ],
  colors: [
    { value: 'Preto', image: 'https://placehold.co/256x320/1a1a1a/ffffff?text=Preto' },
    { value: 'Branco', image: 'https://placehold.co/256x320/f2f2f2/333333?text=Branco' },
    { value: 'Areia', image: 'https://placehold.co/256x320/d9c7a8/333333?text=Areia' },
  ],
  sizes: ['38', '39', '40', '41', '42'],
  galleryImages: [
    'https://placehold.co/960x1200/efefef/8c8c8c?text=1',
    'https://placehold.co/640x800/e9e9e9/8c8c8c?text=2',
    'https://placehold.co/640x800/e4e4e4/8c8c8c?text=3',
    'https://placehold.co/960x1200/ededed/8c8c8c?text=4',
    'https://placehold.co/640x800/e7e7e7/8c8c8c?text=5',
  ],
  badges: ['-25%', 'NOVO'],
  accordion: [
    {
      title: 'Descrição',
      content:
        'Tênis desenvolvido para o dia a dia urbano, unindo conforto e durabilidade. Cabedal em couro sintético com detalhes em mesh respirável, entressola em EVA de alta densidade e solado de borracha antiderrapante para máxima aderência.',
    },
    { title: 'Composição', content: 'Cabedal: couro sintético. Forro: têxtil. Solado: borracha.' },
    { title: 'Cuidados', content: 'Limpe com pano úmido. Não utilize alvejante. Seque à sombra.' },
  ],
};

const Chevron = ({ up }: { up?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={up ? { transform: 'rotate(180deg)' } : undefined}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className={filled ? styles.starFilled : ''}
    height="14"
    viewBox="0 0 12 12"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.00776 1.01041L8.03431 3.08048C8.17431 3.36864 8.54759 3.64504 8.86259 3.69797L10.7232 4.00965C11.9131 4.20961 12.1931 5.07998 11.3356 5.93859L9.88914 7.39704C9.64414 7.64403 9.51003 8.12038 9.58581 8.46151L9.99997 10.2669C10.3266 11.696 9.57414 12.2488 8.32015 11.5019L6.57616 10.461C6.26121 10.2728 5.74211 10.2728 5.42127 10.461L3.67732 11.5019C2.42912 12.2488 1.67088 11.6901 1.99751 10.2669L2.41163 8.46151C2.48745 8.12038 2.3533 7.64403 2.10832 7.39704L0.66182 5.93859C-0.189753 5.07998 0.0843847 4.20961 1.27425 4.00965L3.13488 3.69797C3.44401 3.64504 3.8173 3.36864 3.95729 3.08048L4.98383 1.01041C5.54377 -0.112844 6.45366 -0.112844 7.00776 1.01041Z"
      fill="currentColor"
    />
  </svg>
);

const ProductInfo = () => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value);
  const [selectedSize, setSelectedSize] = useState('40');
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.productDetails}>
      <div className={`${styles.container} component__container`}>
        {/* ───────── Galeria (ProductGallery02) ───────── */}
        <div className={styles.productGallery}>
          {product.badges.length > 0 && (
            <div className={styles.badges}>
              {product.badges.map(badge => (
                <span key={badge} className={styles.badge}>
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Desktop: coluna de imagens com scroll + scrollbar custom */}
          <div className={styles.desktopGallery}>
            <div className={styles.scrollbar}>
              <button
                type="button"
                aria-label="Imagem anterior"
                className={`${styles.arrow} ${styles.disabled}`}
              >
                <Chevron up />
              </button>

              <div className={styles.track}>
                <div className={styles.handle} style={{ top: '0%', height: '40%' }} />
              </div>

              <button type="button" aria-label="Próxima imagem" className={styles.arrow}>
                <Chevron />
              </button>
            </div>

            <div className={styles.scrollArea}>
              {product.galleryImages.map((image, index) => (
                <div className={styles.mediaItem} key={index}>
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: slider horizontal com paginação */}
          <div className={styles.mobileGallery}>
            <div className={styles.swiper}>
              <img
                src={product.galleryImages[0]}
                alt={product.name}
                className={styles.mobileImg}
              />
              <div className={styles.dots}>
                {product.galleryImages.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.dot} ${index === 0 ? styles.dotActive : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Informações (ProductInfo02) ───────── */}
        <div className={styles.productInfo}>
          {/* ProductTitle02 */}
          <header className={styles.productTitle}>
            <span className={styles.sku}>SKU: {product.sku}</span>

            <h1>{product.name}</h1>

            <div className={styles.rating}>
              <span className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < product.rating} />
                ))}
              </span>
              <span>
                {product.reviews > 0 ? `(${product.reviews}) avaliações` : 'Sem avaliações'}
              </span>
            </div>

            <ul className={styles.specs}>
              {product.specs.map((spec, index) => (
                <li key={index}>
                  <strong>{spec.name}:</strong> {spec.values.join(', ')}
                </li>
              ))}
            </ul>
          </header>

          {/* ProductPrice02 */}
          <div className={styles.productPrice}>
            <span className={styles.listPrice}>{product.listPrice}</span>
            <span className={styles.price}>{product.price}</span>
          </div>

          {/* ProductVariations02 — cor (swatches em foto) */}
          <div className={styles.colorVariations}>
            <span className={styles.colorLabel}>
              <strong>Cor:</strong> {selectedColor}
            </span>

            <div className={styles.colorGrid}>
              {product.colors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  className={`${styles.colorSwatch} ${selectedColor === color.value ? styles.active : ''}`}
                  title={color.value}
                  aria-label={color.value}
                  onClick={() => setSelectedColor(color.value)}
                >
                  <img src={color.image} alt={color.value} />
                </button>
              ))}
            </div>
          </div>

          {/* ProductVariations02 — tamanho (pills) */}
          <div className={styles.productVariations}>
            <span className={styles.variationTitle}>
              <strong>Tamanho:</strong> {selectedSize}
            </span>

            <ul className={styles.sizeList}>
              {product.sizes.map(size => (
                <li
                  key={size}
                  className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  <span>{size}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Estoque */}
          <p className={styles.stock}>
            {product.inStock ? 'Em estoque' : 'Produto indisponível'}
          </p>

          {/* ProductBuy02 */}
          <div className={styles.productBuy}>
            <div className={styles.buttons}>
              <button type="button" className={styles.addToCart}>
                Adicionar ao carrinho
              </button>
              <button type="button" className={styles.buyNow}>
                Comprar agora
              </button>
            </div>
          </div>

          {/* Selos de confiança */}
          <ul className={styles.trustBadges}>
            <li>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 3h13v13H1z" />
                <path d="M14 8h4l3 3v5h-7" />
                <circle cx="6" cy="18.5" r="1.5" />
                <circle cx="17" cy="18.5" r="1.5" />
              </svg>
              <span>Frete e devolução grátis</span>
            </li>
            <li>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>5 anos de proteção</span>
            </li>
            <li>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span>30 dias para troca</span>
            </li>
          </ul>

          {/* ProductSpecsAccordion02 */}
          <div className={styles.accordion}>
            {product.accordion.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div className={styles.accordionItem} key={index}>
                  <button
                    type="button"
                    className={styles.accordionHeader}
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className={styles.accordionTitle}>{item.title}</span>
                    <svg
                      className={`${styles.accordionIcon} ${isOpen ? styles.accordionIconOpen : ''}`}
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
                  </button>

                  {isOpen && (
                    <div className={styles.accordionContent}>
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
