'use client';

import React, { useEffect, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import ComponentVariablesPanel from '../ComponentVariablesPanel';
import CheckoutVariablesPanel from '../CheckoutVariablesPanel';
import ConteudoPanel from '../ConteudoPanel';

import styles from './index.module.css';

type Aba = 'conteudo' | 'estilo';

/** A aba escolhida fica no navegador, como as outras preferências de tela. */
const CHAVE_DA_ABA = 'painelDireitoAba';

/**
 * Painel direito: o que se edita na seção selecionada — **Conteúdo** (textos,
 * imagens e listas, `ConteudoPanel`) ou **Estilo** (cores e fontes,
 * `ComponentVariablesPanel`).
 *
 * Abre em Estilo, que era o painel inteiro antes da aba Conteúdo existir: os
 * estágios do funil que mexem nas variáveis acham o painel de sempre, e quem
 * trocar para Conteúdo uma vez fica nela (localStorage).
 *
 * O cabeçalho com "Pré-visualizar" e o botão de export foi para a EditorTopbar,
 * que passou a atravessar esta coluna — na tela os botões não mudaram de lugar.
 * O motivo é de dimensionamento: 273px de botões cravavam um piso de 320px num
 * painel cujo conteúdo mais largo (a linha do ColorPicker) cabe em ~201, e o
 * canvas pagava a diferença.
 */
export default function EditorRightPanel({
  className,
  inert,
}: {
  className?: string;
  /** Recolhido: fica no DOM (para a transição ter o que animar) mas fora do
      alcance de Tab e dos leitores de tela. */
  inert?: boolean;
}) {
  const { editorMode } = useLayout();
  const [aba, setAba] = useState<Aba>('estilo');

  useEffect(() => {
    try {
      if (localStorage.getItem(CHAVE_DA_ABA) === 'conteudo') setAba('conteudo');
    } catch {
      // Storage bloqueado: fica na aba padrão.
    }
  }, []);

  const escolher = (proxima: Aba) => {
    setAba(proxima);
    try {
      localStorage.setItem(CHAVE_DA_ABA, proxima);
    } catch {
      // Storage bloqueado: a troca vale até recarregar.
    }
  };

  return (
    <aside
      className={`${styles.panel} ${className ?? ''}`}
      aria-label="Propriedades"
      inert={inert}
    >
      {/* No checkout não há seção selecionável: o painel mostra os papéis. */}
      {editorMode !== 'checkout' && (
        <div className={styles.abas} role="tablist" aria-label="O que editar na seção">
          {(
            [
              ['conteudo', 'Conteúdo'],
              ['estilo', 'Estilo'],
            ] as const
          ).map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              role="tab"
              id={`aba-direita-${valor}`}
              aria-selected={aba === valor}
              aria-controls="painel-direito-corpo"
              className={`${styles.aba}${aba === valor ? ` ${styles.abaAtiva}` : ''}`}
              onClick={() => escolher(valor)}
              data-aba-direita={valor}
            >
              {rotulo}
            </button>
          ))}
        </div>
      )}
      <div
        id="painel-direito-corpo"
        className={`${styles.body} ed-scroll`}
        role={editorMode !== 'checkout' ? 'tabpanel' : undefined}
        aria-labelledby={editorMode !== 'checkout' ? `aba-direita-${aba}` : undefined}
      >
        {editorMode === 'checkout' ? (
          <CheckoutVariablesPanel />
        ) : aba === 'conteudo' ? (
          <ConteudoPanel />
        ) : (
          <ComponentVariablesPanel />
        )}
      </div>
    </aside>
  );
}
