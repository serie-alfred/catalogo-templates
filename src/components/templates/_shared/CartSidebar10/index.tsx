import React, { useEffect, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar10` do faststore.starter (família 10, Varejo;
 * desenho `CartSidebar10`): o "Meu carrinho" que o Header10 abre. Mesmo markup,
 * mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS
 * é derivado do SCSS de lá.
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: no catálogo as vars do tema vêm de um wrapper acima do
 *    componente, e o <body> ficaria sem elas. Quem dá o container das `@container` é
 *    o envelope `.cartSidebar10Box` (fixo, do tamanho da tela; ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter; + / −, remover e
 *    o estado vazio funcionam só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar10Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho10 = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`), que é o que a gaveta
// de lá mostra no palco. A foto fica de fora (a URL da origem é de CDN de loja); vale o
// fundo do `.lineImage`. Sem `slug` no mock: o nome sai como <span>, como lá.
const ITENS_10: ItemCarrinho10[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header10 usa no contador. */
export const CART_10_QUANTIDADE = ITENS_10.reduce((n, i) => n + i.quantity, 0);

const format = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (w: number, sw: string, children: React.ReactNode) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Ico = {
  cart: svg(
    22,
    '2',
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.5 12h12l2-8H6.2" />
    </>
  ),
  close: svg(20, '2', <path d="M6 6l12 12M18 6 6 18" />),
  trash: svg(18, '1.8', <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />),
  minus: svg(14, '2.4', <path d="M5 12h14" />),
  plus: svg(14, '2.4', <path d="M12 5v14M5 12h14" />),
};

export default function CartSidebar10({
  open,
  onClose,
  onTotalChange,
}: CartSidebar10Props) {
  const [items, setItems] = useState<ItemCarrinho10[]>(ITENS_10);
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
    <div className={styles.cartSidebar10Box}>
      <div
        className={`${styles.cartSidebar10}${open ? ` ${styles.open}` : ''}`}
        data-role="cart-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart10-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2
              id="cart10-titulo"
              className={styles.title}
              data-role="cart-title"
            >
              {Ico.cart}
              Meu carrinho{totalItems > 0 && ` (${totalItems})`}
            </h2>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Fechar carrinho"
            >
              {Ico.close}
            </button>
          </div>

          {items.length === 0 ? (
            <div className={styles.empty} data-role="cart-empty">
              <p className={styles.emptyText}>Seu carrinho está vazio.</p>
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
                  const variacoes = Object.keys(item.variations).map(
                    k => `${k}: ${item.variations[k]}`
                  );
                  return (
                    <li
                      key={item.id}
                      className={styles.line}
                      data-role="cart-item"
                    >
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        <div className={styles.lineHead}>
                          <span
                            className={styles.lineName}
                            data-role="cart-item-name"
                          >
                            {item.name}
                          </span>
                          <button
                            type="button"
                            className={styles.remove}
                            onClick={() => remover(item.id)}
                            aria-label={`Remover ${item.name}`}
                            data-role="cart-item-remove"
                          >
                            {Ico.trash}
                          </button>
                        </div>
                        {variacoes.length > 0 && (
                          <span className={styles.lineVariation}>
                            {variacoes.join(' · ')}
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
                          <strong
                            className={styles.linePrice}
                            data-role="cart-item-price"
                          >
                            {format(item.price * item.quantity)}
                          </strong>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <strong
                    className={styles.subtotalValue}
                    data-role="cart-subtotal"
                  >
                    {format(subTotal)}
                  </strong>
                </div>
                <span className={styles.note}>
                  Frete e descontos são calculados na finalização.
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
