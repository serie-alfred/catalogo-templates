'use client';
import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';

/**
 * O "Card de Produto" que a loja escolheu (`layoutKey: 'spot'`), para TODA lista de
 * produtos — vitrine, grade da PLP, relacionados —, seja qual for a família da lista.
 * O card é da loja, não da lista: as variáveis dele moram no item Spot, e a lista só
 * dá o slot (grade, trilho, colunas). É o modelo do CategoryMain01, num lugar só.
 *
 * - Sem card escolhido (ou no modo LP, cujas seções não trazem o spot da loja), a
 *   lista desenha o card da própria família (`children`).
 * - `familia` é o Spot cujo card a lista já desenha como fallback (`Spot09` na
 *   vitrine 09): escolhido ele, a lista fica com o próprio, que varia os produtos do
 *   mock. As variáveis do Spot chegam a esse card pelo `data-spot` (ThemeRenderer).
 * - Outro card entra com `soCard` (só o card, sem o quadro do desenho do Spot) e as
 *   variáveis dele inline, como no CategoryMain01.
 */
export function useCardDaLoja() {
  const { selections } = useLayout();
  const spot = selections.find(sel => sel.layoutKey === 'spot');
  if (!spot) return null;
  const item = LAYOUTS.spot.items.find(it => it.id === spot.id);
  const Card = item ? TemplateRegistry[item.component] : undefined;
  if (!item || !Card) return null;
  return { componente: item.component, Card, variaveis: spot.variables };
}

export default function CardDaLoja({
  familia,
  children,
}: {
  familia?: string;
  children: React.ReactNode;
}) {
  const escolhido = useCardDaLoja();
  if (!escolhido || escolhido.componente === familia) return <>{children}</>;
  const { Card, componente, variaveis } = escolhido;
  return (
    <div
      data-card-da-loja={componente}
      style={{
        height: '100%',
        minWidth: 0,
        ...(variaveis as React.CSSProperties),
      }}
    >
      <Card soCard />
    </div>
  );
}
