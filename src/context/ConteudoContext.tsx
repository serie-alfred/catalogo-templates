'use client';

import { createContext } from 'react';

import type { ConteudoDaSecao, ConteudoLoja } from '@/types/conteudo';

/**
 * O conteúdo de UMA seção, posto pelo `ThemeRenderer` em volta de cada template.
 *
 * Mora fora do `LayoutContext` de propósito: o /p e o iframe forjam aquele
 * contexto à mão (`SeededLayoutProvider`, com `as unknown as`), e o compilador
 * não pegaria um campo novo esquecido lá. Este contexto vem do mesmo
 * `ThemeRenderer` em todas as superfícies — canvas, /p, palco do export.
 *
 * Fora de um `ThemeRenderer` (thumbs, testes) o valor é `null` e o template
 * mostra o mock.
 */
export interface ConteudoDaSecaoNoContexto {
  /** A chave do `TemplateRegistry` (`Header09`): de quem é o schema. */
  componente: string;
  /** O Nível 1 da seção, como está no estado (sem sanitizar). */
  conteudo?: ConteudoDaSecao;
}

export const SecaoConteudoContext =
  createContext<ConteudoDaSecaoNoContexto | null>(null);

/**
 * O conteúdo da LOJA (Nível 2), já sanitizado, posto pelo `ThemeRenderer` em
 * volta da página inteira. Cada superfície o passa ao renderer: o canvas pela
 * mensagem `content` do iframe, o palco do export pelo hook, o /p pelo
 * snapshot. `null` = loja sem conteúdo, cada seção mostra o próprio.
 */
export const ConteudoLojaContext = createContext<ConteudoLoja | null>(null);
