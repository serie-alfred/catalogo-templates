'use client';

import React from 'react';
import { LayoutTemplate, SquarePen } from 'lucide-react';

import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * O convite da aba nova: o editor NÃO abre com layout montado. Com a loja
 * vazia (e só no modo loja — a LP tem a composição inicial dela, e o checkout
 * tem estrutura fixa), o canvas mostra duas portas de entrada: "Por template"
 * (uma família inteira, com paleta e fontes) ou começar do zero em
 * "Componentes".
 *
 * Fica POR CIMA do iframe, dentro da célula do canvas: o PreviewFrame segue
 * montado (o handshake não é refeito) e os painéis continuam clicáveis.
 * Some quando a loja ganha a primeira seção, ou no "Começar do zero".
 */
export default function EmptyCanvas() {
  const {
    mostrarInicio,
    comecarPorTemplate,
    comecarDoZero,
    railTarget,
    platform,
  } = useLayout();

  if (!mostrarInicio) return null;

  const escolhendoTemplate = railTarget === 'templates';

  return (
    <div className={styles.overlay} data-canvas-vazio="">
      <div className={styles.card} role="region" aria-label="Comece seu tema">
        <h2 className={styles.title}>Comece seu tema</h2>
        <p className={styles.text}>
          {escolhendoTemplate
            ? platform
              ? 'Escolha um template no painel à esquerda: ele preenche home, categoria e produto com as peças de uma família, já com a paleta e as fontes do desenho.'
              : 'Escolha a plataforma no painel à esquerda para ver os templates completos.'
            : 'O editor abre vazio. Parta de um template pronto, com todas as páginas montadas, ou monte a loja peça por peça.'}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={comecarPorTemplate}
            data-inicio="template"
            aria-pressed={escolhendoTemplate}
          >
            <LayoutTemplate width={20} height={20} />
            Escolher um template
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={comecarDoZero}
            data-inicio="zero"
          >
            <SquarePen width={18} height={18} />
            Começar do zero
          </button>
        </div>
      </div>
    </div>
  );
}
