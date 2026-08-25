import React, { useEffect, useState } from 'react';

import styles from './index.module.css';
import {
  formatPostalCode,
  freeShippingProgress,
  matchFreeShippingRule,
  renderFreeShippingText,
  type FreeShippingRule,
} from './freeShipping';

// Réplica preview do mini-cart do Header06 —
// faststore.starter/src/components/organisms/CartSidebar06 e o grafo que ele
// monta: molecules/FreeShippingBar06, molecules/ShippingSimulator06 e
// molecules/CartCoupon06 (inlined aqui, como manda o /from-faststore: o grafo do
// componente vira um arquivo só).
//
// Divergências deliberadas:
//  - O .starter portala o drawer para o <body> para escapar do stacking context
//    do header sticky. Aqui NÃO se portala: no catálogo as CSS vars do tema vêm
//    de um wrapper acima do componente, e sair para o <body> deixaria o minicart
//    sem cor nenhuma. O header do preview também não é sticky (quem fixa é o
//    .preview-sticky-header), então não há stacking context de que escapar.
//  - `<header06>` do .starter é elemento inválido (find/replace acidental);
//    aqui é `<header>`.
//  - Sem carrinho real: um produto placeholder, e +/-, remover, CEP e cupom
//    funcionam só para o usuário ver o comportamento no link de preview.

export interface CartSidebar06Item {
  name: string;
  image: string;
  variations: string[];
  price: number;
  listPrice: number;
}

const DEFAULT_ITEM: CartSidebar06Item = {
  name: 'Sapatênis Couro Premium',
  image: 'https://placehold.co/80x80',
  variations: ['Preto', '41'],
  price: 349.9,
  listPrice: 429.9,
};

/** Opções devolvidas pela simulação placeholder, no formato do ShippingSimulator06. */
const DELIVERY_OPTIONS = [
  { id: 'normal', label: 'Normal', estimate: 'até 7 dias úteis', price: 0 },
  { id: 'expressa', label: 'Expressa', estimate: 'até 2 dias úteis', price: 29.9 },
];

