'use client';

import React from 'react';

import { CHECKOUT_ETAPAS, type CheckoutEtapa } from '@/utils/checkout';
import Dropdown from '../SelectPage/Dropdown';

const OPCOES = CHECKOUT_ETAPAS.map(e => ({ key: e.id, name: e.rotulo }));

/**
 * O SelectPage do modo Checkout: em vez das páginas da loja, as etapas do
 * checkout nativo — Carrinho · E-mail · Identificação · Entrega · Pagamento.
 * "Identificação" é o `#/profile` (a ETP2 do Figma); o e-mail tem o visual dela
 * mas é outra tela. A Confirmação fica de fora: é o Order Placed, que o
 * checkout-vtex não estiliza (docs/arquitetura.md).
 */
export default function SelectCheckoutStep({
  etapa,
  setEtapa,
}: {
  etapa: CheckoutEtapa;
  setEtapa: (etapa: CheckoutEtapa) => void;
}) {
  return (
    <Dropdown
      options={OPCOES}
      value={etapa}
      onChange={setEtapa}
      ariaLabel="Etapa do checkout"
      fallback={OPCOES[0]}
    />
  );
}
