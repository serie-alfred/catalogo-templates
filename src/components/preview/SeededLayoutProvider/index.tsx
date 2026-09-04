'use client';

import React, { useMemo } from 'react';
import {
  LayoutContext,
  type LayoutContextType,
} from '@/context/LayoutContext';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';

export interface LayoutSeed {
  logo?: string;
  selections?: LayoutSelection[];
}

const noop = () => {};

/**
 * Contexto semeado para renderizar templates FORA do editor (o preview /p e o
 * iframe da visão mobile).
 *
 * Rodar `useLayoutGenerator` nesses lugares hidrataria o localStorage do autor
 * e daria ao preview um estado próprio, divergindo do que está sendo editado.
 * Então o valor é montado à mão — daí o cast, que é o escape sancionado aqui
 * (`no-explicit-any` é `error` no ESLint).
 *
 * IMPORTANTE: templates só podem ler `logo` e `selections` do `useLayout()`.
 * Os defaults abaixo existem para que um consumidor novo receba algo válido em
 * vez de `undefined` — mas se um template passar a depender de outro campo,
 * adicione-o ao seed em vez de confiar no default.
 */
export default function SeededLayoutProvider({
  seed,
  children,
}: {
  seed: LayoutSeed;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () =>
      ({
        // Defaults seguros para tudo que os templates podem tocar.
        selections: [],
        logo: '',
        favicon: '',
        isMobileView: false,
        editingUid: null,
        selectedUid: null,
        hoveredUid: null,
        focusedKey: null,
        platform: null,
        selectedPage: 'home',
        setSelections: noop,
        setEditingUid: noop,
        setSelectedUid: noop,
        setHoveredUid: noop,
        setItemVariable: noop,
        resetItemVariables: noop,
        // O snapshot vence os defaults.
        ...seed,
      }) as unknown as LayoutContextType,
    [seed]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}
