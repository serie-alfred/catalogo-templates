import React, { useEffect, useRef, useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar11` do faststore.starter (família 11, Grade; desenho
 * `CartSidebar11`): o carrinho que o Header11 abre. Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é derivado do SCSS de lá.
 *
 * Grade de filetes: "Carrinho [N]" com o fechar quadrado; itens com a foto à esquerda,
 * referência "N°" (SKU), preço da linha, nome, variação, quantidade em caixa − / + e
 * remover (texto no desktop, lixeira no mobile); subtotal, a nota, "Finalizar compra" e
 * "Continuar comprando".
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: no catálogo as vars do tema vêm de um wrapper acima do
 *    componente, e o <body> ficaria sem elas. Quem dá o container das `@container` é
 *    o envelope `.cartSidebar11Box` (fixo, do tamanho da tela; ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter; + / −, remover e
 *    o estado vazio funcionam só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar11Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho11 = {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`), que é o que a gaveta
// de lá mostra no palco. A foto fica de fora (a URL da origem é de CDN de loja); vale o
// fundo do `.lineImage`. Sem `slug` no mock: o nome sai como <span>, como lá.
const ITENS_11: ItemCarrinho11[] = [
  {
    id: 'mock-cart-item-4077-281G',
    sku: '4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header11 usa no contador. */
export const CART_11_QUANTIDADE = ITENS_11.reduce((n, i) => n + i.quantity, 0);

const format = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (w: number, children: React.ReactNode) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Ico = {
  close: svg(20, <path d="M6 6l12 12M18 6 6 18" />),
  trash: svg(18, <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" />),
  minus: svg(14, <path d="M5 12h14" />),
  plus: svg(14, <path d="M12 5v14M5 12h14" />),
  arrow: svg(20, <path d="M5 12h14M13 6l6 6-6 6" />),
};

/** "N°024": o id do SKU com zeros à esquerda até 3 dígitos (mesma regra do card 11). */
const referencia = (sku?: string | null) => {
  const s = String(sku ?? '').trim();
  return s ? `N°${s.length < 3 ? s.padStart(3, '0') : s}` : '';
};

export default function CartSidebar11({
  open,
  onClose,
  onTotalChange,
}: CartSidebar11Props) {
  const [items, setItems] = useState<ItemCarrinho11[]>(ITENS_11);
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
    <div className={styles.cartSidebar11Box}>
      <div
        className={`${styles.cartSidebar11}${open ? ` ${styles.open}` : ''}`}
        data-role="cart-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart11-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2
              id="cart11-titulo"
              className={styles.title}
              data-role="cart-title"
            >
              Carrinho
              <span className={styles.count}>[{totalItems}]</span>
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
                  // O desenho mostra só o valor de cada eixo: os valores, na ordem.
                  const variacao = Object.keys(item.variations)
                    .map(k => item.variations[k])
                    .filter(Boolean)
                    .join(' · ');
                  const ref = referencia(item.sku);
                  const preco = format(item.price * item.quantity);
                  return (
                    <li
                      key={item.id}
                      className={styles.line}
                      data-role="cart-item"
                    >
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        <div className={styles.lineTop}>
                          <span className={styles.lineRef}>
                            {ref}
                            {variacao && (
                              <span
                                className={styles.mob}
                              >{`${ref ? ' · ' : ''}${variacao}`}</span>
                            )}
                          </span>
                          <span
                            className={`${styles.linePrice} ${styles.dsk}`}
                            data-role="cart-item-price"
                          >
                            {preco}
                          </span>
                        </div>
                        <span
                          className={styles.lineName}
                          data-role="cart-item-name"
                        >
                          {item.name}
                        </span>
                        {variacao && (
                          <span
                            className={`${styles.lineVariation} ${styles.dsk}`}
                          >
                            {variacao}
                          </span>
                        )}
                        <span className={`${styles.linePrice} ${styles.mob}`}>
                          {preco}
                        </span>
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
                          <button
                            type="button"
                            className={styles.remove}
                            onClick={() => remover(item.id)}
                            aria-label={`Remover ${item.name}`}
                            data-role="cart-item-remove"
                          >
                            <span className={styles.removeText}>Remover</span>
                            <span className={styles.removeIcon}>
                              {Ico.trash}
                            </span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.footer}>
                <div className={styles.summary}>
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
                    Frete e descontos calculados no checkout
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.checkout}
                  data-role="cart-checkout"
                >
                  Finalizar compra
                  {Ico.arrow}
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
