import React, { useEffect, useRef, useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar15` do faststore.starter (família 15, Luxo; desenho
 * `CartSidebar15`): a sacola que o Header15 abre. Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é derivado do SCSS de lá.
 *
 * Cabeçalho com a contagem em versalete e "Sua sacola" em serifa, fechar com fio; linhas com
 * a foto, a marca (só desktop), o nome em serifa, a variação, a caixa de quantidade, o preço
 * e "Remover" sublinhado; rodapé tingido com o subtotal em serifa, a nota, "Finalizar
 * compra" e "Continuar comprando" com borda.
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: no catálogo as vars do tema vêm de um wrapper acima do
 *    componente. Quem dá o container das `@container` é o envelope `.cartSidebar15Box`
 *    (fixo, do tamanho da tela; ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter (sem a foto, que é de
 *    CDN de loja: vale o fundo do `.lineImage`); + / −, remover e o estado vazio funcionam
 *    só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar15Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho15 = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`). Sem `slug` no mock: o
// nome sai como <span>, como lá.
const ITENS_15: ItemCarrinho15[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    brand: 'Minha Loja',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header15 usa no contador. */
export const CART_15_QUANTIDADE = ITENS_15.reduce((n, i) => n + i.quantity, 0);

const format = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Ico = {
  close: (
    <svg
      className={styles.closeIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  minus: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  ),
  plus: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};

export default function CartSidebar15({
  open,
  onClose,
  onTotalChange,
}: CartSidebar15Props) {
  const [items, setItems] = useState<ItemCarrinho15[]>(ITENS_15);
  const closeRef = useRef<HTMLButtonElement>(null);

  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const subTotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  useEffect(() => {
    onTotalChange?.(totalItems);
  }, [totalItems, onTotalChange]);

  const onQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
  };
  const remover = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  // ESC fecha e o foco vai para o "fechar" ao abrir.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={styles.cartSidebar15Box}>
      <div
        className={`${styles.cartSidebar15}${open ? ` ${styles.open}` : ''}`}
        data-role="cart-root"
      >
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart15-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <div className={styles.headText}>
              <span className={styles.count} data-role="cart-count">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
              <h2
                id="cart15-titulo"
                className={styles.title}
                data-role="cart-title"
              >
                Sua sacola
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Fechar sacola"
            >
              {Ico.close}
            </button>
          </div>

          {items.length === 0 ? (
            <div className={styles.empty} data-role="cart-empty">
              <p className={styles.emptyText}>Sua sacola está vazia.</p>
              <button
                type="button"
                className={styles.continue}
                onClick={onClose}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map(item => {
                  const variacoes = Object.keys(item.variations).map(k => ({
                    label: k,
                    value: item.variations[k],
                  }));
                  return (
                    <li
                      key={item.id}
                      className={styles.line}
                      data-role="cart-item"
                    >
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        {item.brand && (
                          <span
                            className={`${styles.lineBrand} ${styles.dsk}`}
                            data-role="cart-item-brand"
                          >
                            {item.brand}
                          </span>
                        )}
                        <span
                          className={styles.lineName}
                          data-role="cart-item-name"
                        >
                          {item.name}
                        </span>
                        {variacoes.length > 0 && (
                          <span className={styles.lineVariation}>
                            {variacoes.map((v, i) => (
                              <React.Fragment key={v.label}>
                                {i > 0 && ' · '}
                                <span className={styles.srOnly}>
                                  {v.label}:{' '}
                                </span>
                                {v.value}
                              </React.Fragment>
                            ))}
                          </span>
                        )}
                        <div className={styles.lineActions}>
                          <div
                            className={styles.qty}
                            role="group"
                            aria-label={`Quantidade de ${item.name}`}
                          >
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                onQuantity(item.id, item.quantity - 1)
                              }
                            >
                              {Ico.minus}
                            </button>
                            <span
                              className={styles.qtyValue}
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              onClick={() =>
                                onQuantity(item.id, item.quantity + 1)
                              }
                            >
                              {Ico.plus}
                            </button>
                          </div>
                          <span
                            className={styles.linePrice}
                            data-role="cart-item-price"
                          >
                            {format(item.price * item.quantity)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => remover(item.id)}
                          data-role="cart-item-remove"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span
                    className={styles.subtotalValue}
                    data-role="cart-subtotal"
                  >
                    {format(subTotal)}
                  </span>
                </div>
                <span className={styles.note}>
                  Frete e descontos calculados no checkout.
                </span>
                <button
                  type="button"
                  className={styles.checkout}
                  data-role="cart-checkout"
                >
                  Finalizar compra
                </button>
                <button
                  type="button"
                  className={styles.continue}
                  onClick={onClose}
                  data-role="cart-continue"
                >
                  Continuar comprando
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
