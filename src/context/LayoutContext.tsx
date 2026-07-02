'use client';
import React, { createContext, useContext } from 'react';
import { useLayoutGenerator } from '@/hooks/useLayoutGenerator';

export type LayoutContextType = ReturnType<typeof useLayoutGenerator>;

// Exportado para que o preview compartilhável possa prover um valor semeado por
// um snapshot (sem rodar o useLayoutGenerator, que hidrata do localStorage).
export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined
);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const layout = useLayoutGenerator();
  return (
    <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used inside LayoutProvider');
  return ctx;
}
