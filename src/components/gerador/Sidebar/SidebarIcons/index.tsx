import React from 'react';
import Link from 'next/link';
import { iconsGenerator } from '@/assets/icons/generator';
import ResponsiveToggle from '../../ResponsiveToggle';
import styles from './index.module.css';

type Tab = 'global' | 'build';

interface Props {
  toggleTab: (tab: Tab) => void;
  onExport: (e: React.FormEvent) => Promise<void>;
  onToggleMobile: () => void;
  isMobile: boolean;
  activeTab: string | null;
}

export default function SidebarIcons({
  toggleTab,
  onExport,
  isMobile,
  onToggleMobile,
  activeTab,
}: Props) {
  return (
    <div className={styles.mainMenu}>
      <Link href="#">{iconsGenerator.etemas}</Link>
      <button
        title="Editar o Tema"
        onClick={() => toggleTab('build')}
        className={`icon ${activeTab == 'build' ? 'active' : ''}`}
      >
        {iconsGenerator.editTheme}
      </button>
      <button
        title="Variáveis Globais"
        onClick={() => toggleTab('global')}
        className={`icon ${activeTab == 'global' ? 'active' : ''}`}
      >
        {iconsGenerator.configTheme}
      </button>
      <button title="Exporta Meu Tema" className="icon" onClick={onExport}>
        {iconsGenerator.exportTheme}
      </button>

      <ResponsiveToggle isMobile={isMobile} onToggleMobile={onToggleMobile} />
    </div>
  );
}
