import React, { useEffect, useRef, useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar12` do faststore.starter (família 12, Suave; desenho
 * `CartSidebar12`): a sacola que o Header12 abre. Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é derivado do SCSS de lá.
 *
 * Gaveta branca com o canto esquerdo arredondado: "Sua sacola (N itens)" em serifa e o
 * fechar redondo; itens com a foto arredondada, nome e preço da linha, a variação "Eixo:
 * valor", a quantidade em pílula − / + e "Remover"; no pé, subtotal, frete (texto fixo),
 * total, "Finalizar compra" e "Continuar comprando".
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: no catálogo as vars do tema vêm de um wrapper acima do
 *    componente. Quem dá o container das `@container` é o envelope `.cartSidebar12Box`
 *    (fixo, do tamanho da tela; ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter; + / −, remover e
 *    o estado vazio funcionam só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar12Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho12 = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`). A foto fica de fora
// (a URL da origem é de CDN de loja); vale o fundo do `.lineImage`. Sem `slug` no mock: o
// nome sai como <span>, como lá.
const ITENS_12: ItemCarrinho12[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header12 usa no contador. */
export const CART_12_QUANTIDADE = ITENS_12.reduce((n, i) => n + i.quantity, 0);

const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (w: number, children: React.ReactNode, sw = '1.8') => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" aria-hidden="true">
    {children}
  </svg>
);

const Ico = {
  close: svg(18, <path d="M6 6l12 12M18 6 6 18" />),
  minus: svg(14, <path d="M5 12h14" />, '2'),
  plus: svg(14, <path d="M12 5v14M5 12h14" />, '2'),
};

export default function CartSidebar12({ open, onClose, onTotalChange }: CartSidebar12Props) {
  const [items, setItems] = useState<ItemCarrinho12[]>(ITENS_12);
  const closeRef = useRef<HTMLButtonElement>(null);

  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const subTotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const total = subTotal;

  useEffect(() => {
    onTotalChange?.(totalItems);
  }, [totalItems, onTotalChange]);

  const onQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
  };
  const remover = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  // ESC fecha e o foco vai para o "fechar" ao abrir.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={styles.cartSidebar12Box}>
      <div className={`${styles.cartSidebar12}${open ? ` ${styles.open}` : ''}`} data-role="cart-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart12-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2 id="cart12-titulo" className={styles.title} data-role="cart-title">
              Sua sacola{' '}
              <span className={styles.count}>
                ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
              </span>
            </h2>
            <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Fechar sacola">
              {Ico.close}
            </button>
          </div>

          {items.length === 0 ? (
            <div className={styles.empty} data-role="cart-empty">
              <p className={styles.emptyText}>Sua sacola está vazia.</p>
              <button type="button" className={styles.continue} onClick={onClose}>
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map(item => {
                  // O desenho mostra "Eixo: valor", na ordem da VTEX.
                  const variacao = Object.keys(item.variations)
                    .filter(k => item.variations[k])
                    .map(k => `${k}: ${item.variations[k]}`)
                    .join(' · ');
                  const preco = format(item.price * item.quantity);
                  return (
                    <li key={item.id} className={styles.line} data-role="cart-item">
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        <div className={styles.lineTop}>
                          <span className={styles.lineName} data-role="cart-item-name">
                            {item.name}
                          </span>
                          <strong className={`${styles.linePrice} ${styles.dsk}`} data-role="cart-item-price">
                            {preco}
                          </strong>
                        </div>
                        {variacao && <span className={styles.lineVariation}>{variacao}</span>}
                        <strong className={`${styles.linePrice} ${styles.mob}`}>{preco}</strong>
                        <div className={styles.lineActions}>
                          <div className={styles.qty} role="group" aria-label={`Quantidade de ${item.name}`}>
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              disabled={item.quantity <= 1}
                              onClick={() => onQuantity(item.id, item.quantity - 1)}
                            >
                              {Ico.minus}
                            </button>
                            <span className={styles.qtyValue} aria-live="polite">
                              {item.quantity}
                            </span>
                            <button type="button" aria-label="Aumentar quantidade" onClick={() => onQuantity(item.id, item.quantity + 1)}>
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
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.footer}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span data-role="cart-subtotal">{format(subTotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Frete</span>
                  <span>Calculado na próxima etapa</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span data-role="cart-total">{format(total)}</span>
                </div>
                <button type="button" className={styles.checkout} data-role="cart-checkout">
                  Finalizar compra
                </button>
                <button type="button" className={styles.continue} onClick={onClose} data-role="cart-continue">
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