const PICKUP_OPTIONS = [
  { id: 'loja', label: 'Retirar na loja', estimate: 'até 3 dias úteis', price: 0 },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatShippingPrice = (value: number) =>
  value > 0 ? formatPrice(value) : 'Grátis';

// ── Ícones (porte de CartSidebar06/utils/icons.tsx) ──

const CloseIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none">
    <path
      d="M14.79 8.06v7.87c0 .87-.7 1.57-1.57 1.57H6.92c-.87 0-1.57-.7-1.57-1.57V8.06M8.5 8.84v5.51M11.64 8.84v5.51M15.97 5.69H4.17M13.22 5.69l-.43-1.28a1.24 1.24 0 0 0-1.5-.98H8.84c-.68 0-1.28.43-1.5 1.07l-.42 1.19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** seta do link "Voltar as compras" — 16×16, traço 1.5, como na origem */
const ArrowRightIcon = () => (
  <svg
    className={styles.continueArrow}
    viewBox="0 0 16 16"
    width="16"
    height="16"
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M6 3.5L10.5 8L6 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CartBigIcon = () => (
  <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" fill="none">
    <path d="M45 16H11l-3 26h40l-3-26Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 22V15a8 8 0 0 1 16 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** seta do "ver opções" do simulador de frete */
const ShipArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0.75 1.375L6.375 7L0.75 12.625"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── FreeShippingBar06 (inlined) ─────────────────────────────────────────────
// Regra da origem mantida: SEM CEP a barra não aparece. O limite depende da UF,
// então antes do CEP não há o que comparar.

function FreeShippingBar({
  value,
  postalCode,
  rules,
  textProgress = 'Faltam **{price}** para você ganhar **FRETE GRÁTIS!**',
  textSuccess = '**Parabéns!** você ganhou frete grátis!',
  className,
}: {
  value: number;
  postalCode?: string | null;
  rules?: FreeShippingRule[] | null;
  textProgress?: string;
  textSuccess?: string;
  className?: string;
}) {
  const rule = matchFreeShippingRule(postalCode, rules);

  if (!rule) return null;

  const { priceDiff, percent, reached } = freeShippingProgress(value, rule.price);
  const parts = renderFreeShippingText(
    reached ? textSuccess : textProgress,
    formatPrice(priceDiff)
  );

  return (
    <div
      className={`${styles.fsContainer}${className ? ` ${className}` : ''}`}
      data-role="free-shipping-bar"
      data-reached={reached || undefined}
    >
      <p className={styles.fsText}>
        {parts.map((part, i) =>
          typeof part === 'string' ? (
            <React.Fragment key={i}>{part}</React.Fragment>
          ) : (
            <strong key={i}>{part.bold}</strong>
          )
        )}
      </p>

      <div
        className={styles.fsTrack}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label="Progresso para o frete grátis"
      >
        <span className={styles.fsFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// ── ShippingSimulator06, variante `cart` (inlined) ──────────────────────────

function ShippingSimulator({
  postalCode,
  onSubmitPostalCode,
  onClearPostalCode,
  selectedId,
  onSelect,
  label = 'Frete:',
  className,
}: {
  postalCode: string;
  onSubmitPostalCode: (value: string) => void;
  onClearPostalCode: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
  className?: string;
}) {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setInput(postalCode ? formatPostalCode(postalCode) : '');
  }, [postalCode]);

  const rootClass = [styles.ssContainer, styles.ssCart, className]
    .filter(Boolean)
    .join(' ');

  const selected = [...DELIVERY_OPTIONS, ...PICKUP_OPTIONS].find(
    o => o.id === selectedId
  );

  const renderOption = (option: (typeof DELIVERY_OPTIONS)[number]) => {
    const isSelected = option.id === selectedId;
    return (
      <li
        key={option.id}
        className={`${styles.ssOption}${isSelected ? ` ${styles.ssIsSelected}` : ''}`}
        data-role="ship-option"
      >
        <button
          type="button"
          title={`${option.label} - ${option.estimate} - ${formatShippingPrice(option.price)}`}
          className={styles.ssOptionBtn}
          onClick={() => onSelect(option.id)}
          aria-pressed={isSelected}
        >
          <span className={styles.ssSelect} aria-hidden="true" />
          <strong className={styles.ssName}>{option.label}</strong>
          <span className={styles.ssTime}>{option.estimate}</span>
          <strong className={styles.ssPrice}>{formatShippingPrice(option.price)}</strong>
        </button>
      </li>
    );
  };

  if (!postalCode) {
    return (
      <div className={rootClass} data-role="shipping-simulator" data-variant="cart">
        <span className={styles.ssLabel}>{label}</span>
        <form
          className={styles.ssForm}
          onSubmit={e => {
            e.preventDefault();
            onSubmitPostalCode(input);
          }}
        >
          <label htmlFor="postalCodeInput" className={styles.srOnly}>
            Digite seu CEP para calcular o frete
          </label>
          <input
            id="postalCodeInput"
            className={styles.ssInput}
            data-role="cep-input"
            type="tel"
            inputMode="numeric"
            maxLength={9}
            placeholder="Calcule seu frete"
            value={input}
            onChange={e => setInput(formatPostalCode(e.target.value))}
          />
          <button className={styles.ssButton} data-role="calc-btn" type="submit">
            Calcular
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={rootClass} data-role="shipping-simulator" data-variant="cart">
      <span className={styles.ssLabel}>{label}</span>
      <div className={styles.ssPostalCodeBox} data-role="cep-result">
        <button
          type="button"
          title="Alterar CEP"
          className={styles.ssChangePostalCodeButton}
          onClick={onClearPostalCode}
        >
          Alterar
        </button>
        <span className={styles.ssCurrentPostalCode} data-role="cep-value">
          {`(CEP:${formatPostalCode(postalCode)})`}
        </span>
        {selected && (
          <span className={styles.ssCurrentShippingPrice} data-role="cep-price">
            {formatShippingPrice(selected.price)}
          </span>
        )}
        <button
          type="button"
          title="Ver opções"
          className={`${styles.ssOpenShippingOptionsBtn}${isOpen ? ` ${styles.ssIsOpen}` : ''}`}
          onClick={() => setIsOpen(open => !open)}
          aria-expanded={isOpen}
        >
          <ShipArrowIcon />
        </button>
      </div>

      {isOpen && (
        <div className={styles.ssOptions} data-role="ship-options">
          <div className={styles.ssGroup}>
            <h3 className={styles.ssTitle}>Receba em casa:</h3>
            <ul className={styles.ssList}>{DELIVERY_OPTIONS.map(renderOption)}</ul>
          </div>
          <div className={styles.ssGroup}>
            <h3 className={styles.ssTitle}>Retire na loja:</h3>
            <ul className={styles.ssList}>{PICKUP_OPTIONS.map(renderOption)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CartCoupon06 (inlined) ──────────────────────────────────────────────────

function CartCoupon({
  coupon,
  onApply,
  onRemove,
  label = 'Cupom:',
  placeholder = 'Insira seu cupom',
  applyLabel = 'Aplicar',
  className,
}: {
  coupon: string;
  onApply: (code: string) => void;
  onRemove: () => void;
  label?: string;
  placeholder?: string;
  applyLabel?: string;
  className?: string;
}) {
  const [value, setValue] = useState('');

  return (
    <div
      className={`${styles.cpContainer}${className ? ` ${className}` : ''}`}
      data-role="cart-coupon"
    >
      <span className={styles.cpLabel}>{label}</span>

      {coupon ? (
        <button
          type="button"
          className={styles.cpChip}
          onClick={onRemove}
          title="Remover cupom"
          aria-label={`Remover cupom ${coupon}`}
        >
          {coupon}
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : (
        <form
          className={styles.cpForm}
          onSubmit={e => {
            e.preventDefault();
            const text = value.trim().toUpperCase();
            if (!text) return;
            onApply(text);
            setValue('');
          }}
        >
          <label className={styles.srOnly} htmlFor="cart-coupon-input">
            {placeholder}
          </label>
          <input
            id="cart-coupon-input"
            className={styles.cpInput}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={ev => setValue(ev.target.value)}
            data-role="coupon-input"
          />
          <button
            type="submit"
            className={styles.cpApply}
            disabled={!value.trim()}
            title={applyLabel}
            data-role="coupon-apply"
          >
            {applyLabel}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Componente ──────────────────────────────────────────────────────────────

interface CartSidebar06Props {
  open: boolean;
  onClose: () => void;
  item?: CartSidebar06Item;
}

/** Desconto placeholder aplicado por qualquer cupom digitado, em reais. */
const COUPON_DISCOUNT = 20;

export default function CartSidebar06({
  open,
  onClose,
  item = DEFAULT_ITEM,
}: CartSidebar06Props) {
  const [quantity, setQuantity] = useState(1);
  const [removed, setRemoved] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [shippingOption, setShippingOption] = useState('normal');
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

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
    if (!open) return;
    setQuantity(1);
    setRemoved(false);
    setCoupon('');
  }, [open]);

  const isEmpty = removed;
  const subTotal = item.listPrice * quantity;
  const total = item.price * quantity;
  const discount = subTotal - total;
  const couponDiscount = coupon ? COUPON_DISCOUNT : 0;
  const displayTotal = Math.max(0, total - couponDiscount);
  const hasDiscount = item.listPrice > item.price;

  return (
    <>
      <div
        className={`${styles.overlay}${open ? ` ${styles.open}` : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer}${open ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        aria-hidden={!open}
      >
        <header className={styles.head}>
          <h2 className={styles.headTitle}>
            Carrinho
            {!isEmpty && <span className={styles.headCount}>({quantity})</span>}
          </h2>
          <button
            type="button"
            className={styles.headClose}
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <CloseIcon />
          </button>
        </header>

        {isEmpty ? (
          <div className={styles.empty}>
            <CartBigIcon />
            <p>Seu carrinho está vazio</p>
            <button type="button" className={styles.emptyBtn} onClick={onClose}>
              Comece a comprar
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              <li className={styles.item}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} width={80} height={80} />
                </div>

                <div className={styles.itemBody}>
                  <button
                    type="button"
                    className={styles.itemRemove}
                    aria-label="Remover item"
                    onClick={() => setRemoved(true)}
                  >
                    <TrashIcon />
                  </button>

                  <p className={styles.itemTitle}>{item.name}</p>

                  <div className={styles.itemSkus}>
                    {item.variations.map(variation => (
                      <span key={variation}>{variation}</span>
                    ))}
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      >
                        <MinusIcon />
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => setQuantity(q => q + 1)}
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    <div className={styles.itemPrice}>
                      {hasDiscount && (
                        <span className={styles.itemListPrice}>
                          {formatPrice(item.listPrice)}
                        </span>
                      )}
                      <span className={styles.itemSpotPrice}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <footer className={styles.footer}>
              {/* Barra de frete grátis — primeira coisa do rodapé, como na origem.
                  Ela mesma se esconde quando não há CEP (gate da produção). */}
              <FreeShippingBar
                value={displayTotal}
                postalCode={postalCode}
                className={styles.cartFreeShipping}
              />

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(subTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                    <span>Descontos:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                {/* CEP + opções de entrega — o mesmo componente da PDP. */}
                <ShippingSimulator
                  postalCode={postalCode}
                  onSubmitPostalCode={value =>
                    setPostalCode(value.replace(/\D/g, '').length === 8 ? value : '')
                  }
                  onClearPostalCode={() => setPostalCode('')}
                  selectedId={shippingOption}
                  onSelect={setShippingOption}
                  className={styles.cartShipping}
                />

                <CartCoupon
                  coupon={coupon}
                  onApply={setCoupon}
                  onRemove={() => setCoupon('')}
                  className={styles.cartCoupon06}
                />

                {couponDiscount !== 0 && (
                  <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                    <span>Cupom:</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className={styles.summaryTotal}>
                  <span>Total:</span>
                  <span>{formatPrice(displayTotal)}</span>
                </div>
              </div>

              <div className={styles.buttons}>
                <button type="button" className={styles.finish}>
                  Finalizar Compra
                </button>
                {/* Secundário: na origem NÃO é botão contornado — é um link de
                    texto cinza com seta, que ganha borda inferior no hover. */}
                <button type="button" className={styles.continue} onClick={onClose}>
                  Voltar as compras
                  <ArrowRightIcon />
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
