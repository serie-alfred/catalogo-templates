'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import PanelComponents from './PanelComponents';
import PanelTypography from './PanelTypography';
import PanelGlobalColors from './PanelGlobalColors';
import PanelBrandAssets from './PanelBrandAssets';
import PlatformSelect from '../PlatformSelect';

import styles from './index.module.css';

/**
 * Painel esquerdo. O que ele mostra é decidido pelo `railTarget`; ao contrário
 * da antiga dock, ele está SEMPRE aberto — não existe estado fechado.
 *
 * O cabeçalho é mais alto em "componentes" porque só ali ele carrega a linha de
 * plataforma, então a altura NÃO pode virar uma linha do grid do shell.
 */
export default function EditorLeftPanel() {
  const { railTarget, platform, showPlatformError, handlePlatformChange } =
    useLayout();

  const isComponentes = railTarget === 'componentes';

  return (
    <aside className={styles.panel} aria-label="Painel de edição">
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Editor de Temas</span>
          <span className={styles.version}>V1.2</span>
        </div>

        {isComponentes && (
          <PlatformSelect
            value={platform}
            showError={showPlatformError}
            onChange={handlePlatformChange}
          />
        )}
      </header>

      <div className={`${styles.body} ed-scroll`}>
        {isComponentes && <PanelComponents />}

        {railTarget === 'variaveis' && <PanelGlobalColors />}

        {railTarget === 'tipografia' && <PanelTypography />}

        {railTarget === 'identidade' && <PanelBrandAssets />}
      </div>
    </aside>
  );
}
