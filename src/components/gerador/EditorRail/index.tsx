'use client';

import React from 'react';
import { Palette, SquarePen, Component } from 'lucide-react';

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
  const { railTarget, setRailTarget } = useLayout();

  return (
    <nav
      className={`${styles.rail} ${className ?? ''}`}
      aria-label="Seções do editor"
    >
      <EtemasMark className={styles.mark} width={24} height={21.02} />

      {ITEMS.map(({ target, label, icon }) => (
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
    </nav>
  );
}
