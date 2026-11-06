import React, { useEffect, useRef, useState } from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/CartSidebar17` do faststore.starter (família 17, Pet; desenho
 * `CartSidebar17` / `CartSidebar17-mobile`): a sacola que o Header17 abre. Mesmo markup,
 * mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1 (`--cart-*`); o CSS é
 * derivado do SCSS de lá.
 *
 * Gaveta branca com o canto esquerdo arredondado: "Sua sacola" em Bricolage com o contador em
 * pílula clara ("N itens") e o fechar redondo; itens com a foto num quadro claro, o nome, a
 * linha "marca · variação", a quantidade em pílula − / + com o preço da linha e "Remover" com
 * a lixeira, entre filetes; no pé, o cartão claro com o subtotal, a nota fixa, "Finalizar
 * compra" com a seta e "Continuar comprando" com contorno. Mobile: tela inteira.
 *
 * Divergências deliberadas:
 *  - Sem portal no <body>: as vars do tema vêm de um wrapper acima do componente. Quem dá o
 *    container das `@container` é o envelope `.cartSidebar17Box` (ver "Só no catálogo").
 *  - Sem carrinho real: o item do `mockCart` do starter, o mesmo que o palco mostra (o
 *    desenho traz 2 itens de ração; a paridade com o starter vale mais). O contador soma as
 *    quantidades, como o `totalItems` do core. + / −, remover e o estado vazio funcionam só
 *    para o usuário ver o comportamento.
 *  - Sem trava de scroll do <body>: no canvas ela travaria o editor.
 */

export type CartSidebar17Props = {
  open: boolean;
  onClose: () => void;
  /** O contador do header acompanha o + / − / remover da gaveta. */
  onTotalChange?: (total: number) => void;
};

type ItemCarrinho17 = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  variations: Record<string, string>;
};

// O mesmo item do `mockCart` global do starter (`utils/mockCart`), como nas 09 a 16: o palco
// do Header17 mostra esse carrinho, e a réplica tem de contar a mesma história (o 2-fidelidade
// compara nó a nó). A foto fica de fora (a URL da origem é de CDN de loja); vale o quadro claro
// do `.lineFrame`. Sem `slug`: o nome sai como <span>.
const ITENS_17: ItemCarrinho17[] = [
  {
    id: 'mock-cart-item-4077-281G',
    name: 'Sapato Masculino Preto Liverpool',
    brand: 'Minha Loja',
    price: 287.92,
    quantity: 1,
    variations: { Cor: 'Preto', Tamanho: '41' },
  },
];

/** Quantidade inicial do carrinho de exemplo — o Header17 usa no contador. */
export const CART_17_QUANTIDADE = ITENS_17.reduce((n, i) => n + i.quantity, 0);


const format = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const svg = (
  w: number,
  children: React.ReactNode,
  sw = '1.8',
  className?: string
) => (
  <svg
    className={className}
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Ico = {
  close: svg(20, <path d="M6 6l12 12M18 6 6 18" />),
  minus: svg(16, <path d="M5 12h14" />, '2'),
  plus: svg(16, <path d="M12 5v14M5 12h14" />, '2'),
  trash: svg(
    15,
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  ),
  arrow: svg(18, <path d="M5 12h14M13 6l6 6-6 6" />, '2'),
};

function CartLine17({
  item,
  onQuantity,
  onRemove,
}: {
  item: ItemCarrinho17;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  // "marca · Eixo: valor" ("Nobre Pet · Peso: 15 kg"), como o starter monta do SKU.
  const variacao = [
    item.brand,
    ...Object.keys(item.variations)
      .filter(k => item.variations[k])
      .map(k => `${k}: ${item.variations[k]}`),
  ]
    .filter(Boolean)
    .join(' · ');
  const name = item.name;

  return (
    <li className={styles.line} data-role="cart-item">
      <span className={styles.lineImage}>
        <span className={styles.lineFrame} />
      </span>
      <div className={styles.lineBody}>
        <span className={styles.lineName} data-role="cart-item-name">
          {name}
        </span>
        {variacao && <span className={styles.lineVariation}>{variacao}</span>}
        <div className={styles.lineRow}>
          <div
            className={styles.qty}
            role="group"
            aria-label={`Quantidade de ${name}`}
          >
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
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => onQuantity(item.id, item.quantity + 1)}
            >
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
          onClick={() => onRemove(item.id)}
          aria-label={`Remover ${name}`}
          data-role="cart-item-remove"
        >
          {Ico.trash}
          Remover
        </button>
      </div>
    </li>
  );
}

export default function CartSidebar17({
  open,
  onClose,
  onTotalChange,
}: CartSidebar17Props) {
  const [items, setItems] = useState<ItemCarrinho17[]>(ITENS_17);
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
    <div className={styles.cartSidebar17Box}>
      <div
        className={`${styles.cartSidebar17}${open ? ` ${styles.open}` : ''}`}
        data-role="cart-root"
      >
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart17-titulo"
          aria-hidden={!open}
          {...(!open ? ({ inert: true } as Record<string, boolean>) : {})}
        >
          <div className={styles.head}>
            <h2
              id="cart17-titulo"
              className={styles.title}
              data-role="cart-title"
            >
              Sua sacola
              <span
                className={styles.count}
              >{`${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}</span>
            </h2>
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
                {items.map(item => (
                  <CartLine17
                    key={item.id}
                    item={item}
                    onQuantity={onQuantity}
                    onRemove={remover}
                  />
                ))}
              </ul>

              <div className={styles.footer}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span
                    className={styles.summaryValue}
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
