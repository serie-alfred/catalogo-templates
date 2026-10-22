import React, { useEffect, useRef, useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar13` do faststore.starter (família 13, Noturno; desenho
 * `CartSidebar13`): a bag que o Header13 abre. Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é derivado do SCSS de lá.
 *
 * Gaveta grafite com filete à esquerda: "Bag (N)" em condensada (o número em verde) e o
 * fechar quadrado; itens com a foto 4:5, o nome, a variação ("Eixo: valor" no desktop, só os
 * valores no mobile), a quantidade − / + numa caixa com filete, o preço da linha e "Remover";
 * no pé, o subtotal, a nota fixa, "Finalizar compra" e "Continuar comprando".
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: no catálogo as vars do tema vêm de um wrapper acima do
 *    componente. Quem dá o container das `@container` é o envelope `.cartSidebar13Box`
 *    (fixo, do tamanho da tela; ver "Só no catálogo").
 *  - Sem carrinho real: o item de exemplo do `mockCart` do starter; + / −, remover e
 *    o estado vazio funcionam só para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar13Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho13 = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`). A foto fica de fora
// (a URL da origem é de CDN de loja); vale o fundo do `.lineImage`. Sem `slug` no mock: o
// nome sai como <span>, como lá.
const ITENS_13: ItemCarrinho13[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header13 usa no contador. */
export const CART_13_QUANTIDADE = ITENS_13.reduce((n, i) => n + i.quantity, 0);

const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (w: number, children: React.ReactNode, sw = '1.8', className?: string) => (
  <svg className={className} width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true">
    {children}
  </svg>
);

const Ico = {
  close: svg(20, <path d="M6 6l12 12M18 6 6 18" />, '1.8', styles.closeIcon),
  minus: svg(16, <path d="M5 12h14" />, '2'),
  plus: svg(16, <path d="M12 5v14M5 12h14" />, '2'),
};

export default function CartSidebar13({ open, onClose, onTotalChange }: CartSidebar13Props) {
  const [items, setItems] = useState<ItemCarrinho13[]>(ITENS_13);
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
    <div className={styles.cartSidebar13Box}>
      <div className={`${styles.cartSidebar13}${open ? ` ${styles.open}` : ''}`} data-role="cart-root">
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart13-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2 id="cart13-titulo" className={styles.title} data-role="cart-title">
              Bag <span className={styles.count}>({totalItems})</span>
            </h2>
            <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Fechar bag">
              {Ico.close}
            </button>
          </div>

          {items.length === 0 ? (
            <div className={styles.empty} data-role="cart-empty">
              <p className={styles.emptyText}>Sua bag está vazia.</p>
              <button type="button" className={styles.continue} onClick={onClose}>
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map(item => {
                  const eixos = Object.keys(item.variations).filter(k => item.variations[k]);
                  // Desktop: "Eixo: valor" na ordem da VTEX; mobile: só os valores, como no desenho.
                  const variacao = eixos.map(k => `${k}: ${item.variations[k]}`).join(' · ');
                  const variacaoCurta = eixos.map(k => item.variations[k]).join(' · ');
                  return (
                    <li key={item.id} className={styles.line} data-role="cart-item">
                      <span className={styles.lineImage} />
                      <div className={styles.lineBody}>
                        <span className={styles.lineName} data-role="cart-item-name">
                          {item.name}
                        </span>
                        {variacao && (
                          <span className={styles.lineVariation}>
                            <span className={styles.dsk}>{variacao}</span>
                            <span className={styles.mob}>{variacaoCurta}</span>
                          </span>
                        )}
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
                    </li>
                  );
                })}
              </ul>

              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <span className={styles.subtotalValue} data-role="cart-subtotal">
                    {format(subTotal)}
                  </span>
                </div>
                <p className={styles.note}>Frete e descontos calculados no checkout.</p>
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
