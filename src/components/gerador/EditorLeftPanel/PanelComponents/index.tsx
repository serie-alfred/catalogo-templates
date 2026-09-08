'use client';

import React, { useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import SectionsPanel from '../../SectionsPanel';
import SelectSection from '../../SelectSection';
import SelectSectionItem from '../../SelectSectionItem';
import { Plus } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Destino "Componentes" do rail: a lista de seções da página e o acesso ao
 * catálogo.
 *
 * O catálogo ainda abre embutido, abaixo da lista. O Figma o desenha como o
 * modal "Componentes de seções" — trocar a casca é a fase seguinte; o conteúdo
 * (SelectSection + SelectSectionItem) já é o mesmo.
 */
export default function PanelComponents() {
  const {
    selections,
    focusedKey,
    setFocusedKey,
    selectedPage,
    platform,
    toggleSelection,
  } = useLayout();

  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <SectionsPanel />

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.add}
          onClick={() => setPickerOpen(prev => !prev)}
          aria-expanded={pickerOpen}
        >
          <Plus width={24} height={24} />
          Adicionar seção
        </button>
      </div>

      {pickerOpen && (
        <div className={styles.picker}>
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
        </div>
      )}
    </>
  );
}
