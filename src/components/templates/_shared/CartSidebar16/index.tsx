import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar16` do faststore.starter (família 16, Infantil; desenho
 * `CartSidebar16`): a sacola que o Header16 abre. Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é derivado do SCSS de lá.
 *
 * Gaveta creme com o canto esquerdo arredondado e o filete escuro: "Sua sacola" com o contador
 * em pílula de destaque e o fechar redondo; itens com a foto arredondada, o nome, a variação,
 * a quantidade em pílula − / + com o preço da linha e "Remover" com a lixeira, entre filetes
 * tracejados; no pé, o cartão com o subtotal, a nota fixa, "Finalizar compra" e "Continuar
 * comprando". Mobile: tela inteira, sem o canto arredondado.
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: as vars do tema vêm de um wrapper acima do componente. Quem dá o
 *    container das `@container` é o envelope `.cartSidebar16Box` (ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter (o mesmo do palco);
 *    + / −, remover e o estado vazio funcionam só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar16Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho16 = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`). A foto fica de fora (a URL
// da origem é de CDN de loja); vale o fundo do `.lineImage`. Sem `slug`: o nome sai como <span>.
const ITENS_16: ItemCarrinho16[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header16 usa no contador. */
export const CART_16_QUANTIDADE = ITENS_16.reduce((n, i) => n + i.quantity, 0);

const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (w: number, children: React.ReactNode, sw = '2.6', className?: string) => (
  <svg className={className} width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const Ico = {
  close: svg(20, <path d="M6 6l12 12M18 6 6 18" />),
  minus: svg(16, <path d="M5 12h14" />, '2.6', styles.qtyIcon),
  plus: svg(16, <path d="M12 5v14M5 12h14" />, '2.6', styles.qtyIcon),
  trash: svg(15, <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />, '2.2', styles.trashIcon),
};

export default function CartSidebar16({ open, onClose, onTotalChange }: CartSidebar16Props) {
  const [items, setItems] = useState<ItemCarrinho16[]>(ITENS_16);
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

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={styles.cartSidebar16Box}>
      <div className={`${styles.cartSidebar16}${open ? ` ${styles.open}` : ''}`} data-role="cart-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart16-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2 id="cart16-titulo" className={styles.title} data-role="cart-title">
              Sua sacola
              <span className={styles.count} aria-label={`${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}>
                {totalItems}
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
                  const variacao = Object.keys(item.variations)
                    .filter(k => item.variations[k])
                    .map(k => `${k}: ${item.variations[k]}`)
                    .join(' · ');
                  return (
                    <li key={item.id} className={styles.line} data-role="cart-item">
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        <span className={styles.lineName} data-role="cart-item-name">
                          {item.name}
                        </span>
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
                        <button type="button" className={styles.remove} onClick={() => remover(item.id)} aria-label={`Remover ${item.name}`} data-role="cart-item-remove">
                          {Ico.trash}
                          Remover
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.footer}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue} data-role="cart-subtotal">
                    {format(subTotal)}
                  </span>
                </div>
                <span className={styles.note}>Frete e descontos calculados no checkout.</span>
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
