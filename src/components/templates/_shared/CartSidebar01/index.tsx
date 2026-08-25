import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

// Réplica preview do mini-cart real do FastStore —
// faststore.starter/src/components/organisms/CartSidebar01 (que compõe
// @faststore/ui: Overlay + SlideOver + CartSidebar + CartItem + QuantitySelector
// + OrderSummary + Button, mais o override de style.module.scss do .starter).
//
// Aqui não há carrinho de verdade: o conteúdo é um produto placeholder, e o
// +/- e o "remover" funcionam só para o usuário ver o comportamento no link de
// preview. Os atributos data-fs-* são mantidos para o DOM ficar equivalente ao
// que o cliente recebe no tema.
//
// Usado pelos headers 01, 03, 04 e 05 (o Header06 usa o CartSidebar06).

export interface CartSidebarPlaceholderItem {
  name: string;
  image: string;
  variations: { label: string; option: string }[];
  price: number;
  listPrice: number;
}

const DEFAULT_ITEM: CartSidebarPlaceholderItem = {
  name: 'Camiseta Básica em Algodão Pima',
  image: 'https://placehold.co/150x150',
  variations: [
    { label: 'Cor', option: 'Preto' },
    { label: 'Tamanho', option: 'M' },
  ],
  price: 249.9,
  listPrice: 299.9,
};

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

interface CartSidebar01Props {
  open: boolean;
  onClose: () => void;
  /** Rótulo do cabeçalho — "Carrinho" no CartSidebar01 do .starter. */
  title?: string;
  item?: CartSidebarPlaceholderItem;
}

export default function CartSidebar01({
  open,
  onClose,
  title = 'Carrinho',
  item = DEFAULT_ITEM,
}: CartSidebar01Props) {
  const [quantity, setQuantity] = useState(1);
  const [removed, setRemoved] = useState(false);

  // Trava o scroll do documento enquanto o drawer está aberto (mesmo efeito do
  // Overlay do @faststore/ui).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // ESC fecha o drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Ao reabrir, o carrinho volta ao estado inicial (1 produto placeholder).
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setRemoved(false);
    }
  }, [open]);

  if (!open) return null;

  const isEmpty = removed;
  const subTotal = item.listPrice * quantity;
  const total = item.price * quantity;
  const discount = subTotal - total;

  return (
    <div className={styles.section}>
      <div
        className={styles.overlay}
        data-fs-overlay=""
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={styles.slideOver}
        data-fs-slide-over=""
        data-fs-cart-sidebar=""
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className={styles.slideOverHeader} data-fs-slide-over-header="">
          <h2 className={styles.cartTitle} data-fs-cart-sidebar-title="">
            {title}
            <span className={styles.cartBadge} data-fs-badge="">
              {isEmpty ? 0 : quantity}
            </span>
          </h2>
          <button
            type="button"
            className={styles.headerClose}
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {isEmpty ? (
          <div className={styles.emptyState} data-fs-empty-state="">
            <div className={styles.emptyTitle} data-fs-empty-state-title="">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4.47 14.95l.31-1.71c.36-2.03.54-3.04 1.26-3.64.72-.6 1.76-.6 3.83-.6h4.26c2.07 0 3.1 0 3.82.6.72.6.9 1.61 1.27 3.64l.3 1.71c.51 2.8.76 4.21-.01 5.13-.78.92-2.21.92-5.07.92H9.56c-2.86 0-4.29 0-5.07-.92-.77-.92-.52-2.33-.02-5.13z"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M8 9l.15-1.68C8.32 5.44 9.99 4 12 4s3.68 1.44 3.85 3.32L16 9"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <p>Seu carrinho está vazio</p>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={onClose}
            >
              Comece a comprar
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.cartList} data-fs-cart-sidebar-list="">
              <li>
                <div className={styles.cartItemContainer}>
                  <div className={styles.cartItemImage} data-fs-cart-item-image="">
                    <img src={item.image} alt={item.name} width={150} height={150} />
                  </div>

                  <div className={styles.cartItem} data-fs-cart-item="">
                    <div className={styles.cartItemContent} data-fs-cart-item-content="">
                      <div>
                        <span className={styles.cartItemTitle} data-fs-cart-item-title="">
                          {item.name}
                        </span>
                        <div className={styles.cartItemSkus} data-fs-cart-item-skus="">
                          {item.variations.map(variation => (
                            <p key={variation.label}>
                              {variation.label}: <span>{variation.option}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.cartItemRemove}
                      data-fs-cart-item-remove-button=""
                      onClick={() => setRemoved(true)}
                      aria-label={`Remover ${item.name} do carrinho`}
                    />

                    <div className={styles.cartItemActions} data-fs-cart-item-actions="">
                      <div className={styles.quantitySelector} data-fs-quantity-selector="">
                        <button
                          type="button"
                          data-quantity-selector-button=""
                          className={styles.quantityButton}
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          aria-label="Diminuir quantidade"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M5 12h14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <input
                          className={styles.quantityInput}
                          data-quantity-selector-input=""
                          type="text"
                          inputMode="numeric"
                          value={quantity}
                          readOnly
                          aria-label="Quantidade"
                        />
                        <button
                          type="button"
                          data-quantity-selector-button=""
                          className={styles.quantityButton}
                          onClick={() => setQuantity(q => q + 1)}
                          aria-label="Aumentar quantidade"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className={styles.productPrice} data-fs-product-price="">
                        <span className={styles.priceListing} data-fs-price-variant="listing">
                          {formatPrice(item.listPrice)}
                        </span>
                        <span className={styles.priceSpot} data-fs-price-variant="spot">
                          <span>{formatPrice(item.price)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <footer className={styles.cartFooter} data-fs-cart-sidebar-footer="">
              <ul className={styles.orderSummary} data-fs-order-summary="">
                <li>
                  <span data-fs-order-summary-subtotal-label="">Subtotal:</span>
                  <span data-fs-order-summary-subtotal-value="">
                    {formatPrice(subTotal)}
                  </span>
                </li>
                {discount > 0 && (
                  <li data-fs-order-summary-discount="">
                    <span data-fs-order-summary-discount-label="">Descontos:</span>
                    <span data-fs-order-summary-discount-value="">
                      -{formatPrice(discount)}
                    </span>
                  </li>
                )}
                <li data-fs-order-summary-total="">
                  <span data-fs-order-summary-total-label="">Total:</span>
                  <span data-fs-order-summary-total-value="">{formatPrice(total)}</span>
                </li>
              </ul>

              <div className={styles.footerButtons}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonShare}`}
                >
                  Compartilhar
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonFinish}`}
                >
                  Finalizar Compra
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonContinue}`}
                  onClick={onClose}
                >
                  Continuar comprando
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
