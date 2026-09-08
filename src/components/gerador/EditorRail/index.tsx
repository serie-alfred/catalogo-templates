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
 * A largura NÃO é declarada: o rail é hug, como no Figma. `padding: 24px` de
 * cada lado + o mark de 27.404px dão exatamente os 75.404px do design, e
 * 75.404 + 344.596 (painel esquerdo) = 420 = a largura do painel direito.
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

export default function EditorRail() {
  const { railTarget, setRailTarget } = useLayout();

  return (
    <nav className={styles.rail} aria-label="Seções do editor">
      <EtemasMark className={styles.mark} />

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
