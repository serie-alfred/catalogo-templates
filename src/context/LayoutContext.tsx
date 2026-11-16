'use client';
import React, { createContext, useContext } from 'react';
import { useLayoutGenerator } from '@/hooks/useLayoutGenerator';
import type { ContaAtual } from '@/types/conta';

export type LayoutContextType = ReturnType<typeof useLayoutGenerator>;

// Exportado para que o preview compartilhável possa prover um valor semeado por
// um snapshot (sem rodar o useLayoutGenerator, que hidrata do localStorage).
export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined
);

export function LayoutProvider({
  children,
  conta,
}: {
  children: React.ReactNode;
  /** Quem está no editor (resolvido no servidor, no layout do /gerador). */
  conta: ContaAtual;
}) {
  const layout = useLayoutGenerator(conta);
  return (
    <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used inside LayoutProvider');
  return ctx;
}
