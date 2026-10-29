import React, { useEffect, useRef, useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar14` do faststore.starter (família 14, Esportiva; desenho
 * `CartSidebar14`): a sacola que o Header14 abre. Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é derivado do SCSS de lá.
 *
 * Gaveta branca sobre o véu marinho: "Sua sacola" em Saira itálica com o contador no
 * paralelogramo vermelho e o fechar; itens com a foto quadrada, o nome, a variação apagada,
 * a lixeira no canto, a quantidade − / + numa caixa cinza e o preço da linha; no pé, o
 * subtotal, a nota fixa, "Finalizar compra" com a seta e "Continuar comprando". Mobile: tela
 * inteira.
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: no catálogo as vars do tema vêm de um wrapper acima do
 *    componente. Quem dá o container das `@container` é o envelope `.cartSidebar14Box`
 *    (fixo, do tamanho da tela; ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter; + / −, remover e o
 *    estado vazio funcionam só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body> nem analytics.
 */

export type CartSidebar14Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho14 = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`). A foto fica de fora
// (a URL da origem é de CDN de loja); vale o fundo do `.lineImage`. Sem `slug`: o nome sai
// como <span>, como lá.
const ITENS_14: ItemCarrinho14[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header14 usa no contador. */
export const CART_14_QUANTIDADE = ITENS_14.reduce((n, i) => n + i.quantity, 0);

const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (w: number, children: React.ReactNode, sw = '2', className?: string) => (
  <svg className={className} width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="square" aria-hidden="true">
    {children}
  </svg>
);

const Ico = {
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />, '2.2'),
  minus: svg(16, <path d="M5 12h14" />, '2.4'),
  plus: svg(16, <path d="M12 5v14M5 12h14" />, '2.4'),
  trash: svg(18, <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />),
  arrow: svg(20, <path d="M4 12h15M13 6l6 6-6 6" />, '2.4'),
};

export default function CartSidebar14({ open, onClose, onTotalChange }: CartSidebar14Props) {
  const [items, setItems] = useState<ItemCarrinho14[]>(ITENS_14);
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
    <div className={styles.cartSidebar14Box}>
      <div className={`${styles.cartSidebar14}${open ? ` ${styles.open}` : ''}`} data-role="cart-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart14-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2 id="cart14-titulo" className={styles.title} data-role="cart-title">
              Sua sacola <span className={styles.count}>{totalItems}</span>
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
                  // Só os valores, na ordem da VTEX, como no desenho.
                  const variacao = Object.keys(item.variations)
                    .filter(k => item.variations[k])
                    .map(k => item.variations[k])
                    .join(' · ');
                  return (
                    <li key={item.id} className={styles.line} data-role="cart-item">
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        <div className={styles.lineTop}>
                          <span className={styles.lineName} data-role="cart-item-name">
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
                        {variacao && <span className={styles.lineVariation}>{variacao}</span>}
                        <div className={styles.lineRow}>
                          <div className={styles.qty} role="group" aria-label={`Quantidade de ${item.name}`}>
                            <button type="button" aria-label="Diminuir quantidade" disabled={item.quantity <= 1} onClick={() => onQuantity(item.id, item.quantity - 1)}>
                              {Ico.minus}
                            </button>
                            <span className={styles.qtyValue} aria-live="polite">
                              {item.quantity}
                            </span>
                            <button type="button" aria-label="Aumentar quantidade" onClick={() => onQuantity(item.id, item.quantity + 1)}>
                              {Ico.plus}
                            </button>
                          </div>
                          <strong className={styles.linePrice} data-role="cart-item-price">
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
                  <span className={styles.subtotalValue} data-role="cart-subtotal">
                    {format(subTotal)}
                  </span>
                </div>
                <p className={styles.note}>Frete e descontos calculados no checkout.</p>
                <button type="button" className={styles.checkout} data-role="cart-checkout">
                  Finalizar compra
                  {Ico.arrow}
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
