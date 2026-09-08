'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import SectionsPanel from '../SectionsPanel';
import SidebarTabGlobal from '../Sidebar/SidebarTabGlobal';
import SidebarTabAssets from '../Sidebar/SidebarTabAssets';
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

        {/* Provisório: cores e fontes ainda dividem o mesmo componente; a fase
            seguinte separa em dois painéis, como no Figma. */}
        {(railTarget === 'variaveis' || railTarget === 'tipografia') && (
          <SidebarTabGlobal />
        )}

        {railTarget === 'identidade' && <SidebarTabAssets />}
      </div>
    </aside>
  );
}
