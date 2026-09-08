'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import SectionsPanel from '../SectionsPanel';
import PanelTypography from './PanelTypography';
import PanelGlobalColors from './PanelGlobalColors';
import PanelBrandAssets from './PanelBrandAssets';
import PlatformSelect from '../PlatformSelect';
import SelectSection from '../SelectSection';
import SelectSectionItem from '../SelectSectionItem';

import styles from './index.module.css';

/**
 * Painel esquerdo. O que ele mostra é decidido pelo `railTarget`; ao contrário
 * da antiga dock, ele está SEMPRE aberto — não existe estado fechado.
 *
 * O cabeçalho é mais alto em "componentes" porque só ali ele carrega a linha de
 * plataforma, então a altura NÃO pode virar uma linha do grid do shell.
 */
export default function EditorLeftPanel() {
  const {
    railTarget,
    platform,
    showPlatformError,
    handlePlatformChange,
    selections,
    focusedKey,
    setFocusedKey,
    selectedPage,
    toggleSelection,
  } = useLayout();

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
        {isComponentes && (
          <>
            <SectionsPanel />
            {/* Provisório: o seletor de componentes vira o modal
                "Componentes de seções" numa fase seguinte. Fica aqui para o
                fluxo de adicionar seção não ficar inacessível. */}
            <SelectSection
              selectedPage={selectedPage}
              activeLayoutKey={focusedKey}
              setActiveLayoutKey={setFocusedKey}
            />
            <SelectSectionItem
              activeLayoutKey={focusedKey}
              selectedImages={selections}
              onSelect={(id, layoutKey) =>
                toggleSelection(id, layoutKey, selectedPage)
              }
              selectedPage={selectedPage}
              platform={platform}
            />
          </>
        )}

        {railTarget === 'variaveis' && <PanelGlobalColors />}

        {railTarget === 'tipografia' && <PanelTypography />}

        {railTarget === 'identidade' && <PanelBrandAssets />}
      </div>
    </aside>
  );
}
