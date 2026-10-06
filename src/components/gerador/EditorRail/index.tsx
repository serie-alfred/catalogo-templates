'use client';

import React from 'react';
import { Palette, SquarePen, Component, ShoppingCart } from 'lucide-react';

import { useLayout } from '@/context/LayoutContext';
import type { RailTarget } from '@/hooks/useLayoutGenerator';
import { EtemasMark, TypeCase } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Rail de navegação do editor. Quatro destinos, na ordem do Figma; o mark do
 * E-temas no topo é decorativo.
 *
 * A largura NÃO é declarada aqui: quem dimensiona é a trilha do grid do shell
 * (`--ed-rail-w`, hoje 56px). O rail era hug no Figma — 24 + mark de 27.404 +
 * 24 = 75.404 — e sobravam 19px de cromo em volta de ícones de 20. O mark passa
 * a ser desenhado a 24 de largura (a altura acompanha, 27.404×24 → 24×21).
 *
 * Cada ícone tem o tamanho literal do Figma — o "Aa" não é quadrado.
 */
const ITEMS: { target: RailTarget; label: string; icon: React.ReactNode }[] = [
  {
    target: 'componentes',
    label: 'Componentes',
    icon: <SquarePen width={18} height={18} />,
  },
  {
    target: 'variaveis',
    label: 'Variáveis globais',
    icon: <Palette width={20} height={20} />,
  },
  {
    target: 'tipografia',
    label: 'Tipografia',
    icon: <TypeCase width={20} height={9.998} />,
  },
  {
    target: 'identidade',
    label: 'Identidade visual',
    icon: <Component width={20} height={20} />,
  },
];

export default function EditorRail({ className }: { className?: string }) {
  const { railTarget, setRailTarget, platform, editorMode, setEditorMode } =
    useLayout();
  const noCheckout = editorMode === 'checkout';
  // No checkout a estrutura é fixa: não há seção para compor.
  const itens = noCheckout
    ? ITEMS.filter(i => i.target !== 'componentes')
    : ITEMS;

  return (
    <nav
      className={`${styles.rail} ${className ?? ''}`}
      aria-label="Seções do editor"
      data-deselect-zone
    >
      <EtemasMark className={styles.mark} width={24} height={21.02} />

      {itens.map(({ target, label, icon }) => (
        <button
          key={target}
          type="button"
          className={styles.item}
          aria-label={label}
          title={label}
          aria-current={railTarget === target ? 'page' : undefined}
          onClick={() => setRailTarget(target)}
        >
          {icon}
        </button>
      ))}

      {/* Onde o usuário "seleciona o checkout". Só existe em VTEX — o
          checkout-vtex é o checkout NATIVO da VTEX — e vem depois dos
          destinos, com um divisor: não é um painel, é o que o canvas mostra.
          `aria-pressed`, e não `aria-current`, que é dos destinos. */}
      {platform === 'VTEX' && <span className={styles.divisor} aria-hidden />}
      {platform === 'VTEX' && (
        <button
          type="button"
          className={`${styles.item} ${styles.modo}`}
          aria-label="Checkout"
          title={noCheckout ? 'Voltar para a loja' : 'Editar o checkout'}
          aria-pressed={noCheckout}
          data-editor-mode-toggle=""
          onClick={() => setEditorMode(noCheckout ? 'loja' : 'checkout')}
        >
          <ShoppingCart width={20} height={20} />
        </button>
      )}
    </nav>
  );
}
